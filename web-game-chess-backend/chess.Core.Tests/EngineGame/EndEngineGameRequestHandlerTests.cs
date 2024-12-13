
using chess.Application.Repositories.EngineGameRepositories;
using chess.Application.Repositories.UserRepositories;
using chess.Application.Requests.EngineRequests.EndEngineGame;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.EngineGame;

public class EndEngineGameRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IEngineGameRepository> _mockEngineGameRepository;
    private readonly Mock<IEngineGameMessageRepository> _mockEngineGameMessageRepository;
    private readonly Mock<IUserRepository> _mockUserRepository;

    public EndEngineGameRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockEngineGameRepository = new Mock<IEngineGameRepository>();
        _mockEngineGameMessageRepository = new Mock<IEngineGameMessageRepository>();
        _mockUserRepository = new Mock<IUserRepository>();
    }

    [Fact]
    public async Task Handle_Updates_Game_And_User_On_Success() { 
    
        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var user = new Entities.User()
        {
            Email = "test@test.com",
            Username = "Username",

            Stats = new UserStats(),
            Elo = new UserElo(),
        };

        var game = new Entities.EngineGame()
        {
            Id = gameId,
            HasEnded = false,
            Player = new EngineGamePlayer()
            {
                Name = user.Username,
                UserId = userId,
            },
        };

        var request = new EndEngineGameRequest()
        {
            GameId = gameId,
            IsCheckMate = false,
            LoserColor = PieceColor.White,
        };

        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockUserRepository.Setup(x => x.GetById(userId)).ReturnsAsync(user);
        _mockEngineGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);

        var handler = new EndEngineGameRequestHandler(
            _mockEngineGameRepository.Object,
            _mockUserContextService.Object,
            _mockEngineGameMessageRepository.Object,
            _mockUserRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);
        await act.Should().NotThrowAsync();


        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(userId), Times.Once);
        _mockEngineGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockEngineGameMessageRepository.Verify(x => x.Create(It.IsAny<EngineGameMessage>()), Times.Once);
        _mockEngineGameRepository.Verify(x => x.Update(game), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_User_Does_Not_Exists() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var request = new EndEngineGameRequest()
        {
            GameId = gameId,
            IsCheckMate = false,
            LoserColor = PieceColor.White,
        };

        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        // user not returned

        var handler = new EndEngineGameRequestHandler(
            _mockEngineGameRepository.Object,
            _mockUserContextService.Object,
            _mockEngineGameMessageRepository.Object,
            _mockUserRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);
        await act.Should().ThrowAsync<NotFoundException>();


        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(userId), Times.Once);
        _mockEngineGameRepository.Verify(x => x.GetById(It.IsAny<Guid>()), Times.Never);
        _mockEngineGameMessageRepository.Verify(x => x.Create(It.IsAny<EngineGameMessage>()), Times.Never);
        _mockEngineGameRepository.Verify(x => x.Update(It.IsAny<Entities.EngineGame>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_Game_Does_Not_Exists() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var user = new Entities.User()
        {
            Email = "test@test.com",
            Username = "Username",

            Stats = new UserStats(),
            Elo = new UserElo(),
        };

        var request = new EndEngineGameRequest()
        {
            GameId = gameId,
            IsCheckMate = false,
            LoserColor = PieceColor.White,
        };

        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockUserRepository.Setup(x => x.GetById(userId)).ReturnsAsync(user);
        // game not returned

        var handler = new EndEngineGameRequestHandler(
            _mockEngineGameRepository.Object,
            _mockUserContextService.Object,
            _mockEngineGameMessageRepository.Object,
            _mockUserRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);
        await act.Should().ThrowAsync<NotFoundException>();


        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(userId), Times.Once);
        _mockEngineGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockEngineGameMessageRepository.Verify(x => x.Create(It.IsAny<EngineGameMessage>()), Times.Never);
        _mockEngineGameRepository.Verify(x => x.Update(It.IsAny<Entities.EngineGame>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_UnauthorizedException_When_User_Is_Not_Player_Of_Game() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var user = new Entities.User()
        {
            Email = "test@test.com",
            Username = "Username",

            Stats = new UserStats(),
            Elo = new UserElo(),
        };

        var game = new Entities.EngineGame()
        {
            Id = gameId,
            HasEnded = false,
            Player = new EngineGamePlayer()
            {
                Name = user.Username,
                UserId = Guid.NewGuid(), // not user player
            },
        };

        var request = new EndEngineGameRequest()
        {
            GameId = gameId,
            IsCheckMate = false,
            LoserColor = PieceColor.White,
        };

        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockUserRepository.Setup(x => x.GetById(userId)).ReturnsAsync(user);
        _mockEngineGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);

        var handler = new EndEngineGameRequestHandler(
            _mockEngineGameRepository.Object,
            _mockUserContextService.Object,
            _mockEngineGameMessageRepository.Object,
            _mockUserRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);
        await act.Should().ThrowAsync<UnauthorizedException>();


        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(userId), Times.Once);
        _mockEngineGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockEngineGameMessageRepository.Verify(x => x.Create(It.IsAny<EngineGameMessage>()), Times.Never);
        _mockEngineGameRepository.Verify(x => x.Update(It.IsAny<Entities.EngineGame>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_BadRequestException_When_Game_Is_Ended() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var user = new Entities.User()
        {
            Email = "test@test.com",
            Username = "Username",

            Stats = new UserStats(),
            Elo = new UserElo(),
        };

        var game = new Entities.EngineGame()
        {
            Id = gameId,
            HasEnded = true, // ended game
            Player = new EngineGamePlayer()
            {
                Name = user.Username,
                UserId = userId,
            },
        };

        var request = new EndEngineGameRequest()
        {
            GameId = gameId,
            IsCheckMate = false,
            LoserColor = PieceColor.White,
        };

        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockUserRepository.Setup(x => x.GetById(userId)).ReturnsAsync(user);
        _mockEngineGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);

        var handler = new EndEngineGameRequestHandler(
            _mockEngineGameRepository.Object,
            _mockUserContextService.Object,
            _mockEngineGameMessageRepository.Object,
            _mockUserRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);
        await act.Should().ThrowAsync<BadRequestException>();


        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(userId), Times.Once);
        _mockEngineGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockEngineGameMessageRepository.Verify(x => x.Create(It.IsAny<EngineGameMessage>()), Times.Never);
        _mockEngineGameRepository.Verify(x => x.Update(It.IsAny<Entities.EngineGame>()), Times.Never);
    }
}
