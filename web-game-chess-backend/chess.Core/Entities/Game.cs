﻿
namespace chess.Core.Entities;
#pragma warning disable CS8618

public class Game {
    public Guid Id { get; set; }
    public string Position { get; set; } = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
    public bool HasEnded { get; set; } = false;
    public DateTime CreatedAt { get; set; }

    public Guid WhitePlayerId { get; set; }
    public Player WhitePlayer { get; set; }
    
    public Guid BlackPlayerId { get; set; }
    public Player BlackPlayer { get; set; }

}
