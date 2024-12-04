
using chess.Application.Repositories.EngineGameRepositories;
using chess.Application.Requests.EngineRequests.GetEngineGameMove;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.EngineGame;

public class GetEngineGameMoveRequestHandlerTests {

    private readonly Mock<IEngineService> _mockEngineService;
    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IEngineGameRepository> _mockEngineGameRepository;

    public GetEngineGameMoveRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockEngineGameRepository = new Mock<IEngineGameRepository>();
        _mockEngineService = new Mock<IEngineService>();
    }

    [Fact]
    public async Task Handle_Returns_MoveDto_On_Success() { 
        
        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        string bestMove = "e2e4";
        string from = $"{bestMove[0] - 'a' + 1},{bestMove[1]}";
        string to = $"{bestMove[2] - 'a' + 1},{bestMove[3]}";

        var movesOutput = new List<string>() {
            "line 1",
            "line 2",
            $"bestmove {bestMove}"
        };


        var positionOutput = new List<string>
        {
            "Fen: ...",
        };

        var sequence = new Queue<List<string>>(new[] { movesOutput, positionOutput });

        var game = new Entities.EngineGame()
        {
            Id = gameId,
            EngineLevel = 10,
            CurrentState = new EngineGameState(),
            Player = new EngineGamePlayer()
            {
                Name = "Username",
                UserId = userId,
            },
        };

        var request = new GetEngineGameMoveRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockEngineGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);
        _mockEngineService.Setup(x => x.ReadOutput()).Returns(() => sequence.Dequeue());

        var handler = new GetEngineGameMoveRequestHandler(
            _mockEngineService.Object,
            _mockEngineGameRepository.Object,
            _mockUserContextService.Object
        );

        var result = await handler.Handle(request, CancellationToken.None);
        result.OldCoordinates.Should().Be(from);
        result.NewCoordinates.Should().Be(to);

        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockEngineGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockEngineService.Verify(x => x.SendCommand(It.IsAny<string>()), Times.Exactly(4));
        _mockEngineService.Verify(x => x.ReadOutput(), Times.Exactly(2));
        _mockEngineService.Verify(x => x.Close(), Times.Once);
    }

    [Fact]
    public async Task Handler_Indicates_That_Game_Should_End_If_None_BestMove_Was_Found() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var movesOutput = new List<string>() {
            "line 1",
            "line 2",
            $"bestmove (none)" // none was found as best
        };

        var game = new Entities.EngineGame()
        {
            Id = gameId,
            EngineLevel = 10,
            CurrentState = new EngineGameState(),
            Player = new EngineGamePlayer()
            {
                Name = "Username",
                UserId = userId,
            },
        };

        var request = new GetEngineGameMoveRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockEngineGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);
        _mockEngineService.Setup(x => x.ReadOutput()).Returns(movesOutput);


        var handler = new GetEngineGameMoveRequestHandler(
            _mockEngineService.Object,
            _mockEngineGameRepository.Object,
            _mockUserContextService.Object
        );

        var result = await handler.Handle(request, CancellationToken.None);
        result.ShouldEnd.Should().BeTrue();


        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockEngineGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockEngineService.Verify(x => x.SendCommand(It.IsAny<string>()), Times.Exactly(2));
        _mockEngineService.Verify(x => x.ReadOutput(), Times.Once);
        _mockEngineService.Verify(x => x.Close(), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_Game_Does_Not_Exists() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var request = new GetEngineGameMoveRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        // game not returned

        var handler = new GetEngineGameMoveRequestHandler(
            _mockEngineService.Object,
            _mockEngineGameRepository.Object,
            _mockUserContextService.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);
        await act.Should().ThrowAsync<NotFoundException>();


        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockEngineGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockEngineService.Verify(x => x.SendCommand(It.IsAny<string>()), Times.Never);
        _mockEngineService.Verify(x => x.ReadOutput(), Times.Never);
        _mockEngineService.Verify(x => x.Close(), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_UnauthorizedException_When_User_Is_Not_Player_Of_Game() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var game = new Entities.EngineGame()
        {
            Id = gameId,
            EngineLevel = 10,
            CurrentState = new EngineGameState(),
            Player = new EngineGamePlayer()
            {
                Name = "Username",
                UserId = Guid.NewGuid(), // not user player
            },
        };

        var request = new GetEngineGameMoveRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockEngineGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);

        var handler = new GetEngineGameMoveRequestHandler(
            _mockEngineService.Object,
            _mockEngineGameRepository.Object,
            _mockUserContextService.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);
        await act.Should().ThrowAsync<UnauthorizedException>();


        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockEngineGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockEngineService.Verify(x => x.SendCommand(It.IsAny<string>()), Times.Never);
        _mockEngineService.Verify(x => x.ReadOutput(), Times.Never);
        _mockEngineService.Verify(x => x.Close(), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_InvalidOperationException_When_EngineSerives_Did_Not_Found_BestMove() {


        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var movesOutput = new List<string>() {
            "line 1",
            "line 2",
            // best move line not present
        };


        var game = new Entities.EngineGame()
        {
            Id = gameId,
            EngineLevel = 10,
            CurrentState = new EngineGameState(),
            Player = new EngineGamePlayer()
            {
                Name = "Username",
                UserId = userId,
            },
        };

        var request = new GetEngineGameMoveRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockEngineGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);
        _mockEngineService.Setup(x => x.ReadOutput()).Returns(movesOutput);

        var handler = new GetEngineGameMoveRequestHandler(
            _mockEngineService.Object,
            _mockEngineGameRepository.Object,
            _mockUserContextService.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);
        await act.Should().ThrowAsync<InvalidOperationException>();


        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockEngineGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockEngineService.Verify(x => x.SendCommand(It.IsAny<string>()), Times.Exactly(2));
        _mockEngineService.Verify(x => x.ReadOutput(), Times.AtLeast(1));
        _mockEngineService.Verify(x => x.Close(), Times.Never);
    }

    [Fact]
    public async Task Handlde_Throws_InvalidOperationException_When_EngineSerive_Did_Not_Return_FenPosition() {


        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        string bestMove = "e2e4";
        var movesOutput = new List<string>() {
            "line 1",
            "line 2",
            $"bestmove {bestMove}"
        };


        var positionOutput = new List<string>
        {
            "...", // do not return "Fen:"
        };

        var sequence = new Queue<List<string>>(new[] { movesOutput, positionOutput });

        var game = new Entities.EngineGame()
        {
            Id = gameId,
            EngineLevel = 10,
            CurrentState = new EngineGameState(),
            Player = new EngineGamePlayer()
            {
                Name = "Username",
                UserId = userId,
            },
        };

        var request = new GetEngineGameMoveRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockEngineGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);
        _mockEngineService.Setup(x => x.ReadOutput()).Returns(() => sequence.Dequeue());

        var handler = new GetEngineGameMoveRequestHandler(
            _mockEngineService.Object,
            _mockEngineGameRepository.Object,
            _mockUserContextService.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);
        await act.Should().ThrowAsync<InvalidOperationException>();


        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockEngineGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockEngineService.Verify(x => x.SendCommand(It.IsAny<string>()), Times.AtLeast(3));
        _mockEngineService.Verify(x => x.ReadOutput(), Times.Exactly(2));
        _mockEngineService.Verify(x => x.Close(), Times.Never);
    }
}
