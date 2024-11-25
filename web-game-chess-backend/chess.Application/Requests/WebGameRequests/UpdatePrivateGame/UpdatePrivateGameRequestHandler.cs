
using chess.Application.Services;
using chess.Shared.Exceptions;
using MediatR;
using chess.Core.Maps.MapOfElo;
using chess.Application.Repositories.WebGameRepositories;
using chess.Application.Repositories.UserRepositories;

namespace chess.Application.Requests.WebGameRequests.UpdatePrivateGame;

/// <summary>
/// Checks if current user exists
/// Checks if game for provided id exists
/// Updates player based on fact if user is a creator of the game or not
/// </summary>
public class UpdatePrivateGameRequestHandler : IRequestHandler<UpdatePrivateGameRequest, UpdatePrivateGameDto> {

    private readonly IUserContextService _userContextService;
    private readonly IUserRepository _userRepository;
    private readonly IWebGameRepository _webGameRepository;
    private readonly IWebGamePlayerRepository _webGamePlayerRepository;

    public UpdatePrivateGameRequestHandler(
        IUserContextService userContextService,
        IUserRepository userRepository,
        IWebGameRepository gameRepository,
        IWebGamePlayerRepository playerRepository
    ) {
        _userContextService = userContextService;
        _userRepository = userRepository;
        _webGameRepository = gameRepository;
        _webGamePlayerRepository = playerRepository;
    }

    public async Task<UpdatePrivateGameDto> Handle(UpdatePrivateGameRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var user = await _userRepository.GetById(userId)
            ?? throw new NotFoundException("User not found");

        var game = await _webGameRepository.GetById(request.GameId)
            ?? throw new NotFoundException("Game not found");

        if((game.WhitePlayer.IsTemp && game.WhitePlayer.UserId != userId) ||
           (game.BlackPlayer.IsTemp && game.BlackPlayer.UserId != userId)) {

            var userPlayer = game.WhitePlayer.IsTemp ? game.WhitePlayer : game.BlackPlayer;
            var opponentPlayer = !game.WhitePlayer.IsTemp ? game.WhitePlayer : game.BlackPlayer;

            int userElo = user.Elo.GetElo(game.TimingType);

            userPlayer.IsTemp = false;

            userPlayer.UserId = userId;
            userPlayer.Elo = userElo;
            userPlayer.Name = user.Username;
            userPlayer.IsPlaying = true;

            opponentPlayer.IsPlaying = true;

            await _webGameRepository.Update(game);
            await _webGamePlayerRepository.Update(userPlayer);
            await _webGamePlayerRepository.Update(opponentPlayer);
        }


        var updateDto = new UpdatePrivateGameDto()
        {
            WhitePlayerUserId = game.WhitePlayer.UserId,
            BlackPlayerUserId = game.BlackPlayer.UserId,
        };

        return updateDto;
    }
}
