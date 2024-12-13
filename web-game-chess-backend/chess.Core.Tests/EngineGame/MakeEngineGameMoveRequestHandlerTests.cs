
using chess.Application.Repositories.EngineGameRepositories;
using chess.Application.Requests.EngineRequests.MakeEngineGameMove;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.EngineGame;

public class MakeEngineGameMoveRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IEngineGameRepository> _mockEngineGameRepository;
    private readonly Mock<IEngineGameMoveRepository> _mockEngineGameMoveRepository;

    public MakeEngineGameMoveRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockEngineGameRepository = new Mock<IEngineGameRepository>();
        _mockEngineGameMoveRepository = new Mock<IEngineGameMoveRepository>();
    }

    [Fact]
    public async Task Handle_Creates_Move_And_Updates_Game_On_Success() {
    
        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var game = new Entities.EngineGame()
        {
            Id = gameId,
            HasEnded = false,
            CurrentState = new EngineGameState(),
            Player   = new EngineGamePlayer()
            {
                Name = "Username",
                UserId = userId,
            },
        };

        var request = new MakeEngineGameMoveRequest()
        {
            GameId = gameId,
            Position = game.Position,
            Move = "e2e4",
            FenMove = "",
            OldCoor = "5,2",
            NewCoor = "5,4",
        };

        
        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockEngineGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);


        var handler = new MakeEngineGameMoveRequestHandler(
            _mockUserContextService.Object,
            _mockEngineGameRepository.Object,
            _mockEngineGameMoveRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);
        await act.Should().NotThrowAsync();


        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockEngineGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockEngineGameMoveRepository.Verify(x => x.Create(It.IsAny<EngineGameMove>()), Times.Once);
        _mockEngineGameRepository.Verify(x => x.Update(game), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_Game_Does_Not_Exist() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var request = new MakeEngineGameMoveRequest()
        {
            GameId = gameId,
            Position = "",
            Move = "e2e4",
            FenMove = "",
            OldCoor = "5,2",
            NewCoor = "5,4",
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        // game not returned


        var handler = new MakeEngineGameMoveRequestHandler(
            _mockUserContextService.Object,
            _mockEngineGameRepository.Object,
            _mockEngineGameMoveRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);
        await act.Should().ThrowAsync<NotFoundException>();


        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockEngineGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockEngineGameMoveRepository.Verify(x => x.Create(It.IsAny<EngineGameMove>()), Times.Never);
        _mockEngineGameRepository.Verify(x => x.Update(It.IsAny<Entities.EngineGame>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_UnauthorizedException_When_User_Is_Not_Player_Of_Game() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var game = new Entities.EngineGame()
        {
            Id = gameId,
            HasEnded = false,
            CurrentState = new EngineGameState(),
            Player = new EngineGamePlayer()
            {
                Name = "Username",
                UserId = Guid.NewGuid(), // not user player
            },
        };

        var request = new MakeEngineGameMoveRequest()
        {
            GameId = gameId,
            Position = game.Position,
            Move = "e2e4",
            FenMove = "",
            OldCoor = "5,2",
            NewCoor = "5,4",
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockEngineGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);


        var handler = new MakeEngineGameMoveRequestHandler(
            _mockUserContextService.Object,
            _mockEngineGameRepository.Object,
            _mockEngineGameMoveRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);
        await act.Should().ThrowAsync<UnauthorizedException>();


        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockEngineGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockEngineGameMoveRepository.Verify(x => x.Create(It.IsAny<EngineGameMove>()), Times.Never);
        _mockEngineGameRepository.Verify(x => x.Update(It.IsAny<Entities.EngineGame>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_BadRequestException_When_Game_Has_Ended() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var game = new Entities.EngineGame()
        {
            Id = gameId,
            HasEnded = true, // game is ended
            CurrentState = new EngineGameState(),
            Player = new EngineGamePlayer()
            {
                Name = "Username",
                UserId = userId,
            },
        };

        var request = new MakeEngineGameMoveRequest()
        {
            GameId = gameId,
            Position = game.Position,
            Move = "e2e4",
            FenMove = "",
            OldCoor = "5,2",
            NewCoor = "5,4",
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockEngineGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);


        var handler = new MakeEngineGameMoveRequestHandler(
            _mockUserContextService.Object,
            _mockEngineGameRepository.Object,
            _mockEngineGameMoveRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);
        await act.Should().ThrowAsync<BadRequestException>();


        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockEngineGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockEngineGameMoveRepository.Verify(x => x.Create(It.IsAny<EngineGameMove>()), Times.Never);
        _mockEngineGameRepository.Verify(x => x.Update(It.IsAny<Entities.EngineGame>()), Times.Never);
    }
}
