
using chess.Application.Repositories.EngineGameRepositories;
using chess.Application.Repositories.UserRepositories;
using chess.Application.Requests.EngineRequests.GetEngineGame;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.EngineGame;

public class GetEngineGameRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IEngineGameRepository> _mockEngineGameRepository;
    private readonly Mock<IUserSettingsRepository> _mockUserSettingsRepository;

    public GetEngineGameRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockEngineGameRepository = new Mock<IEngineGameRepository>();
        _mockUserSettingsRepository = new Mock<IUserSettingsRepository>();
    }

    [Fact]
    public async Task Handle_Returns_GameDto_On_Success() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var settings = new UserSettings();

        var game = new Entities.EngineGame()
        {
            Id = gameId,
            CurrentState = new EngineGameState(),
            Player = new EngineGamePlayer()
            {
                Name = "Username",
                Color = PieceColor.Black,
                UserId = userId,

                User = new Entities.User()
                {
                    Email = "test@test.com",
                    Username = "Username",
                },
            },
            Moves = new List<EngineGameMove>() { },
        };

        var request = new GetEngineGameRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockUserSettingsRepository.Setup(x => x.GetByUserId(userId)).ReturnsAsync(settings);
        _mockEngineGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);


        var handler = new GetEngineGameRequestHandler(
            _mockUserContextService.Object,
            _mockEngineGameRepository.Object,
            _mockUserSettingsRepository.Object
        );

        var result = await handler.Handle(request, CancellationToken.None);
        result.Player.Name.Should().Be("Username");

        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserSettingsRepository.Verify(x => x.GetByUserId(userId), Times.Once);
        _mockEngineGameRepository.Verify(x => x.GetById(gameId), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_UserSettings_Does_Not_Exists() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();



        var request = new GetEngineGameRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        // settings not returned

        var handler = new GetEngineGameRequestHandler(
            _mockUserContextService.Object,
            _mockEngineGameRepository.Object,
            _mockUserSettingsRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);
        await act.Should().ThrowAsync<NotFoundException>();

        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserSettingsRepository.Verify(x => x.GetByUserId(userId), Times.Once);
        _mockEngineGameRepository.Verify(x => x.GetById(It.IsAny<Guid>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_Game_Does_Not_Exists() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var settings = new UserSettings();


        var request = new GetEngineGameRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockUserSettingsRepository.Setup(x => x.GetByUserId(userId)).ReturnsAsync(settings);
        // game not returned


        var handler = new GetEngineGameRequestHandler(
            _mockUserContextService.Object,
            _mockEngineGameRepository.Object,
            _mockUserSettingsRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);
        await act.Should().ThrowAsync<NotFoundException>();

        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserSettingsRepository.Verify(x => x.GetByUserId(userId), Times.Once);
        _mockEngineGameRepository.Verify(x => x.GetById(gameId), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_UnauthorizedException_Wehn_User_Is_Not_Player_Of_Game() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var settings = new UserSettings();

        var game = new Entities.EngineGame()
        {
            Id = gameId,
            CurrentState = new EngineGameState(),
            Player = new EngineGamePlayer()
            {
                Name = "Username",
                Color = PieceColor.Black,
                UserId = Guid.NewGuid(), // not user player
            },
            Moves = new List<EngineGameMove>() { },
        };

        var request = new GetEngineGameRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockUserSettingsRepository.Setup(x => x.GetByUserId(userId)).ReturnsAsync(settings);
        _mockEngineGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);


        var handler = new GetEngineGameRequestHandler(
            _mockUserContextService.Object,
            _mockEngineGameRepository.Object,
            _mockUserSettingsRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);
        await act.Should().ThrowAsync<UnauthorizedException>();

        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserSettingsRepository.Verify(x => x.GetByUserId(userId), Times.Once);
        _mockEngineGameRepository.Verify(x => x.GetById(gameId), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_BadRequestException_When_Player_Has_Not_Been_Assigned_To_Game() {


        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var settings = new UserSettings();

        var game = new Entities.EngineGame()
        {
            Id = gameId,
            CurrentState = new EngineGameState(),
            Player = new EngineGamePlayer()
            {
                Name = "Username",
                Color = null, // not assigned correctly
                UserId = userId,
            },
            Moves = new List<EngineGameMove>() { },
        };

        var request = new GetEngineGameRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockUserSettingsRepository.Setup(x => x.GetByUserId(userId)).ReturnsAsync(settings);
        _mockEngineGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);


        var handler = new GetEngineGameRequestHandler(
            _mockUserContextService.Object,
            _mockEngineGameRepository.Object,
            _mockUserSettingsRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);
        await act.Should().ThrowAsync<BadRequestException>();

        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserSettingsRepository.Verify(x => x.GetByUserId(userId), Times.Once);
        _mockEngineGameRepository.Verify(x => x.GetById(gameId), Times.Once);
    }
}
