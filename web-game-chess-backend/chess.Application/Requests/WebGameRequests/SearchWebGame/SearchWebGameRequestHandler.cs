
using chess.Application.Repositories.UserRepositories;
using chess.Application.Repositories.WebGameRepositories;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Core.Maps.MapOfElo;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.WebGameRequests.SearchWebGame;

/// <summary>
/// Checks if current user exists
/// Checks if provided data is correct
/// Checks if provided timing exists, otherwise creates it
/// Checks if player for current user already exists and await for game, otherwise creates new player
/// Returns timing id and player id
/// </summary>
public class SearchWebGameRequestHandler : IRequestHandler<SearchWebGameRequest, SearchWebGameDto> {

    private readonly IWebGamePlayerRepository _webGamePlayerRepository;
    private readonly IUserContextService _userContextService;
    private readonly IUserRepository _userRepository;
    private readonly IWebGameTimingRepository _webGameTimingRepository;

    public SearchWebGameRequestHandler(
        IWebGamePlayerRepository playerRepository,
        IUserContextService userContextService,
        IUserRepository userRepository,
        IWebGameTimingRepository gameTimingRepository
    ) {
        _webGamePlayerRepository = playerRepository;
        _userContextService = userContextService;
        _userRepository = userRepository;
        _webGameTimingRepository = gameTimingRepository;
    }

    public async Task<SearchWebGameDto> Handle(SearchWebGameRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var user = await _userRepository.GetById(userId)
            ?? throw new NotFoundException("User not found.");

        var existingGameTiming = await _webGameTimingRepository.FindTiming(request.Type, request.Minutes * 60, request.Increment);

        Guid timingId;
        if (existingGameTiming is null) {

            var gameTiming = new WebGameTiming()
            {
                Id = Guid.NewGuid(),
                Type = request.Type,
                Seconds = request.Minutes * 60,
                Increment = request.Increment,
            };

            await _webGameTimingRepository.Create(gameTiming);

            timingId = gameTiming.Id;

        } else {

            timingId = existingGameTiming.Id;
        }

        int playerElo = user.Elo.GetElo(request.Type);

        var alreadyAwaitingPlayer = await _webGamePlayerRepository.GetAwaitingPlayer(userId, timingId);

        Guid playerId;
        if (alreadyAwaitingPlayer is null) {

            var player = new WebGamePlayer()
            {
                Id = Guid.NewGuid(),
                Name = user.Username,
                Elo = playerElo,
                TimeLeft = request.Minutes * 60,
                UserId = userId,
                TimingId = timingId,
            };


            await _webGamePlayerRepository.Create(player);

            playerId = player.Id;

        } else {

            playerId = alreadyAwaitingPlayer.Id;
        }


        var timingDto = new SearchWebGameDto()
        {
            TimingId = timingId,
            PlayerId = playerId,
        };

        return timingDto;
    }
}
