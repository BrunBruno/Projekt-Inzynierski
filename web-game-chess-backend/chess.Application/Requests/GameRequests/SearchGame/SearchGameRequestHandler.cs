
using chess.Application.Repositories;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Core.Extensions;
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

        var userId = _userContextService.GetUserId();

        var user = await _userRepository.GetById(userId)
            ?? throw new NotFoundException("User not found.");

        if (request.Minutes == 0)
            throw new BadRequestException("Incorrect minutes value.");

        var existingGameTiming = await _gameTimingRepository.FindTiming(request.Type, request.Minutes, request.Increment);

        Guid timingId;
        if (existingGameTiming is null) {

            var gameTiming = new GameTiming()
            {
                Id = Guid.NewGuid(),
                Type = request.Type,
                Seconds = request.Minutes * 60,
                Increment = request.Increment,
            };

            await _gameTimingRepository.Create(gameTiming);

            timingId = gameTiming.Id;

        } else {

            timingId = existingGameTiming.Id;
        }

        int playerElo = user.Elo.GetElo(request.Type);

        var alreadyAwaitingPlayer = await _playerRepository.GetAwaitingPlayer(userId, timingId);

        Guid playerId;
        if (alreadyAwaitingPlayer is null) {

            var player = new Player()
            {
                Id = Guid.NewGuid(),
                Name = user.Username,
                ImageUrl = user.ImageUrl,
                Elo = playerElo,
                TimeLeft = request.Minutes * 60,
                UserId = userId,
                TimingId = timingId,
            };


            await _playerRepository.Create(player);

            playerId = player.Id;

        } else {

            playerId = alreadyAwaitingPlayer.Id;
        }


        var timingDto = new SearchGameDto()
        {
            TimingId = timingId,
            PlayerId = playerId,
        };

        return timingDto;
    }
}
