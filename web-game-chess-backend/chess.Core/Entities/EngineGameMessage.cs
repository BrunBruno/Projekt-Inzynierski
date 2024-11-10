
using chess.Core.Abstraction;

#pragma warning disable CS8618
namespace chess.Core.Entities;

public class EngineGameMessage : Message {

    /// <summary>
    /// Id
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Requestor of a draw
    /// </summary>
    public string RequestorName { get; set; }

    /// <summary>
    /// Player id
    /// </summary>
    public Guid GameId { get; set; }

    /// <summary>
    /// Player who sent the message
    /// </summary>
    public EngineGame Game { get; set; }

}
