
using chess.Application.Repositories.EngineGameRepositories;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.EngineRequests.FetchEngineGameTime;

public class FetchEngineGameTimeRequestHandler : IRequestHandler<FetchEngineGameTimeRequest, FetchEngineGameTimeDto> {

    private readonly IEngineGameRepository _engineGameRepository;

    public FetchEngineGameTimeRequestHandler(IEngineGameRepository engineGameRepository) {
        _engineGameRepository = engineGameRepository;
    }

    public async Task<FetchEngineGameTimeDto> Handle(FetchEngineGameTimeRequest request, CancellationToken cancellationToken) {

        var game = await _engineGameRepository.GetById(request.GameId)
            ?? throw new NotFoundException("Game not found.");


        DateTime lastTimeRecorded = ((game.Moves == null || game.Moves.Count == 0) ? game.StartedAt : game.Moves[^1].DoneAt)
            ?? throw new BadRequestException("Game was not started properly.");

        DateTime currentTime = game.HasEnded && game.EndedAt != null ? (DateTime)game.EndedAt : DateTime.UtcNow;

        if (currentTime < lastTimeRecorded)
            throw new BadRequestException("Game was not started properly.");


        double timeDifference = (currentTime - lastTimeRecorded).TotalSeconds;
        double whiteTimeLeft, blackTimeLeft;
        bool isWhitePlayer = game.Player.Color == PieceColor.White;

        if (game.Turn % 2 == 0) {

            whiteTimeLeft = isWhitePlayer ? game.Player.TimeLeft - timeDifference : game.EngineTimeLeft - timeDifference;
            blackTimeLeft = isWhitePlayer ? game.EngineTimeLeft : game.Player.TimeLeft - timeDifference;

        } else {

            whiteTimeLeft = isWhitePlayer ? game.Player.TimeLeft : game.EngineTimeLeft;
            blackTimeLeft = isWhitePlayer ? game.EngineTimeLeft - timeDifference : game.Player.TimeLeft - timeDifference;

        }

        var timeDto = new FetchEngineGameTimeDto()
        {
            Turn = game.Turn,
            WhiteTimeLeft = whiteTimeLeft > 0 ? whiteTimeLeft : 0,
            BlackTimeLeft = blackTimeLeft > 0 ? blackTimeLeft : 0,
        };

        return timeDto;
    }
}
