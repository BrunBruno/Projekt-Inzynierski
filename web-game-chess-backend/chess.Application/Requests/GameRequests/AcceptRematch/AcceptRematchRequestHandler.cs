
using MediatR;

namespace chess.Application.Requests.GameRequests.AcceptRematch;

public class AcceptRematchRequestHandler : IRequestHandler<AcceptRematchRequest> {
    public async Task Handle(AcceptRematchRequest request, CancellationToken cancellationToken) {
        throw new NotImplementedException();
    }
}
