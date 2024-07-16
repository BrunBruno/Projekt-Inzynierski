
using chess.Application.Repositories;
using chess.Application.Services;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.GameRequests.GetGameTiming;

public class GetGameTimingRequestHandler : IRequestHandler<GetGameTimingRequest, GetGameTimingDto> {

    private readonly IUserContextService _userContextService;
    private readonly IGameTimingRepository _gameTimingRepository;
    private readonly IGameRepository _gameRepository;

    public GetGameTimingRequestHandler(
        IUserContextService userContextService,
        IGameTimingRepository gameTimingRepository,
        IGameRepository gameRepository
    ) {
        _userContextService = userContextService;
        _gameTimingRepository = gameTimingRepository;
        _gameRepository = gameRepository;
    }

    public async Task<GetGameTimingDto> Handle(GetGameTimingRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var game = await _gameRepository.GetById(request.GameId)
            ?? throw new NotFoundException("Game not found.");

        if (game.WhitePlayerId != userId && game.BlackPlayerId != userId)
            throw new BadRequestException("This is not user game.");

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
