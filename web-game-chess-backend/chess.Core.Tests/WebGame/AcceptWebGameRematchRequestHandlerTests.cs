
using chess.Application.Repositories.WebGameRepositories;
using chess.Application.Requests.WebGameRequests.AcceptWebGameRematch;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.WebGame;

public class AcceptWebGameRematchRequestHandlerTests {

    
    private readonly Mock<IWebGameRepository> _mockGameRepository;
    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IWebGamePlayerRepository> _mockPlayerRepository;

    public AcceptWebGameRematchRequestHandlerTests() {
        _mockGameRepository = new Mock<IWebGameRepository>();
        _mockUserContextService = new Mock<IUserContextService>();
        _mockPlayerRepository = new Mock<IWebGamePlayerRepository>();
    }

    [Fact]
    public async Task Handle_Updates_Players_And_Returns_Dto_On_Success() {
        var userId = Guid.NewGuid();
        var friendId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var whitePlayer = new WebGamePlayer()
        {
            Id = Guid.NewGuid(),
            Name = "Username",
            UserId = userId,
            GameId = gameId,
        };

        var blackPlayer = new WebGamePlayer()
        {
            Id = Guid.NewGuid(),
            Name = "Friend",
            UserId = friendId,
            GameId = gameId,
        };

        var game = new Entities.WebGame(){
            Id = gameId,
            WhitePlayerRegistered = true,
            BlackPlayerRegistered = true,

            WhitePlayerId = whitePlayer.Id,
            WhitePlayer = whitePlayer,
            BlackPlayerId = blackPlayer.Id,
            BlackPlayer = blackPlayer,
        };

        var request = new AcceptWebGameRematchRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);
        _mockPlayerRepository.Setup(x => x.GetById(whitePlayer.Id)).ReturnsAsync(whitePlayer);
        _mockPlayerRepository.Setup(x => x.GetById(blackPlayer.Id)).ReturnsAsync(blackPlayer);
  


        var handler = new AcceptWebGameRematchRequestHandler(
            _mockGameRepository.Object,
            _mockUserContextService.Object,
            _mockPlayerRepository.Object
        );

        var result = await handler.Handle(request, CancellationToken.None);


        result.WhitePlayerUserId.Should().Be(userId);
        result.BlackPlayerUserId.Should().Be(friendId);

        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetById(whitePlayer.Id), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetById(blackPlayer.Id), Times.Once);
        _mockPlayerRepository.Verify(x => x.Update(whitePlayer), Times.Once);
        _mockPlayerRepository.Verify(x => x.Update(blackPlayer), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_Game_Does_Not_Exist() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();


        var request = new AcceptWebGameRematchRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        // game not returned


        var handler = new AcceptWebGameRematchRequestHandler(
            _mockGameRepository.Object,
            _mockUserContextService.Object,
            _mockPlayerRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);

        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetById(It.IsAny<Guid>()), Times.Never);
        _mockPlayerRepository.Verify(x => x.Update(It.IsAny<WebGamePlayer>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_UnauthorizedException_When_User_Does_Not_Belong_To_Game() {

        var userId = Guid.NewGuid();
        var friendId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var whitePlayer = new WebGamePlayer()
        {
            Id = Guid.NewGuid(),
            Name = "Username",
            UserId = Guid.NewGuid(), // user not in game
            GameId = gameId,
        };

        var blackPlayer = new WebGamePlayer()
        {
            Id = Guid.NewGuid(),
            Name = "Friend",
            UserId = friendId,
            GameId = gameId,
        };

        var game = new Entities.WebGame(){
            Id = gameId,
            WhitePlayerRegistered = true,
            BlackPlayerRegistered = true,

            WhitePlayerId = whitePlayer.Id,
            WhitePlayer = whitePlayer,
            BlackPlayerId = blackPlayer.Id,
            BlackPlayer = blackPlayer,
        };

        var request = new AcceptWebGameRematchRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);


        var handler = new AcceptWebGameRematchRequestHandler(
            _mockGameRepository.Object,
            _mockUserContextService.Object,
            _mockPlayerRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);

        await act.Should().ThrowAsync<UnauthorizedException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetById(It.IsAny<Guid>()), Times.Never);
        _mockPlayerRepository.Verify(x => x.Update(It.IsAny<WebGamePlayer>()), Times.Never);
    }
    
    [Fact]
    public async Task Handle_Throws_NotFoundException_When_WhitePlayer_Not_Exists() {
        var userId = Guid.NewGuid();
        var friendId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var whitePlayer = new WebGamePlayer()
        {
            Id = Guid.NewGuid(),
            Name = "Username",
            UserId = userId,
            GameId = gameId,
        };

        var blackPlayer = new WebGamePlayer()
        {
            Id = Guid.NewGuid(),
            Name = "Friend",
            UserId = friendId,
            GameId = gameId,
        };

        var game = new Entities.WebGame(){
            Id = gameId,
            WhitePlayerRegistered = true,
            BlackPlayerRegistered = true,

            WhitePlayerId = whitePlayer.Id,
            WhitePlayer = whitePlayer,
            BlackPlayerId = blackPlayer.Id,
            BlackPlayer = blackPlayer,
        };

        var request = new AcceptWebGameRematchRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);
        // white player not returned
  


        var handler = new AcceptWebGameRematchRequestHandler(
            _mockGameRepository.Object,
            _mockUserContextService.Object,
            _mockPlayerRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);

        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetById(whitePlayer.Id), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetById(blackPlayer.Id), Times.Never);
        _mockPlayerRepository.Verify(x => x.Update(It.IsAny<WebGamePlayer>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_BlackPlayer_Not_Exists() {
        var userId = Guid.NewGuid();
        var friendId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var whitePlayer = new WebGamePlayer()
        {
            Id = Guid.NewGuid(),
            Name = "Username",
            UserId = userId,
            GameId = gameId,
        };

        var blackPlayer = new WebGamePlayer()
        {
            Id = Guid.NewGuid(),
            Name = "Friend",
            UserId = friendId,
            GameId = gameId,
        };

        var game = new Entities.WebGame(){
            Id = gameId,
            WhitePlayerRegistered = true,
            BlackPlayerRegistered = true,

            WhitePlayerId = whitePlayer.Id,
            WhitePlayer = whitePlayer,
            BlackPlayerId = blackPlayer.Id,
            BlackPlayer = blackPlayer,
        };

        var request = new AcceptWebGameRematchRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);
        _mockPlayerRepository.Setup(x => x.GetById(whitePlayer.Id)).ReturnsAsync(whitePlayer);
        // black player not returned
  


        var handler = new AcceptWebGameRematchRequestHandler(
            _mockGameRepository.Object,
            _mockUserContextService.Object,
            _mockPlayerRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);

        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetById(whitePlayer.Id), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetById(blackPlayer.Id), Times.Once);
        _mockPlayerRepository.Verify(x => x.Update(It.IsAny<WebGamePlayer>()), Times.Never);
    }
}
