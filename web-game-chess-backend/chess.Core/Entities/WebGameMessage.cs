
using chess.Core.Abstraction;

#pragma warning disable CS8618
namespace chess.Core.Entities;

/// <summary>
/// Online game auto messages
/// </summary>
public class WebGameMessage : Message {

    /// <summary>
    /// Id pk
    /// </summary>
    public Guid Id { get; set; }


    /// <summary>
    /// Requestor of a draw
    /// </summary>
    public string RequestorName { get; set; }


    /// <summary>
    /// Game that message belongs to
    /// </summary>
    public Guid GameId { get; set; }
    public WebGame Game { get; set; }
}
