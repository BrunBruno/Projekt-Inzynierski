
using chess.Core.Abstraction;

#pragma warning disable CS8618
namespace chess.Core.Entities;

/// <summary>
/// Auto messages for games with engine
/// </summary>
public class EngineGameMessage : Message {

    /// <summary>
    /// Id pk
    /// </summary>
    public Guid Id { get; set; }


    /// <summary>
    /// Requestor of a message
    /// </summary>
    public string RequestorName { get; set; } = "BRN CHess";


    /// <summary>
    /// The game that the message belongs to 
    /// </summary>
    public Guid GameId { get; set; }
    public EngineGame Game { get; set; }

}
