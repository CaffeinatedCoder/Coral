﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Coral.Plugin.LastFM
{
    public class LastFmConfiguration
    {
        public const string SectionName = "Settings";
        public string ApiKey { get; set; } = null!;
        public string SharedSecret { get; set; } = null!;
    }
}
