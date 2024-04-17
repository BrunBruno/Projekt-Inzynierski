
namespace chess.Core.Entities;

public class BannedUser {
    public Guid Id { get; set; }
    public string Reason { get; set; }
    public bool IsForEver { get; set; }
    public TimeSpan? Duration { get; set; }
    public Guid UserId { get; set; }
    public User User { get; set; }
}
