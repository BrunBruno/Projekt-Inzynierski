
using chess.Application.Repositories.EngineGameRepositories;
using chess.Application.Requests.EngineRequests.UndoMove;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;


namespace chess.Core.Tests.EngineGame;

public class UndoMoveRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IEngineGameRepository> _mockEngineGameRepository;
    private readonly Mock<IEngineGameMoveRepository> _mockEngineGameMoveRepository;

    public UndoMoveRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockEngineGameRepository = new Mock<IEngineGameRepository>();
        _mockEngineGameMoveRepository = new Mock<IEngineGameMoveRepository>();
    }

    [Fact]
    public async Task Handle_Removes_Two_Last_Moves_And_Updates_Game_On_Success() { 
    
        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var game = new Entities.EngineGame()
        {
            Id = gameId,
            Player = new EngineGamePlayer()
            {
                Name = "Username",
                UserId = userId,
            },
        };

        var request = new UndoMoveRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockEngineGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);
        _mockEngineGameMoveRepository.Setup(x => x.GetAllForGame(gameId)).ReturnsAsync(ReturnExampleMoves(10));


        var handler = new UndoMoveRequestHandler(
            _mockEngineGameRepository.Object,
            _mockUserContextService.Object,
            _mockEngineGameMoveRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);
        await act.Should().NotThrowAsync();

        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockEngineGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockEngineGameMoveRepository.Verify(x => x.GetAllForGame(gameId), Times.Once);
        _mockEngineGameMoveRepository.Verify(x => x.Delete(It.IsAny<EngineGameMove>()), Times.Exactly(2));
        _mockEngineGameRepository.Verify(x => x.Update(game), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_Game_Not_Exists() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();


        var request = new UndoMoveRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        // game not returned


        var handler = new UndoMoveRequestHandler(
            _mockEngineGameRepository.Object,
            _mockUserContextService.Object,
            _mockEngineGameMoveRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);
        await act.Should().ThrowAsync<NotFoundException>();

        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockEngineGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockEngineGameMoveRepository.Verify(x => x.GetAllForGame(It.IsAny<Guid>()), Times.Never);
        _mockEngineGameMoveRepository.Verify(x => x.Delete(It.IsAny<EngineGameMove>()), Times.Never);
        _mockEngineGameRepository.Verify(x => x.Update(It.IsAny<Entities.EngineGame>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_UnauthorizedException_When_User_Is_Not_Player_Of_Game() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var game = new Entities.EngineGame()
        {
            Id = gameId,
            Player = new EngineGamePlayer()
            {
                Name = "Username",
                UserId = Guid.NewGuid(), // not user player
            },
        };

        var request = new UndoMoveRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockEngineGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);


        var handler = new UndoMoveRequestHandler(
            _mockEngineGameRepository.Object,
            _mockUserContextService.Object,
            _mockEngineGameMoveRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);
        await act.Should().ThrowAsync<UnauthorizedException>();

        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockEngineGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockEngineGameMoveRepository.Verify(x => x.GetAllForGame(It.IsAny<Guid>()), Times.Never);
        _mockEngineGameMoveRepository.Verify(x => x.Delete(It.IsAny<EngineGameMove>()), Times.Never);
        _mockEngineGameRepository.Verify(x => x.Update(It.IsAny<Entities.EngineGame>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_BadRequestException_When_There_Is_No_Moves_To_Undo() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var game = new Entities.EngineGame()
        {
            Id = gameId,
            Player = new EngineGamePlayer()
            {
                Name = "Username",
                UserId = userId,
            },
        };

        var request = new UndoMoveRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockEngineGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);
        _mockEngineGameMoveRepository.Setup(x => x.GetAllForGame(gameId)).ReturnsAsync(ReturnExampleMoves(1)); // not enough moves to undo


        var handler = new UndoMoveRequestHandler(
            _mockEngineGameRepository.Object,
            _mockUserContextService.Object,
            _mockEngineGameMoveRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);
        await act.Should().ThrowAsync<BadRequestException>();

        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockEngineGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockEngineGameMoveRepository.Verify(x => x.GetAllForGame(gameId), Times.Once);
        _mockEngineGameMoveRepository.Verify(x => x.Delete(It.IsAny<EngineGameMove>()), Times.Never);
        _mockEngineGameRepository.Verify(x => x.Update(It.IsAny<Entities.EngineGame>()), Times.Never);
    }

    private static List<EngineGameMove> ReturnExampleMoves(int count) {
        return Enumerable.Range(0, count).Select(_ => new EngineGameMove
        {
            Position = "",
            DoneMove = "",
            FenMove = "",
            OldCoordinates = "",
            NewCoordinates = "",
        }).ToList();
    }
}
