﻿
using chess.Application.Repositories.WebGameRepositories;
using chess.Application.Repositories.UserRepositories;
using chess.Application.Requests.WebGameRequests.CreatePrivateGameWithLink;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.WebGame;

public class CreateGameWithLinkRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IUserRepository> _mockUserRepository;
    private readonly Mock<IWebGamePlayerRepository> _mockPlayerRepository;
    private readonly Mock<IWebGameRepository> _mockGameRepository;
    private readonly Mock<IWebGameTimingRepository> _mockGameTimingRepository;
    private readonly Mock<IWebGameStateRepository> _mockGameStateRepository;

    public CreateGameWithLinkRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockUserRepository = new Mock<IUserRepository>();
        _mockPlayerRepository = new Mock<IWebGamePlayerRepository>();
        _mockGameRepository = new Mock<IWebGameRepository>();
        _mockGameTimingRepository = new Mock<IWebGameTimingRepository>();
        _mockGameStateRepository = new Mock<IWebGameStateRepository>();
    }

    [Fact]
    public async Task Handle_Creates_Private_Game_On_Success() {

        var userId = Guid.NewGuid();

        var user = new Entities.User()
        {
            Id = userId,
            Email = "user@test.com",
            Username = "Username",
            Elo = new UserElo(),
        };

        var gameTiming = new WebGameTiming()
        {
            Type = TimingTypes.Rapid,
            Seconds = 10 * 60,
            Increment = 0,
        };

        var request = new CreatePrivateGameWithLinkRequest()
        {
            Type = gameTiming.Type,
            Minutes = gameTiming.Seconds / 60,
            Increment = gameTiming.Increment,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockUserRepository.Setup(x => x.GetById(userId)).ReturnsAsync(user);
        _mockGameTimingRepository.Setup(x => x.FindTiming(request.Type, request.Minutes * 60, request.Increment)).ReturnsAsync(gameTiming);


        var handler = new CreatePrivateGameWithLinkRequestHandler(
             _mockUserContextService.Object,
             _mockUserRepository.Object,
             _mockGameRepository.Object,
             _mockGameTimingRepository.Object,
             _mockGameStateRepository.Object,
             _mockPlayerRepository.Object
         );

        var result = await handler.Handle(request, CancellationToken.None);


        result.Should().NotBeNull();
        result.GameId.Should().NotBeEmpty();
        result.GameUrl.Should().Contain(result.GameId.ToString());

        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(userId), Times.Once);
        _mockGameTimingRepository.Verify(x => x.FindTiming(request.Type, request.Minutes * 60, request.Increment), Times.Once);
        _mockGameTimingRepository.Verify(x => x.Create(It.IsAny<WebGameTiming>()), Times.Never);
        _mockPlayerRepository.Verify(x => x.Create(It.IsAny<WebGamePlayer>()), Times.Exactly(2));
        _mockGameRepository.Verify(x => x.Create(It.IsAny<Entities.WebGame>()), Times.Once);
        _mockGameStateRepository.Verify(x => x.Create(It.IsAny<WebGameState>()), Times.Once);
    }

    [Fact]
    public async Task Handle_Creates_Private_Game_And_GameTiming_When_Not_Exists_On_Success() {

        var userId = Guid.NewGuid();

        var user = new Entities.User()
        {
            Id = userId,
            Email = "user@test.com",
            Username = "Username",
            Elo = new UserElo(),
        };

        var gameTiming = new WebGameTiming()
        {
            Type = TimingTypes.Rapid,
            Seconds = 10 * 60,
            Increment = 0,
        };

        var request = new CreatePrivateGameWithLinkRequest()
        {
            Type = gameTiming.Type,
            Minutes = gameTiming.Seconds / 60,
            Increment = gameTiming.Increment,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockUserRepository.Setup(x => x.GetById(userId)).ReturnsAsync(user);
        // game timing not returned


        var handler = new CreatePrivateGameWithLinkRequestHandler(
             _mockUserContextService.Object,
             _mockUserRepository.Object,
             _mockGameRepository.Object,
             _mockGameTimingRepository.Object,
             _mockGameStateRepository.Object,
             _mockPlayerRepository.Object
         );

        var result = await handler.Handle(request, CancellationToken.None);


        result.Should().NotBeNull();
        result.GameId.Should().NotBeEmpty();
        result.GameUrl.Should().Contain(result.GameId.ToString());

        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(userId), Times.Once);
        _mockGameTimingRepository.Verify(x => x.FindTiming(request.Type, request.Minutes * 60, request.Increment), Times.Once);
        _mockGameTimingRepository.Verify(x => x.Create(It.IsAny<WebGameTiming>()), Times.Once);
        _mockPlayerRepository.Verify(x => x.Create(It.IsAny<WebGamePlayer>()), Times.Exactly(2));
        _mockGameRepository.Verify(x => x.Create(It.IsAny<Entities.WebGame>()), Times.Once);
        _mockGameStateRepository.Verify(x => x.Create(It.IsAny<WebGameState>()), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_User_Does_Not_Exist() {

        var userId = Guid.NewGuid();

        var gameTiming = new WebGameTiming()
        {
            Type = TimingTypes.Rapid,
            Seconds = 10 * 60,
            Increment = 0,
        };

        var request = new CreatePrivateGameWithLinkRequest()
        {
            Type = gameTiming.Type,
            Minutes = gameTiming.Seconds / 60,
            Increment = gameTiming.Increment,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        // user not returned


        var handler = new CreatePrivateGameWithLinkRequestHandler(
             _mockUserContextService.Object,
             _mockUserRepository.Object,
             _mockGameRepository.Object,
             _mockGameTimingRepository.Object,
             _mockGameStateRepository.Object,
             _mockPlayerRepository.Object
         );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(userId), Times.Once);
        _mockGameTimingRepository.Verify(x => x.FindTiming(request.Type, request.Minutes * 60, request.Increment), Times.Never);
        _mockGameTimingRepository.Verify(x => x.Create(It.IsAny<WebGameTiming>()), Times.Never);
        _mockPlayerRepository.Verify(x => x.Create(It.IsAny<WebGamePlayer>()), Times.Never);
        _mockGameRepository.Verify(x => x.Create(It.IsAny<Entities.WebGame>()), Times.Never);
        _mockGameStateRepository.Verify(x => x.Create(It.IsAny<WebGameState>()), Times.Never);
    }
}
