
using chess.Application.Repositories;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.GameRequests.GetGameTiming;

/// <summary>
/// Checks if game exists with provided id
/// Checks if timing exists
/// Creates and returns game timing dto
/// </summary>
public class GetGameTimingRequestHandler : IRequestHandler<GetGameTimingRequest, GetGameTimingDto> {

    private readonly IGameTimingRepository _gameTimingRepository;
    private readonly IGameRepository _gameRepository;

    public GetGameTimingRequestHandler(
        IGameTimingRepository gameTimingRepository,
        IGameRepository gameRepository
    ) {
        _gameTimingRepository = gameTimingRepository;
        _gameRepository = gameRepository;
    }

    public async Task<GetGameTimingDto> Handle(GetGameTimingRequest request, CancellationToken cancellationToken) {

        var game = await _gameRepository.GetById(request.GameId)
            ?? throw new NotFoundException("Game not found.");

        var timing = await _gameTimingRepository.GetById(game.GameTimingId)
             ?? throw new NotFoundException("Timing not found.");

        var timingDto = new GetGameTimingDto()
        {
            Type = timing.Type,
            Minutes = timing.Seconds / 60,
            Increment = timing.Increment,
        };

        return timingDto;
    }
}
