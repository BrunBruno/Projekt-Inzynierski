
using MediatR;

namespace chess.Application.Requests.GameRequests.SendMessage;

public class SendMessageRequest : IRequest {
    public Guid GameId { get; set; }
    public Guid PlayerId { get; set; }
    public required string Message { get; set; }
}
