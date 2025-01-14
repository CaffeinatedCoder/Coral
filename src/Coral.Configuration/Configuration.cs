﻿using System.Dynamic;

namespace Coral.Configuration
{
    public static class ApplicationConfiguration
    {
        public static string HLSDirectory { get; } = Path.Join(Path.GetTempPath(), "CoralHLS");
        public static string AppData { get; } = Path.Join(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Coral");
        public static string Thumbnails { get; } = Path.Join(AppData, "Thumbnails");
        public static string ExtractedArtwork { get;  } = Path.Join(AppData, "Extracted Artwork");
        public static string Plugins { get; } = Path.Join(AppData, "Plugins");

        public static void EnsureDirectoriesAreCreated()
        {
            Directory.CreateDirectory(AppData);
            Directory.CreateDirectory(HLSDirectory);
            Directory.CreateDirectory(Thumbnails);
            Directory.CreateDirectory(ExtractedArtwork);
            Directory.CreateDirectory(Plugins);
        }
    }
}