
namespace chess.Core.Entities;
#pragma warning disable CS8618

public class GameMessage : Message {

    /// <summary>
    /// Player id
    /// </summary>
    public Guid GameId { get; set; }

    /// <summary>
    /// Player who sent the message
    /// </summary>
    public Game Game { get; set; }
}
