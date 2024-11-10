using chess.Application.Repositories.WebGameRepositories;
using chess.Application.Repositories.UserRepositories;
using chess.Application.Requests.WebGameRequests.UpdatePrivateGame;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.WebGame;

public class UpdatePrivateGameRequestHandlerTests {
    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IUserRepository> _mockUserRepository;
    private readonly Mock<IWebGameRepository> _mockGameRepository;
    private readonly Mock<IWebGamePlayerRepository> _mockPlayerRepository;

    public UpdatePrivateGameRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockUserRepository = new Mock<IUserRepository>();
        _mockGameRepository = new Mock<IWebGameRepository>();
        _mockPlayerRepository = new Mock<IWebGamePlayerRepository>();
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

        var game = new Entities.WebGame()
        {
            Id = gameId,
            IsPrivate = true,
            WhitePlayerRegistered = true,
            BlackPlayerRegistered = true,

            WhitePlayer = new WebGamePlayer() 
            { 
                Id = Guid.NewGuid(),
                Name = "FriendName",
                IsPrivate = true,
                UserId = friendId,
            },

            BlackPlayer = new WebGamePlayer()
            {
                Id = Guid.NewGuid(),
                Name = "",
                IsPrivate = true,
                UserId = friendId, // placeholder set for friend as friend is requestor
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

            Elo = new UserElo(),
        };

        var game = new Entities.WebGame()
        {
            Id = gameId,
            IsPrivate = true,

            WhitePlayerRegistered = true,
            BlackPlayerRegistered = false,
            WhitePlayer = new WebGamePlayer()
            {
                Id = Guid.NewGuid(),
                Name = "Username",
                UserId = userId, 
                IsPrivate = true,

                User = user,
            },
            BlackPlayer = new WebGamePlayer()
            {
                Id = Guid.NewGuid(),
                Name = "",
                UserId = userId, // placeholder set for user as user is requestor
                IsPrivate = true,

                User = new Entities.User() { 
                    Id = userId,
                    Email = "freind@test.com",
                    Username = "Friend",
                }
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
        // user not returned


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
        _mockPlayerRepository.Verify(x => x.Update(It.IsAny<WebGamePlayer>()), Times.Never);
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
        // game not returned


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
        _mockPlayerRepository.Verify(x => x.Update(It.IsAny<WebGamePlayer>()), Times.Never);
    }
}
