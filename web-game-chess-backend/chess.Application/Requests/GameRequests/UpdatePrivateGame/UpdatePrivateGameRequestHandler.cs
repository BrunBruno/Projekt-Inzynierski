
using chess.Application.Repositories;
using chess.Application.Services;
using chess.Shared.Exceptions;
using MediatR;
using chess.Core.Maps.MapOfElo;

namespace chess.Application.Requests.GameRequests.UpdatePrivateGame;

public class UpdatePrivateGameRequestHandler : IRequestHandler<UpdatePrivateGameRequest, UpdatePrivateGameDto> {

    private readonly IUserContextService _userContextService;
    private readonly IUserRepository _userRepository;
    private readonly IGameRepository _gameRepository;
    private readonly IPlayerRepository _playerRepository;

    public UpdatePrivateGameRequestHandler(
        IUserContextService userContextService,
        IUserRepository userRepository,
        IGameRepository gameRepository,
        IPlayerRepository playerRepository
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

            var userPlayer = game.WhitePlayer.Name == user.Username ? game.WhitePlayer : game.BlackPlayer;

            userPlayer.IsPlaying = true;


            await _playerRepository.Update(userPlayer);


            var updateDto = new UpdatePrivateGameDto()
            {
                ShouldStart = false,
                WhitePlayerUserId = game.WhitePlayer.UserId,
                BlackPlayerUserId = game.BlackPlayer.UserId,
            };

            return updateDto;

        } else {

            var userPlayer = game.WhitePlayer.Name == "" ? game.WhitePlayer : game.BlackPlayer;

            int userElo = user.Elo.GetElo(game.TimingType);

            userPlayer.UserId = userId;
            userPlayer.Elo = userElo;
            userPlayer.Name = user.Username;
            userPlayer.ImageUrl = user.ImageUrl;
            userPlayer.IsPlaying = true;


            await _playerRepository.Update(userPlayer);


            var updateDto = new UpdatePrivateGameDto()
            {
                ShouldStart = true,
                WhitePlayerUserId = game.WhitePlayer.UserId,
                BlackPlayerUserId = game.BlackPlayer.UserId,
            };

            return updateDto;
        }
    }
}
