﻿
using chess.Core.Enums;

namespace chess.Core.Entities;

public class GameTiming {

    /// <summary>
    /// Id
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Timing type
    /// </summary>
    public TimingTypes Type { get; set; }

    /// <summary>
    /// Duretion of the game (in minutes)
    /// </summary>
    public int Minutes { get; set; }

    /// <summary>
    /// Time increment (in seconds)
    /// </summary>
    public int Increment { get; set; }

    /// <summary>
    /// Games with this timeing type
    /// </summary>
    public List<Game> Games { get; set; }
}
