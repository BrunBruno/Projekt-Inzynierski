
using chess.Application.Repositories.WebGameRepositories;
using chess.Application.Repositories.UserRepositories;
using chess.Application.Requests.WebGameRequests.UpdatePrivateGame;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;
using chess.Core.Enums;

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

        var creatorId = Guid.NewGuid();
        var joinerId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var user = new Entities.User() { 
            Id = joinerId,
            Email = "test@test.com",
            Username = "Creator",

            Elo = new UserElo(),
        };

        var game = new Entities.WebGame()
        {
            Id = gameId,
            IsPrivate = true,
            TimingType = TimingTypes.Blitz,

            WhitePlayer = new WebGamePlayer() 
            { 
                Id = Guid.NewGuid(),
                Name = "Creator",
                IsPrivate = true,
                IsTemp = false,
                UserId = creatorId,
            },

            // placeholder set for friend as friend is requestor
            BlackPlayer = new WebGamePlayer()
            {
                Id = Guid.NewGuid(),
                Name = "",
                IsPrivate = true,
                IsTemp = true,
                UserId = creatorId, 
            },
        };

        var request = new UpdatePrivateGameRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(joinerId);
        _mockUserRepository.Setup(x => x.GetById(joinerId)).ReturnsAsync(user);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);


        var handler = new UpdatePrivateGameRequestHandler(
             _mockUserContextService.Object,
             _mockUserRepository.Object,
             _mockGameRepository.Object,
             _mockPlayerRepository.Object
         );


        var result = await handler.Handle(request, CancellationToken.None);
        result.WhitePlayerUserId.Should().Be(creatorId);
        result.BlackPlayerUserId.Should().Be(joinerId);


        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(joinerId), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockGameRepository.Verify(x => x.Update(game), Times.Once);
        _mockPlayerRepository.Verify(x => x.Update(game.WhitePlayer), Times.Once);
        _mockPlayerRepository.Verify(x => x.Update(game.BlackPlayer), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_User_Does_Not_Exist() {

        var creatorId = Guid.NewGuid();
        var joinerId = Guid.NewGuid();
        var gameId = Guid.NewGuid();


        var request = new UpdatePrivateGameRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(joinerId);
        // user not retirned


        var handler = new UpdatePrivateGameRequestHandler(
             _mockUserContextService.Object,
             _mockUserRepository.Object,
             _mockGameRepository.Object,
             _mockPlayerRepository.Object
         );


        var act = () => handler.Handle(request, CancellationToken.None);
        await act.Should().ThrowAsync<NotFoundException>();


        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(joinerId), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(It.IsAny<Guid>()), Times.Never);
        _mockGameRepository.Verify(x => x.Update(It.IsAny<Entities.WebGame>()), Times.Never);
        _mockPlayerRepository.Verify(x => x.Update(It.IsAny<WebGamePlayer>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_Game_Does_Not_Exist() {

        var creatorId = Guid.NewGuid();
        var joinerId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var user = new Entities.User()
        {
            Id = creatorId,
            Email = "test@test.com",
            Username = "Creator",

            Elo = new UserElo(),
        };

        var request = new UpdatePrivateGameRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(joinerId);
        _mockUserRepository.Setup(x => x.GetById(joinerId)).ReturnsAsync(user);
        // game not retirned


        var handler = new UpdatePrivateGameRequestHandler(
             _mockUserContextService.Object,
             _mockUserRepository.Object,
             _mockGameRepository.Object,
             _mockPlayerRepository.Object
         );


        var act = () => handler.Handle(request, CancellationToken.None);
        await act.Should().ThrowAsync<NotFoundException>();


        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(joinerId), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockGameRepository.Verify(x => x.Update(It.IsAny<Entities.WebGame>()), Times.Never);
        _mockPlayerRepository.Verify(x => x.Update(It.IsAny<WebGamePlayer>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_BadRequestException_When_Creator_Try_To_Join_As_Second_Player() {

        var creatorId = Guid.NewGuid();
        var joinerId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var user = new Entities.User()
        {
            Id = creatorId,
            Email = "test@test.com",
            Username = "Creator",

            Elo = new UserElo(),
        };

        var game = new Entities.WebGame()
        {
            Id = gameId,
            IsPrivate = true,
            TimingType = TimingTypes.Blitz,

            WhitePlayer = new WebGamePlayer()
            {
                Id = Guid.NewGuid(),
                Name = "Creator",
                IsPrivate = true,
                IsTemp = false,
                UserId = creatorId,
            },

            // placeholder set for friend as friend is requestor
            BlackPlayer = new WebGamePlayer()
            {
                Id = Guid.NewGuid(),
                Name = "",
                IsPrivate = true,
                IsTemp = true,
                UserId = creatorId,
            },
        };

        var request = new UpdatePrivateGameRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(creatorId); // creator trys to update
        _mockUserRepository.Setup(x => x.GetById(creatorId)).ReturnsAsync(user);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);


        var handler = new UpdatePrivateGameRequestHandler(
             _mockUserContextService.Object,
             _mockUserRepository.Object,
             _mockGameRepository.Object,
             _mockPlayerRepository.Object
         );


        var act = () => handler.Handle(request, CancellationToken.None);
        await act.Should().ThrowAsync<BadRequestException>();


        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(creatorId), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockGameRepository.Verify(x => x.Update(It.IsAny<Entities.WebGame>()), Times.Never);
        _mockPlayerRepository.Verify(x => x.Update(It.IsAny<WebGamePlayer>()), Times.Never);
    }
}
