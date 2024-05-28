namespace chess.Application.Requests.GameRequests.InvitedToGame;

public class InvitedToGameDto
{
    public Guid GameId { get; set; }
    public Guid InviteeId { get; set; }
    public Guid InviterId { get; set; }
    public required string Inviter { get; set; }
}
