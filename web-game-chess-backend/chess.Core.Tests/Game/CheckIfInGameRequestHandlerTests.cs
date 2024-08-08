
using chess.Application.Repositories;
using chess.Application.Requests.GameRequests.CheckIfInGame;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.Game;

public class CheckIfInGameRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IPlayerRepository> _mockPlayerRepository;
    private readonly Mock<IGameRepository> _mockGameRepository;

    public CheckIfInGameRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockPlayerRepository = new Mock<IPlayerRepository>();
        _mockGameRepository = new Mock<IGameRepository>();
    }

    [Fact]
    public async Task Handle_Returns_IsPlayingDto_On_Success() {

        var userId = Guid.NewGuid();
        var playerId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var examplePlayer = new Player()
        {
            Id = playerId,
            Name = "Username",
            IsPlaying = true,
            UserId = userId,
            GameId = gameId,
        };

        var request = new CheckIfInGameRequest() 
        { 
            PlayerId = playerId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockPlayerRepository.Setup(x => x.GetById(playerId)).ReturnsAsync(examplePlayer);
        _mockGameRepository.Setup(x => x.GetGameForPlayer(playerId)).ReturnsAsync(new Entities.Game()
        {
            Id = gameId,
        });


        var handler = new CheckIfInGameRequestHandler(
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
    public async Task Handle_Throws_NotFoundException_When_Player_Does_Not_Exists() {

        var userId = Guid.NewGuid();
        var playerId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var request = new CheckIfInGameRequest()
        {
            PlayerId = playerId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);


        var handler = new CheckIfInGameRequestHandler(
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

        var request = new CheckIfInGameRequest()
        {
            PlayerId = playerId,
        };

        var examplePlayer = new Player()
        {
            Id = playerId,
            Name = "Username",
            IsPlaying = true,
            UserId = Guid.NewGuid(),
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockPlayerRepository.Setup(x => x.GetById(playerId)).ReturnsAsync(examplePlayer);


        var handler = new CheckIfInGameRequestHandler(
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

        var request = new CheckIfInGameRequest()
        {
            PlayerId = playerId,
        };

        var examplePlayer = new Player()
        {
            Id = playerId,
            Name = "Username",
            IsPlaying = true,
            UserId = userId,
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockPlayerRepository.Setup(x => x.GetById(playerId)).ReturnsAsync(examplePlayer);


        var handler = new CheckIfInGameRequestHandler(
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
