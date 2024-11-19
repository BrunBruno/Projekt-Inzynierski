using chess.Application.Repositories.UserRepositories;
using chess.Application.Repositories.WebGameRepositories;
using chess.Application.Requests.WebGameRequests.CreatePrivateGameByEmail;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.WebGame;

public class CreatePrivateGameByEmailRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IUserRepository> _mockUserRepository;
    private readonly Mock<IWebGamePlayerRepository> _mockPlayerRepository;
    private readonly Mock<IWebGameRepository> _mockGameRepository;
    private readonly Mock<IWebGameTimingRepository> _mockGameTimingRepository;
    private readonly Mock<IWebGameStateRepository> _mockGameStateRepository;
    private readonly Mock<IWebGameInvitationRepository> _mockGameInvitationRepository;
    private readonly Mock<ISmtpService> _mockSmtpService;

    public CreatePrivateGameByEmailRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockUserRepository = new Mock<IUserRepository>();
        _mockPlayerRepository = new Mock<IWebGamePlayerRepository>();
        _mockGameRepository = new Mock<IWebGameRepository>();
        _mockGameTimingRepository = new Mock<IWebGameTimingRepository>();
        _mockGameStateRepository = new Mock<IWebGameStateRepository>();
        _mockGameInvitationRepository = new Mock<IWebGameInvitationRepository>();
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

        var gameTiming = new WebGameTiming()
        {
            Type = TimingTypes.Rapid,
            Seconds = 10 * 60,
            Increment = 0,
        };

        var request = new CreatePrivateGameByEmailRequest()
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


        var handler = new CreatePrivateGameByEmailRequestHandler(
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
        _mockGameTimingRepository.Verify(x => x.Create(It.IsAny<WebGameTiming>()), Times.Never);
        _mockPlayerRepository.Verify(x => x.Create(It.IsAny<WebGamePlayer>()), Times.Exactly(2));
        _mockGameRepository.Verify(x => x.Create(It.IsAny<Entities.WebGame>()), Times.Once);
        _mockGameStateRepository.Verify(x => x.Create(It.IsAny<WebGameState>()), Times.Once);
        _mockGameInvitationRepository.Verify(x => x.Create(It.IsAny<WebGameInvitation>()), Times.Once);
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

        var gameTiming = new WebGameTiming()
        {
            Type = TimingTypes.Rapid,
            Seconds = 10 * 60,
            Increment = 0,
        };

        var request = new CreatePrivateGameByEmailRequest()
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


        var handler = new CreatePrivateGameByEmailRequestHandler(
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
        _mockGameTimingRepository.Verify(x => x.Create(It.IsAny<WebGameTiming>()), Times.Once);
        _mockPlayerRepository.Verify(x => x.Create(It.IsAny<WebGamePlayer>()), Times.Exactly(2));
        _mockGameRepository.Verify(x => x.Create(It.IsAny<Entities.WebGame>()), Times.Once);
        _mockGameStateRepository.Verify(x => x.Create(It.IsAny<WebGameState>()), Times.Once);
        _mockGameInvitationRepository.Verify(x => x.Create(It.IsAny<WebGameInvitation>()), Times.Once);
        _mockSmtpService.Verify(x => x.SendGameInvitation(friend.Email, friend.Username, user.Username), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_User_Does_Not_Exists() {

        var userId = Guid.NewGuid();

        var gameTiming = new WebGameTiming()
        {
            Type = TimingTypes.Rapid,
            Seconds = 10 * 60,
            Increment = 0,
        };

        var request = new CreatePrivateGameByEmailRequest()
        {
            Email = "friend@test.com",
            Type = gameTiming.Type,
            Minutes = gameTiming.Seconds / 60,
            Increment = gameTiming.Increment,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        // user not returned
    


        var handler = new CreatePrivateGameByEmailRequestHandler(
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
        _mockGameTimingRepository.Verify(x => x.Create(It.IsAny<WebGameTiming>()), Times.Never);
        _mockPlayerRepository.Verify(x => x.Create(It.IsAny<WebGamePlayer>()), Times.Never);
        _mockGameRepository.Verify(x => x.Create(It.IsAny<Entities.WebGame>()), Times.Never);
        _mockGameStateRepository.Verify(x => x.Create(It.IsAny<WebGameState>()), Times.Never);
        _mockGameInvitationRepository.Verify(x => x.Create(It.IsAny<WebGameInvitation>()), Times.Never);
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

        var gameTiming = new WebGameTiming()
        {
            Type = TimingTypes.Rapid,
            Seconds = 10 * 60,
            Increment = 0,
        };

        var request = new CreatePrivateGameByEmailRequest()
        {
            Email = "friend@test.com",
            Type = gameTiming.Type,
            Minutes = gameTiming.Seconds / 60,
            Increment = gameTiming.Increment,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockUserRepository.Setup(x => x.GetById(userId)).ReturnsAsync(user);
        // friend user not returned


        var handler = new CreatePrivateGameByEmailRequestHandler(
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
        _mockGameTimingRepository.Verify(x => x.Create(It.IsAny<WebGameTiming>()), Times.Never);
        _mockPlayerRepository.Verify(x => x.Create(It.IsAny<WebGamePlayer>()), Times.Never);
        _mockGameRepository.Verify(x => x.Create(It.IsAny<Entities.WebGame>()), Times.Never);
        _mockGameStateRepository.Verify(x => x.Create(It.IsAny<WebGameState>()), Times.Never);
        _mockGameInvitationRepository.Verify(x => x.Create(It.IsAny<WebGameInvitation>()), Times.Never);
        _mockSmtpService.Verify(x => x.SendGameInvitation(request.Email, It.IsAny<string>(), It.IsAny<string>()), Times.Never);
    }
}
