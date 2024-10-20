
using chess.Application.Repositories;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.GameRequests.FetchTime;

/// <summary>
/// Checks if game exists
/// Calculates time based on game properties
/// Calculates time foe either white or black player
/// Returns times dto
/// </summary>
public class FetchTimeRequestHandler : IRequestHandler<FetchTimeRequest, FetchTimeDto> {

    private readonly IGameRepository _gameRepository;

    public FetchTimeRequestHandler(IGameRepository gameRepository) {
        _gameRepository = gameRepository;
    }

    public async Task<FetchTimeDto> Handle(FetchTimeRequest request, CancellationToken cancellationToken) {

        var game = await _gameRepository.GetById(request.GameId)
            ?? throw new NotFoundException("Game not found.");


        DateTime lastTimeRecorded = (game.Moves.Count == 0 ? game.StartedAt : game.Moves[^1].DoneAt) 
            ?? throw new BadRequestException("Game was not started properly.");

        DateTime currentTime = game.HasEnded && game.EndedAt != null ? (DateTime)game.EndedAt : DateTime.UtcNow;

        if (currentTime < lastTimeRecorded)
            throw new BadRequestException("Game was not started properly.");


        double timeDifference = (currentTime - lastTimeRecorded).TotalSeconds;
        double whiteTimeLeft;
        double blackTimeLeft;

        if (game.Turn % 2 == 0) {

            whiteTimeLeft = game.WhitePlayer.TimeLeft - timeDifference;
            blackTimeLeft = game.BlackPlayer.TimeLeft;

        } else {

            whiteTimeLeft = game.WhitePlayer.TimeLeft;
            blackTimeLeft = game.BlackPlayer.TimeLeft - timeDifference;

        }

        var timeDto = new FetchTimeDto()
        {
            Turn = game.Turn,
            WhiteTimeLeft = whiteTimeLeft > 0 ? whiteTimeLeft : 0,
            BlackTimeLeft = blackTimeLeft > 0 ? blackTimeLeft : 0,
        };

        return timeDto;
    }
}
