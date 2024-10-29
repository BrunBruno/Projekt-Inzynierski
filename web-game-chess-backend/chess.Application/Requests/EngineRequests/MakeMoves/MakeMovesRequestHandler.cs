
using chess.Application.Repositories.EngineGameRepositories;
using MediatR;

namespace chess.Application.Requests.EngineRequests.MakeMoves;

public class MakeMovesRequestHandler : IRequestHandler<MakeMovesRequest, MakeMovesDto> {

    private readonly IEngineGameRepository _engineGameRepository;

    public MakeMovesRequestHandler(IEngineGameRepository engineGameRepository) {
        _engineGameRepository = engineGameRepository;
    }

    public async Task<MakeMovesDto> Handle(MakeMovesRequest request, CancellationToken cancellationToken) {
        throw new NotImplementedException();
    }
}
