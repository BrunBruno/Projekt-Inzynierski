
using chess.Application.Repositories;
using chess.Application.Requests.GameRequests.UpdatePrivateGame;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.Game;

public class UpdatePrivateGameRequestHandlerTests {
    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IUserRepository> _mockUserRepository;
    private readonly Mock<IGameRepository> _mockGameRepository;
    private readonly Mock<IPlayerRepository> _mockPlayerRepository;

    public UpdatePrivateGameRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockUserRepository = new Mock<IUserRepository>();
        _mockGameRepository = new Mock<IGameRepository>();
        _mockPlayerRepository = new Mock<IPlayerRepository>();
    }

    [Fact]
    public async Task Handle_Updates_Joiner_Player_On_Success() {

        var userId = Guid.NewGuid();
        var friendId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var user = new Entities.User() { 
            Id = userId,
            Email = "user@test.com",
            Username = "Username",

            Elo = new UserElo() { },
        };

        var game = new Entities.Game()
        {
            Id = gameId,
            IsPrivate = true,
              WhitePlayerRegistered = true,
            BlackPlayerRegistered = true,
            WhitePlayer = new Player() 
            { 
                Id = Guid.NewGuid(),
                Name = "FriendName",
                IsPrivate = true,
                UserId = friendId,
            },
            BlackPlayer = new Player()
            {
                Id = Guid.NewGuid(),
                Name = "",
                IsPrivate = true,
                UserId = friendId,
            },
        };

        var request = new UpdatePrivateGameRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockUserRepository.Setup(x => x.GetById(userId)).ReturnsAsync(user);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);


        var handler = new UpdatePrivateGameRequestHandler(
             _mockUserContextService.Object,
             _mockUserRepository.Object,
             _mockGameRepository.Object,
             _mockPlayerRepository.Object
         );


        var result = await handler.Handle(request, CancellationToken.None);
        result.ShouldStart.Should().Be(true);

        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(userId), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockPlayerRepository.Verify(x => x.Update(game.BlackPlayer), Times.Once);
    }

    [Fact]
    public async Task Handle_Updates_Creator_Player_On_Success() {

        var userId = Guid.NewGuid();
        var friendId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var user = new Entities.User()
        {
            Id = userId,
            Email = "user@test.com",
            Username = "Username",

            Elo = new UserElo() { },
        };

        var game = new Entities.Game()
        {
            Id = gameId,
            IsPrivate = true,

              WhitePlayerRegistered = true,
            BlackPlayerRegistered = true,
            WhitePlayer = new Player()
            {
                Id = Guid.NewGuid(),
                Name = "Username",
                IsPrivate = true,
                UserId = userId,
            },
            BlackPlayer = new Player()
            {
                Id = Guid.NewGuid(),
                Name = "",
                IsPrivate = true,
                UserId = userId,
            },
        };

        var request = new UpdatePrivateGameRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockUserRepository.Setup(x => x.GetById(userId)).ReturnsAsync(user);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);


        var handler = new UpdatePrivateGameRequestHandler(
             _mockUserContextService.Object,
             _mockUserRepository.Object,
             _mockGameRepository.Object,
             _mockPlayerRepository.Object
         );


        var result = await handler.Handle(request, CancellationToken.None);
        result.ShouldStart.Should().Be(false);

        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(userId), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockPlayerRepository.Verify(x => x.Update(game.WhitePlayer), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_User_Does_Not_Exist() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var request = new UpdatePrivateGameRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);


        var handler = new UpdatePrivateGameRequestHandler(
             _mockUserContextService.Object,
             _mockUserRepository.Object,
             _mockGameRepository.Object,
             _mockPlayerRepository.Object
         );


        var act = () => handler.Handle(request, CancellationToken.None);

        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(userId), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Never);
        _mockPlayerRepository.Verify(x => x.Update(It.IsAny<Player>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_Game_Does_Not_Exist() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var user = new Entities.User()
        {
            Id = userId,
            Email = "user@test.com",
            Username = "Username",
            Elo = new UserElo() { },
        };


        var request = new UpdatePrivateGameRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockUserRepository.Setup(x => x.GetById(userId)).ReturnsAsync(user);


        var handler = new UpdatePrivateGameRequestHandler(
             _mockUserContextService.Object,
             _mockUserRepository.Object,
             _mockGameRepository.Object,
             _mockPlayerRepository.Object
         );


        var act = () => handler.Handle(request, CancellationToken.None);

        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(userId), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockPlayerRepository.Verify(x => x.Update(It.IsAny<Player>()), Times.Never);
    }
}
