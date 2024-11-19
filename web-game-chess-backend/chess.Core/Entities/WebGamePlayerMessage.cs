
using chess.Core.Abstraction;

namespace chess.Core.Entities;
#pragma warning disable CS8618

/// <summary>
/// Messages created by players during game
/// </summary>
public class WebGamePlayerMessage : Message {

    /// <summary>
    /// Id pk
    /// </summary>
    public Guid Id { get; set; }


    /// <summary>
    /// Player who sent the message
    /// </summary>
    public Guid PlayerId { get; set; }
    public WebGamePlayer Player { get; set; }
}
