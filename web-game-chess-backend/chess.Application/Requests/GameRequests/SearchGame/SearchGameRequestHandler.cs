
using chess.Application.Repositories;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.GameRequests.SearchGame;

public class SearchGameRequestHandler : IRequestHandler<SearchGameRequest, SearchGameDto> {

    private readonly IPlayerRepository _playerRepository;
    private readonly IUserContextService _userContextService;
    private readonly IUserRepository _userRepository;
    private readonly IGameTimingRepository _gameTimingRepository;

    public SearchGameRequestHandler(
        IPlayerRepository playerRepository,
        IUserContextService userContextService,
        IUserRepository userRepository,
        IGameTimingRepository gameTimingRepository
    ) { 
        _playerRepository = playerRepository;
        _userContextService = userContextService;
        _userRepository = userRepository;
        _gameTimingRepository = gameTimingRepository;
    }

    public async Task<SearchGameDto> Handle(SearchGameRequest request, CancellationToken cancellationToken) {

        if (request.Minutes == 0)
            throw new BadRequestException("Incorrect value.");

        var existingGameTiming = await _gameTimingRepository.FindTiming(request.Type, request.Minutes, request.Increment);

        Guid timingId;

        if (existingGameTiming is null) {
            var gameTiming = new GameTiming()
            {
                Id = Guid.NewGuid(),
                Type = request.Type,
                Minutes = request.Minutes,
                Increment = request.Increment,
            };

            await _gameTimingRepository.Create(gameTiming);

            timingId = gameTiming.Id;

        } else {

            timingId = existingGameTiming.Id;
            
        }



        var userId = _userContextService.GetUserId();

        var user = await _userRepository.GetById(userId)
            ?? throw new NotFoundException("User not found.");

        var player = new Player()
        {
            Id = Guid.NewGuid(),
            Name = user.Username,
            Elo = user.Elo,
            UserId = userId,
            TimingId = timingId,
        };

        await _playerRepository.Create(player);

        var timingDto = new SearchGameDto()
        {
            TimingId = timingId,
            PlayerId = player.Id,
        };

        return timingDto;
    }
}
