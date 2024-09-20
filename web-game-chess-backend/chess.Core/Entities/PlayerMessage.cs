
namespace chess.Core.Entities;
#pragma warning disable CS8618

public class PlayerMessage : Message {

    /// <summary>
    /// Player id
    /// </summary>
    public Guid PlayerId { get; set; }

    /// <summary>
    /// Player who sent the message
    /// </summary>
    public Player Player { get; set; }
}
