
using chess.Core.Abstraction;

namespace chess.Core.Entities;
#pragma warning disable CS8618

public class WebGamePlayerMessage : Message {

    /// <summary>
    /// Id
    /// </summary>
    public Guid Id { get; set; }
    
    /// <summary>
    /// Player id
    /// </summary>
    public Guid PlayerId { get; set; }

    /// <summary>
    /// Player who sent the message
    /// </summary>
    public WebGamePlayer Player { get; set; }
}
