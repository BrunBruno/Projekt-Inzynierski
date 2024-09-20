
using chess.Application.Repositories;
using chess.Application.Requests.GameRequests.CancelPrivateGame;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.Game;

public class CancelPrivateGameRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IPlayerRepository> _mockPlayerRepository;
    private readonly Mock<IGameRepository> _mockGameRepository;

    public CancelPrivateGameRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockPlayerRepository = new Mock<IPlayerRepository>();
        _mockGameRepository = new Mock<IGameRepository>();
    }

    [Fact]
    public async Task Handle_Removes_Game_And_Players_On_Success() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var whitePlayer = new Player()
        {
            Id = Guid.NewGuid(),
            Name = "Username",
            UserId = userId,
        };
        var blackPlayer = new Player()
        {
            Id = Guid.NewGuid(),
            Name = "Opponent",
            UserId = Guid.NewGuid(),
        };


        var exampleGame = new Entities.Game()
        {
            Id = gameId,
            IsPrivate = true,

            WhitePlayerId = whitePlayer.Id,
            WhitePlayer = whitePlayer,
            BlackPlayerId = blackPlayer.Id,
            BlackPlayer = blackPlayer,
              WhitePlayerRegistered = true,
            BlackPlayerRegistered = true,

            GameState = new GameState(),
        };

        var request = new CancelPrivateGameRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(exampleGame);
        _mockPlayerRepository.Setup(x => x.GetById(exampleGame.WhitePlayerId)).ReturnsAsync(whitePlayer);
        _mockPlayerRepository.Setup(x => x.GetById(exampleGame.BlackPlayerId)).ReturnsAsync(blackPlayer);


        var handler = new CancelPrivateGameRequestHandler(
            _mockGameRepository.Object,
            _mockUserContextService.Object,
            _mockPlayerRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().NotThrowAsync();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetById(exampleGame.WhitePlayerId), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetById(exampleGame.BlackPlayerId), Times.Once);
        _mockGameRepository.Verify(x => x.Delete(exampleGame), Times.Once);
        _mockPlayerRepository.Verify(x => x.Delete(whitePlayer), Times.Once);
        _mockPlayerRepository.Verify(x => x.Delete(blackPlayer), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_Game_Does_Not_Exist() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var request = new CancelPrivateGameRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);


        var handler = new CancelPrivateGameRequestHandler(
            _mockGameRepository.Object,
            _mockUserContextService.Object,
            _mockPlayerRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetById(It.IsAny<Guid>()), Times.Never);
        _mockGameRepository.Verify(x => x.Delete(It.IsAny<Entities.Game>()), Times.Never);
        _mockPlayerRepository.Verify(x => x.Delete(It.IsAny<Player>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_UnauthorizedException_When_User_Does_Not_Belong_To_Game() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var whitePlayer = new Player()
        {
            Id = Guid.NewGuid(),
            Name = "Other",
            UserId = Guid.NewGuid(),
        };
        var blackPlayer = new Player()
        {
            Id = Guid.NewGuid(),
            Name = "Opponent",
            UserId = Guid.NewGuid(),
        };


        var exampleGame = new Entities.Game()
        {
            Id = gameId,
            IsPrivate = true,

              WhitePlayerRegistered = true,
            BlackPlayerRegistered = true,
            WhitePlayerId = whitePlayer.Id,
            WhitePlayer = whitePlayer,
            BlackPlayerId = blackPlayer.Id,
            BlackPlayer = blackPlayer,

            GameState = new GameState(),
        };

        var request = new CancelPrivateGameRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(exampleGame);


        var handler = new CancelPrivateGameRequestHandler(
            _mockGameRepository.Object,
            _mockUserContextService.Object,
            _mockPlayerRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<UnauthorizedException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetById(It.IsAny<Guid>()), Times.Never);
        _mockGameRepository.Verify(x => x.Delete(It.IsAny<Entities.Game>()), Times.Never);
        _mockPlayerRepository.Verify(x => x.Delete(It.IsAny<Player>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_BadRequestException_When_Game_Is_Not_Private() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var whitePlayer = new Player()
        {
            Id = Guid.NewGuid(),
            Name = "Username",
            UserId = userId,
        };
        var blackPlayer = new Player()
        {
            Id = Guid.NewGuid(),
            Name = "Opponent",
            UserId = Guid.NewGuid(),
        };


        var exampleGame = new Entities.Game()
        {
            Id = gameId,
            IsPrivate = false,

            WhitePlayerId = whitePlayer.Id,
            WhitePlayer = whitePlayer,
            BlackPlayerId = blackPlayer.Id,
            BlackPlayer = blackPlayer,
              WhitePlayerRegistered = true,
            BlackPlayerRegistered = true,

            GameState = new GameState(),
        };

        var request = new CancelPrivateGameRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(exampleGame);


        var handler = new CancelPrivateGameRequestHandler(
            _mockGameRepository.Object,
            _mockUserContextService.Object,
            _mockPlayerRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<BadRequestException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetById(It.IsAny<Guid>()), Times.Never);
        _mockGameRepository.Verify(x => x.Delete(It.IsAny<Entities.Game>()), Times.Never);
        _mockPlayerRepository.Verify(x => x.Delete(It.IsAny<Player>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_WhitePlayer_Does_Not_Exist() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var whitePlayer = new Player()
        {
            Id = Guid.NewGuid(),
            Name = "Username",
            UserId = userId,
        };
        var blackPlayer = new Player()
        {
            Id = Guid.NewGuid(),
            Name = "Opponent",
            UserId = Guid.NewGuid(),
        };


        var exampleGame = new Entities.Game()
        {
            Id = gameId,
            IsPrivate = true,

              WhitePlayerRegistered = true,
            BlackPlayerRegistered = true,
            WhitePlayerId = whitePlayer.Id,
            WhitePlayer = whitePlayer,
            BlackPlayerId = blackPlayer.Id,
            BlackPlayer = blackPlayer,


            GameState = new GameState(),
        };

        var request = new CancelPrivateGameRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(exampleGame);


        var handler = new CancelPrivateGameRequestHandler(
            _mockGameRepository.Object,
            _mockUserContextService.Object,
            _mockPlayerRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetById(exampleGame.WhitePlayerId), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetById(exampleGame.BlackPlayerId), Times.Never);
        _mockGameRepository.Verify(x => x.Delete(It.IsAny<Entities.Game>()), Times.Never);
        _mockPlayerRepository.Verify(x => x.Delete(It.IsAny<Player>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_BlackPlayer_Does_Not_Exist() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var whitePlayer = new Player()
        {
            Id = Guid.NewGuid(),
            Name = "Username",
            UserId = userId,
        };
        var blackPlayer = new Player()
        {
            Id = Guid.NewGuid(),
            Name = "Opponent",
            UserId = Guid.NewGuid(),
        };

        var exampleGame = new Entities.Game()
        {
            Id = gameId,
            IsPrivate = true,

              WhitePlayerRegistered = true,
            BlackPlayerRegistered = true,
            WhitePlayerId = whitePlayer.Id,
            WhitePlayer = whitePlayer,
            BlackPlayerId = blackPlayer.Id,
            BlackPlayer = blackPlayer,

            GameState = new GameState(),
        };

        var request = new CancelPrivateGameRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(exampleGame);
        _mockPlayerRepository.Setup(x => x.GetById(exampleGame.WhitePlayerId)).ReturnsAsync(whitePlayer);


        var handler = new CancelPrivateGameRequestHandler(
            _mockGameRepository.Object,
            _mockUserContextService.Object,
            _mockPlayerRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetById(exampleGame.WhitePlayerId), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetById(exampleGame.BlackPlayerId), Times.Once);
        _mockGameRepository.Verify(x => x.Delete(It.IsAny<Entities.Game>()), Times.Never);
        _mockPlayerRepository.Verify(x => x.Delete(It.IsAny<Player>()), Times.Never);
    }
}
