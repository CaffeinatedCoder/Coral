﻿using Coral.Database.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Coral.Dto.Models
{
    public record SimpleAlbumDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public List<SimpleArtistDto> Artists { get; set; } = null!;
        public AlbumType? Type { get; set; }
        public int ReleaseYear { get; set; }
    }
}
