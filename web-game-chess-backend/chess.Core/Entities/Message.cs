
namespace chess.Core.Entities;
#pragma warning disable CS8618

public class Message {
    public Guid Id {  get; set; }

    public required string Content { get; set; }

    public DateTime SentAt { get; set; } = DateTime.UtcNow;

    public Guid PlayerId { get; set; }
    public Player Player { get; set; }
}
