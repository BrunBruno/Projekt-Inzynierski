using chess.Application.Repositories.WebGameRepositories;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.WebGameRequests.GetGameTiming;

/// <summary>
/// Checks if game exists with provided id
/// Checks if timing exists
/// Creates and returns game timing dto
/// </summary>
public class GetGameTimingRequestHandler : IRequestHandler<GetGameTimingRequest, GetGameTimingDto> {

    private readonly IWebGameTimingRepository _webGameTimingRepository;
    private readonly IWebGameRepository _webGameRepository;

    public GetGameTimingRequestHandler(
        IWebGameTimingRepository gameTimingRepository,
        IWebGameRepository gameRepository
    ) {
        _webGameTimingRepository = gameTimingRepository;
        _webGameRepository = gameRepository;
    }

    public IWebGameTimingRepository GameTimingRepository => _webGameTimingRepository;

    public async Task<GetGameTimingDto> Handle(GetGameTimingRequest request, CancellationToken cancellationToken) {

        var game = await _webGameRepository.GetById(request.GameId)
            ?? throw new NotFoundException("Game not found.");

        var timing = await GameTimingRepository.GetById(game.GameTimingId)
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
