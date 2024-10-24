﻿
using chess.Application.Repositories;
using chess.Application.Requests.GameRequests.CreateGameByEmail;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.Game;

public class CreateGameByEmailRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IUserRepository> _mockUserRepository;
    private readonly Mock<IPlayerRepository> _mockPlayerRepository;
    private readonly Mock<IGameRepository> _mockGameRepository;
    private readonly Mock<IGameTimingRepository> _mockGameTimingRepository;
    private readonly Mock<IGameStateRepository> _mockGameStateRepository;
    private readonly Mock<IGameInvitationRepository> _mockGameInvitationRepository;
    private readonly Mock<ISmtpService> _mockSmtpService;

    public CreateGameByEmailRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockUserRepository = new Mock<IUserRepository>();
        _mockPlayerRepository = new Mock<IPlayerRepository>();
        _mockGameRepository = new Mock<IGameRepository>();
        _mockGameTimingRepository = new Mock<IGameTimingRepository>();
        _mockGameStateRepository = new Mock<IGameStateRepository>();
        _mockGameInvitationRepository = new Mock<IGameInvitationRepository>();
        _mockSmtpService = new Mock<ISmtpService>();
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
        var friend = new Entities.User() 
        {
            Id = Guid.NewGuid(),
            Email = "friend@test.com",
            Username = "Friend",
            Elo = new UserElo(),
        };

        var gameTiming = new GameTiming()
        {
            Type = TimingTypes.Rapid,
            Seconds = 10 * 60,
            Increment = 0,
        };

        var request = new CreateGameByEmailRequest()
        {
            Email = friend.Email,
            Type = gameTiming.Type,
            Minutes = gameTiming.Seconds / 60,
            Increment = gameTiming.Increment,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockUserRepository.Setup(x => x.GetById(userId)).ReturnsAsync(user);
        _mockUserRepository.Setup(x => x.GetByEmail(request.Email)).ReturnsAsync(friend);
        _mockGameTimingRepository.Setup(x => x.FindTiming(request.Type, request.Minutes * 60, request.Increment)).ReturnsAsync(gameTiming);


        var handler = new CreateGameByEmailRequestHandler(
             _mockUserContextService.Object,
             _mockUserRepository.Object,
             _mockGameRepository.Object,
             _mockGameTimingRepository.Object,
             _mockGameStateRepository.Object,
             _mockPlayerRepository.Object,
             _mockGameInvitationRepository.Object,
             _mockSmtpService.Object
         );

        var result = await handler.Handle(request, CancellationToken.None);


        result.Should().NotBeNull();
        result.GameId.Should().NotBeEmpty();

        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(userId), Times.Once);
        _mockUserRepository.Verify(x => x.GetByEmail(request.Email), Times.Once);
        _mockGameTimingRepository.Verify(x => x.FindTiming(request.Type, request.Minutes * 60, request.Increment), Times.Once);
        _mockGameTimingRepository.Verify(x => x.Create(It.IsAny<GameTiming>()), Times.Never);
        _mockPlayerRepository.Verify(x => x.Create(It.IsAny<Player>()), Times.Exactly(2));
        _mockGameRepository.Verify(x => x.Create(It.IsAny<Entities.Game>()), Times.Once);
        _mockGameStateRepository.Verify(x => x.Create(It.IsAny<GameState>()), Times.Once);
        _mockGameInvitationRepository.Verify(x => x.Create(It.IsAny<GameInvitation>()), Times.Once);
        _mockSmtpService.Verify(x => x.SendGameInvitation(friend.Email, friend.Username, user.Username), Times.Once);
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
        var friend = new Entities.User()
        {
            Id = Guid.NewGuid(),
            Email = "friend@test.com",
            Username = "Friend",
            Elo = new UserElo(),
        };

        var gameTiming = new GameTiming()
        {
            Type = TimingTypes.Rapid,
            Seconds = 10 * 60,
            Increment = 0,
        };

        var request = new CreateGameByEmailRequest()
        {
            Email = friend.Email,
            Type = gameTiming.Type,
            Minutes = gameTiming.Seconds / 60,
            Increment = gameTiming.Increment,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockUserRepository.Setup(x => x.GetById(userId)).ReturnsAsync(user);
        _mockUserRepository.Setup(x => x.GetByEmail(request.Email)).ReturnsAsync(friend);
        // game timing not returned


        var handler = new CreateGameByEmailRequestHandler(
             _mockUserContextService.Object,
             _mockUserRepository.Object,
             _mockGameRepository.Object,
             _mockGameTimingRepository.Object,
             _mockGameStateRepository.Object,
             _mockPlayerRepository.Object,
             _mockGameInvitationRepository.Object,
             _mockSmtpService.Object
         );

        var result = await handler.Handle(request, CancellationToken.None);


        result.Should().NotBeNull();
        result.GameId.Should().NotBeEmpty();

        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(userId), Times.Once);
        _mockUserRepository.Verify(x => x.GetByEmail(request.Email), Times.Once);
        _mockGameTimingRepository.Verify(x => x.FindTiming(request.Type, request.Minutes * 60, request.Increment), Times.Once);
        _mockGameTimingRepository.Verify(x => x.Create(It.IsAny<GameTiming>()), Times.Once);
        _mockPlayerRepository.Verify(x => x.Create(It.IsAny<Player>()), Times.Exactly(2));
        _mockGameRepository.Verify(x => x.Create(It.IsAny<Entities.Game>()), Times.Once);
        _mockGameStateRepository.Verify(x => x.Create(It.IsAny<GameState>()), Times.Once);
        _mockGameInvitationRepository.Verify(x => x.Create(It.IsAny<GameInvitation>()), Times.Once);
        _mockSmtpService.Verify(x => x.SendGameInvitation(friend.Email, friend.Username, user.Username), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_User_Does_Not_Exists() {

        var userId = Guid.NewGuid();

        var gameTiming = new GameTiming()
        {
            Type = TimingTypes.Rapid,
            Seconds = 10 * 60,
            Increment = 0,
        };

        var request = new CreateGameByEmailRequest()
        {
            Email = "friend@test.com",
            Type = gameTiming.Type,
            Minutes = gameTiming.Seconds / 60,
            Increment = gameTiming.Increment,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        // user not returned
    


        var handler = new CreateGameByEmailRequestHandler(
             _mockUserContextService.Object,
             _mockUserRepository.Object,
             _mockGameRepository.Object,
             _mockGameTimingRepository.Object,
             _mockGameStateRepository.Object,
             _mockPlayerRepository.Object,
             _mockGameInvitationRepository.Object,
             _mockSmtpService.Object
         );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(userId), Times.Once);
        _mockUserRepository.Verify(x => x.GetByEmail(request.Email), Times.Never);
        _mockGameTimingRepository.Verify(x => x.FindTiming(request.Type, request.Minutes * 60, request.Increment), Times.Never);
        _mockGameTimingRepository.Verify(x => x.Create(It.IsAny<GameTiming>()), Times.Never);
        _mockPlayerRepository.Verify(x => x.Create(It.IsAny<Player>()), Times.Never);
        _mockGameRepository.Verify(x => x.Create(It.IsAny<Entities.Game>()), Times.Never);
        _mockGameStateRepository.Verify(x => x.Create(It.IsAny<GameState>()), Times.Never);
        _mockGameInvitationRepository.Verify(x => x.Create(It.IsAny<GameInvitation>()), Times.Never);
        _mockSmtpService.Verify(x => x.SendGameInvitation(request.Email, It.IsAny<string>(), It.IsAny<string>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_Friend_Does_Not_Exists() {

        var userId = Guid.NewGuid();

        var user = new Entities.User()
        {
            Id = userId,
            Email = "user@test.com",
            Username = "Username",
            Elo = new UserElo(),
        };

        var gameTiming = new GameTiming()
        {
            Type = TimingTypes.Rapid,
            Seconds = 10 * 60,
            Increment = 0,
        };

        var request = new CreateGameByEmailRequest()
        {
            Email = "friend@test.com",
            Type = gameTiming.Type,
            Minutes = gameTiming.Seconds / 60,
            Increment = gameTiming.Increment,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockUserRepository.Setup(x => x.GetById(userId)).ReturnsAsync(user);
        // friend user not returned


        var handler = new CreateGameByEmailRequestHandler(
             _mockUserContextService.Object,
             _mockUserRepository.Object,
             _mockGameRepository.Object,
             _mockGameTimingRepository.Object,
             _mockGameStateRepository.Object,
             _mockPlayerRepository.Object,
             _mockGameInvitationRepository.Object,
             _mockSmtpService.Object
         );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(userId), Times.Once);
        _mockUserRepository.Verify(x => x.GetByEmail(request.Email), Times.Once);
        _mockGameTimingRepository.Verify(x => x.FindTiming(request.Type, request.Minutes * 60, request.Increment), Times.Never);
        _mockGameTimingRepository.Verify(x => x.Create(It.IsAny<GameTiming>()), Times.Never);
        _mockPlayerRepository.Verify(x => x.Create(It.IsAny<Player>()), Times.Never);
        _mockGameRepository.Verify(x => x.Create(It.IsAny<Entities.Game>()), Times.Never);
        _mockGameStateRepository.Verify(x => x.Create(It.IsAny<GameState>()), Times.Never);
        _mockGameInvitationRepository.Verify(x => x.Create(It.IsAny<GameInvitation>()), Times.Never);
        _mockSmtpService.Verify(x => x.SendGameInvitation(request.Email, It.IsAny<string>(), It.IsAny<string>()), Times.Never);
    }
}
