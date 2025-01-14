using AutoMapper;
using AutoMapper.QueryableExtensions;
using Coral.Configuration;
using Coral.Database;
using Coral.Database.Models;
using Coral.Dto.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Metadata;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Processing.Processors.Transforms;

namespace Coral.Services;

public interface IArtworkService
{
    public Task ProcessArtwork(Album album, string artworkPath);
    public Task<string?> ExtractEmbeddedArtwork(ATL.Track track);
    public Task<ArtworkDto?> GetArtworkForAlbum(int albumId);
    public Task<string?> GetArtworkPath(int artworkId);
}

public class ArtworkService : IArtworkService
{
    private readonly CoralDbContext _context;
    private readonly ILogger<ArtworkService> _logger;
    private readonly IMapper _mapper;
    private readonly IHttpContextAccessor _httpContextAccessor;
    
    public ArtworkService(CoralDbContext context, ILogger<ArtworkService> logger, IMapper mapper, IHttpContextAccessor httpContext)
    {
        _context = context;
        _logger = logger;
        _mapper = mapper;
        _httpContextAccessor = httpContext;
    }

    public async Task<string?> GetPathForOriginalAlbumArtwork(int albumId)
    {
        return await _context.Artworks
            .Where(a => a.Album.Id == albumId && a.Size == ArtworkSize.Original)
            .Select(a => a.Path)
            .FirstOrDefaultAsync();
    }
    private string CreateLinkForArtwork(List<Artwork> artworkList, ArtworkSize requestedSize)
    {
        var requestedArtwork = artworkList.FirstOrDefault(a => a.Size == requestedSize);
        if (requestedArtwork == null) return "";
        var scheme = _httpContextAccessor.HttpContext.Request.Scheme;
        var host = _httpContextAccessor.HttpContext.Request.Host;
        return $"{scheme}://{host}/api/artwork/{requestedArtwork.Id}";
    }

    public async Task<ArtworkDto?> GetArtworkForAlbum(int albumId)
    {
        var artworkList = await _context.Albums.Where(a => a.Id == albumId)
            .Select(a => a.Artworks)
            .FirstOrDefaultAsync();
        if (artworkList == null) return null;
        return new ArtworkDto()
        {
            Small = CreateLinkForArtwork(artworkList, ArtworkSize.Small),
            Medium = CreateLinkForArtwork(artworkList, ArtworkSize.Medium),
            Original = CreateLinkForArtwork(artworkList, ArtworkSize.Original)
        };
    }

    public async Task<string?> GetArtworkPath(int artworkId)
    {
        return await _context.Artworks
            .Where(a => a.Id == artworkId)
            .Select(a => a.Path)
            .FirstOrDefaultAsync();
    }

    public async Task<string?> ExtractEmbeddedArtwork(ATL.Track track)
    {
        var outputDir = ApplicationConfiguration.ExtractedArtwork;
        
        var guid = Guid.NewGuid();
        var outputFile = Path.Join(outputDir, $"{guid}.jpg");
        
        var artwork = track.EmbeddedPictures.FirstOrDefault();
        if (artwork == null)
        {
            return null;
        }
        _logger.LogInformation("Found embedded artwork in file {Track}", track.Path);
        var image = await Image.LoadAsync(new MemoryStream(artwork.PictureData));
        await image.SaveAsJpegAsync(outputFile);
        return outputFile;
    }

    public async Task ProcessArtwork(Album album, string artworkPath)
    {
        var guid = Guid.NewGuid();
        var outputDir = Path.Join(ApplicationConfiguration.Thumbnails, guid.ToString());
        Directory.CreateDirectory(outputDir);
        
        var sizes = new Dictionary<ArtworkSize, Size>()
        {
            {ArtworkSize.Small, new Size(100, 100)},
            {ArtworkSize.Medium, new Size(300, 300)}
        };

        foreach (var (artworkSize, size) in sizes)
        {
            // because image mutations affect the loaded image,
            // we'll reload and dispose for each mutation
            using var imageToResize = await Image.LoadAsync(artworkPath);
            var outputFile = Path.Join(outputDir, $"{artworkSize.ToString()}.jpg");
            imageToResize.Mutate(i => i.Resize(size.Width, size.Height, KnownResamplers.Lanczos3));
            await imageToResize.SaveAsJpegAsync(outputFile);
            album.Artworks.Add(new Artwork()
            {
                Path = outputFile,
                Height = size.Height,
                Width = size.Width,
                Size = artworkSize
            });
        }
        
        // after processing thumbnails, add original cover as well
        using var originalImage = await Image.LoadAsync(artworkPath);
        album.Artworks.Add(new Artwork
        {
            Path = artworkPath,
            Size = ArtworkSize.Original,
            Height = originalImage.Height,
            Width = originalImage.Width
        });
        
        await _context.SaveChangesAsync();
    }
}