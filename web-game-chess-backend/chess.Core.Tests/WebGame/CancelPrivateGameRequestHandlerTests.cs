
using chess.Application.Repositories.WebGameRepositories;
using chess.Application.Requests.WebGameRequests.CancelPrivateGame;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.WebGame;

public class CancelPrivateGameRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IWebGamePlayerRepository> _mockPlayerRepository;
    private readonly Mock<IWebGameRepository> _mockGameRepository;

    public CancelPrivateGameRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockPlayerRepository = new Mock<IWebGamePlayerRepository>();
        _mockGameRepository = new Mock<IWebGameRepository>();
    }

    [Fact]
    public async Task Handle_Removes_Game_And_Players_On_Success() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var whitePlayer = new WebGamePlayer()
        {
            Id = Guid.NewGuid(),
            Name = "Username",
            UserId = userId,
        };
        var blackPlayer = new WebGamePlayer()
        {
            Id = Guid.NewGuid(),
            Name = "Opponent",
            UserId = Guid.NewGuid(),
        };


        var exampleGame = new Entities.WebGame()
        {
            Id = gameId,
            IsPrivate = true,

            WhitePlayerId = whitePlayer.Id,
            WhitePlayer = whitePlayer,
            BlackPlayerId = blackPlayer.Id,
            BlackPlayer = blackPlayer,

            CurrentState = new WebGameState(),
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


        await act.Should().NotThrowAsync();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
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
        // game not exists


        var handler = new CancelPrivateGameRequestHandler(
            _mockGameRepository.Object,
            _mockUserContextService.Object,
            _mockPlayerRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockGameRepository.Verify(x => x.Delete(It.IsAny<Entities.WebGame>()), Times.Never);
        _mockPlayerRepository.Verify(x => x.Delete(It.IsAny<WebGamePlayer>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_UnauthorizedException_When_User_Does_Not_Belong_To_Game() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var whitePlayer = new WebGamePlayer()
        {
            Id = Guid.NewGuid(),
            Name = "Other",
            UserId = Guid.NewGuid(), // user is not player
        };
        var blackPlayer = new WebGamePlayer()
        {
            Id = Guid.NewGuid(),
            Name = "Opponent",
            UserId = Guid.NewGuid(), // user is not player
        };


        var exampleGame = new Entities.WebGame()
        {
            Id = gameId,
            IsPrivate = true,

            WhitePlayerId = whitePlayer.Id,
            WhitePlayer = whitePlayer,
            BlackPlayerId = blackPlayer.Id,
            BlackPlayer = blackPlayer,

            CurrentState = new WebGameState(),
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
        _mockGameRepository.Verify(x => x.Delete(It.IsAny<Entities.WebGame>()), Times.Never);
        _mockPlayerRepository.Verify(x => x.Delete(It.IsAny<WebGamePlayer>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_BadRequestException_When_Game_Is_Not_Private() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var whitePlayer = new WebGamePlayer()
        {
            Id = Guid.NewGuid(),
            Name = "Username",
            UserId = userId,
        };
        var blackPlayer = new WebGamePlayer()
        {
            Id = Guid.NewGuid(),
            Name = "Opponent",
            UserId = Guid.NewGuid(),
        };


        var exampleGame = new Entities.WebGame()
        {
            Id = gameId,
            IsPrivate = false, // game is not private

            WhitePlayerId = whitePlayer.Id,
            WhitePlayer = whitePlayer,
            BlackPlayerId = blackPlayer.Id,
            BlackPlayer = blackPlayer,

            CurrentState = new WebGameState(),
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
        _mockGameRepository.Verify(x => x.Delete(It.IsAny<Entities.WebGame>()), Times.Never);
        _mockPlayerRepository.Verify(x => x.Delete(It.IsAny<WebGamePlayer>()), Times.Never);
    }
}
