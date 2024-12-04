
using chess.Application.Repositories.WebGameRepositories;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.WebGameRequests.CheckIfUpdateOnPrivateGameRequired;

/// <summary>
/// Checks if game exists
/// Checks if timing for obtained game exists
/// Returns is required dto
/// </summary>
public class CheckIfUpdateOnPrivateGameRequiredRequestHandler : IRequestHandler<CheckIfUpdateOnPrivateGameRequiredRequest, CheckIfUpdateOnPrivateGameRequiredDto> {

    private readonly IWebGameRepository _webGameRepository;
    private readonly IWebGameTimingRepository _webGameTimingRepository;

    public CheckIfUpdateOnPrivateGameRequiredRequestHandler(
        IWebGameRepository gameRepository,
        IWebGameTimingRepository gameTimingRepository
    ) {
        _webGameRepository = gameRepository;
        _webGameTimingRepository = gameTimingRepository;
    }

    public async Task<CheckIfUpdateOnPrivateGameRequiredDto> Handle(CheckIfUpdateOnPrivateGameRequiredRequest request, CancellationToken cancellationToken) {

        var game = await _webGameRepository.GetById(request.GameId)
            ?? throw new NotFoundException("Game not found");

        var gameTiming = await _webGameTimingRepository.GetById(game.GameTimingId)
            ?? throw new NotFoundException("Game timing not found");

        var isRequired = new CheckIfUpdateOnPrivateGameRequiredDto()
        {
            IsRequired = game.WhitePlayer.IsTemp || game.BlackPlayer.IsTemp,
            Type = gameTiming.Type,
            Minutes = gameTiming.Seconds / 60,
            Increment = gameTiming.Increment,
        };

        return isRequired;
    }
}
