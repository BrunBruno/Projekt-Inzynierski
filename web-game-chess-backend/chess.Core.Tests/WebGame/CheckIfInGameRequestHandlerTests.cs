
using chess.Application.Repositories.WebGameRepositories;
using chess.Application.Requests.WebGameRequests.CheckIfInWebGame;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.WebGame;

public class CheckIfInWebGameRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IWebGamePlayerRepository> _mockPlayerRepository;
    private readonly Mock<IWebGameRepository> _mockGameRepository;

    public CheckIfInWebGameRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockPlayerRepository = new Mock<IWebGamePlayerRepository>();
        _mockGameRepository = new Mock<IWebGameRepository>();
    }

    [Fact]
    public async Task Handle_Returns_GameId_And_IsPlaying_On_Success_When_Player_Is_In_Game() {

        var userId = Guid.NewGuid();
        var playerId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var examplePlayer = new WebGamePlayer()
        {
            Id = playerId,
            Name = "Username",
            IsPlaying = true, // is playing
            UserId = userId,
            GameId = gameId,
        };

        var exampleGame = new Entities.WebGame()
        {
            Id = gameId,
        };

        var request = new CheckIfInWebGameRequest() 
        { 
            PlayerId = playerId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockPlayerRepository.Setup(x => x.GetById(playerId)).ReturnsAsync(examplePlayer);
        _mockGameRepository.Setup(x => x.GetGameForPlayer(playerId)).ReturnsAsync(exampleGame);


        var handler = new CheckIfInWebGameRequestHandler(
            _mockPlayerRepository.Object,
            _mockGameRepository.Object,
            _mockUserContextService.Object
        );

        var result = await handler.Handle(request, CancellationToken.None);


        result.IsInGame.Should().BeTrue();
        result.GameId.Should().Be(gameId);

        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetById(playerId), Times.Once);
        _mockGameRepository.Verify(x => x.GetGameForPlayer(playerId), Times.Once);
    }

    [Fact]
    public async Task Handle_Returns_Null_And_IsPlaying_On_Success_When_Player_Is_Not_In_Game() {

        var userId = Guid.NewGuid();
        var playerId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var examplePlayer = new WebGamePlayer()
        {
            Id = playerId,
            Name = "Username",
            IsPlaying = false, // is not playing
            UserId = userId,
            GameId = gameId,
        };

        var request = new CheckIfInWebGameRequest()
        {
            PlayerId = playerId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockPlayerRepository.Setup(x => x.GetById(playerId)).ReturnsAsync(examplePlayer);
        // no game returned


        var handler = new CheckIfInWebGameRequestHandler(
            _mockPlayerRepository.Object,
            _mockGameRepository.Object,
            _mockUserContextService.Object
        );

        var result = await handler.Handle(request, CancellationToken.None);


        result.IsInGame.Should().BeFalse();
        result.GameId.Should().Be(null);

        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetById(playerId), Times.Once);
        _mockGameRepository.Verify(x => x.GetGameForPlayer(playerId), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_Player_Does_Not_Exists() {

        var userId = Guid.NewGuid();
        var playerId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var request = new CheckIfInWebGameRequest()
        {
            PlayerId = playerId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        // player not exists


        var handler = new CheckIfInWebGameRequestHandler(
            _mockPlayerRepository.Object,
            _mockGameRepository.Object,
            _mockUserContextService.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetById(playerId), Times.Once);
        _mockGameRepository.Verify(x => x.GetGameForPlayer(playerId), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_UnauthorizedException_When_User_Does_Not_Own_Player() {

        var userId = Guid.NewGuid();
        var playerId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var request = new CheckIfInWebGameRequest()
        {
            PlayerId = playerId,
        };

        var examplePlayer = new WebGamePlayer()
        {
            Id = playerId,
            Name = "Username",
            IsPlaying = true,
            UserId = Guid.NewGuid(), // not owned player
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockPlayerRepository.Setup(x => x.GetById(playerId)).ReturnsAsync(examplePlayer);


        var handler = new CheckIfInWebGameRequestHandler(
            _mockPlayerRepository.Object,
            _mockGameRepository.Object,
            _mockUserContextService.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<UnauthorizedException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetById(playerId), Times.Once);
        _mockGameRepository.Verify(x => x.GetGameForPlayer(playerId), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_Game_Does_Not_Exists() {

        var userId = Guid.NewGuid();
        var playerId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var request = new CheckIfInWebGameRequest()
        {
            PlayerId = playerId,
        };

        var examplePlayer = new WebGamePlayer()
        {
            Id = playerId,
            Name = "Username",
            IsPlaying = true,
            UserId = userId,
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockPlayerRepository.Setup(x => x.GetById(playerId)).ReturnsAsync(examplePlayer);
        // game not exists


        var handler = new CheckIfInWebGameRequestHandler(
            _mockPlayerRepository.Object,
            _mockGameRepository.Object,
            _mockUserContextService.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetById(playerId), Times.Once);
        _mockGameRepository.Verify(x => x.GetGameForPlayer(playerId), Times.Once);
    }
}
