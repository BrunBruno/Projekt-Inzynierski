
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
    private readonly IWebGameRepository _gameRepository;
    private readonly IWebGamePlayerRepository _playerRepository;

    public UpdatePrivateGameRequestHandler(
        IUserContextService userContextService,
        IUserRepository userRepository,
        IWebGameRepository gameRepository,
        IWebGamePlayerRepository playerRepository
    ) {
        _userContextService = userContextService;
        _userRepository = userRepository;
        _gameRepository = gameRepository;
        _playerRepository = playerRepository;
    }

    public async Task<UpdatePrivateGameDto> Handle(UpdatePrivateGameRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var user = await _userRepository.GetById(userId)
            ?? throw new NotFoundException("User not found");

        var game = await _gameRepository.GetById(request.GameId)
            ?? throw new NotFoundException("Game not found");


        if (game.WhitePlayer.UserId == userId || game.BlackPlayer.UserId == userId) {
            bool playsAsWhite = game.WhitePlayer.Name == user.Username;
            var userPlayer = playsAsWhite ? game.WhitePlayer : game.BlackPlayer;

            userPlayer.IsPlaying = true;

            if (playsAsWhite)
                game.WhitePlayerRegistered = true;
            else
                game.BlackPlayerRegistered = true;


            await _gameRepository.Update(game);
            await _playerRepository.Update(userPlayer);
        

        } else {
            bool playsAsWhite = game.WhitePlayer.Name == "";
            var userPlayer = playsAsWhite ? game.WhitePlayer : game.BlackPlayer;

            int userElo = user.Elo.GetElo(game.TimingType);

            userPlayer.UserId = userId;
            userPlayer.Elo = userElo;
            userPlayer.Name = user.Username;
            userPlayer.IsPlaying = true;


            if (playsAsWhite)
                game.WhitePlayerRegistered = true;
            else
                game.BlackPlayerRegistered = true;


            await _gameRepository.Update(game);
            await _playerRepository.Update(userPlayer);
         
        }

        var updateDto = new UpdatePrivateGameDto()
        {
            ShouldStart = game.WhitePlayerRegistered && game.BlackPlayerRegistered,
            WhitePlayerUserId = game.WhitePlayer.UserId,
            BlackPlayerUserId = game.BlackPlayer.UserId,
        };

        return updateDto;
    }
}
