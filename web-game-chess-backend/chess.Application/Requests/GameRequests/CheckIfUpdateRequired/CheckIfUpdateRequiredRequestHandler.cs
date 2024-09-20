
using chess.Application.Repositories;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.GameRequests.CheckIfUpdateRequired;

/// <summary>
/// Checks if game exists
/// Checks if timing for obtained game exists
/// Returns is required dto
/// </summary>
public class CheckIfUpdateRequiredRequestHandler : IRequestHandler<CheckIfUpdateRequiredRequest, CheckIfUpdateRequiredDto> {

    private readonly IGameRepository _gameRepository;
    private readonly IGameTimingRepository _gameTimingRepository;

    public CheckIfUpdateRequiredRequestHandler(
        IGameRepository gameRepository,
        IGameTimingRepository gameTimingRepository
    ) {
        _gameRepository = gameRepository;
        _gameTimingRepository = gameTimingRepository;
    }

    public async Task<CheckIfUpdateRequiredDto> Handle(CheckIfUpdateRequiredRequest request, CancellationToken cancellationToken) {

        var game = await _gameRepository.GetById(request.GameId)
            ?? throw new NotFoundException("Game not found.");

        var gameTiming = await _gameTimingRepository.GetById(game.GameTimingId)
            ?? throw new NotFoundException("Game timing not found.");

        var isRequired = new CheckIfUpdateRequiredDto()
        {
            IsRequired = !game.WhitePlayerRegistered || !game.BlackPlayerRegistered,
            Type = gameTiming.Type,
            Minutes = gameTiming.Seconds / 60,
            Increment = gameTiming.Increment,
        };

        return isRequired;
    }
}
