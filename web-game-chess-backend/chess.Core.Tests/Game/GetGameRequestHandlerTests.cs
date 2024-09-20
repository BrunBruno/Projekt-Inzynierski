
using chess.Application.Repositories;
using chess.Application.Requests.GameRequests.GetGame;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.Game;

public class GetGameRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IGameRepository> _mockGameRepository;

    public GetGameRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockGameRepository = new Mock<IGameRepository>();
    }


    [Fact]
    public async Task Handle_Returns_Game_On_Success() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var game = new Entities.Game()
        {
            Id = gameId,

            WhitePlayerRegistered = true,
            BlackPlayerRegistered = true,
            WhitePlayer = new Player()
            {
                Name = "Username",
                UserId = userId,
            },
            BlackPlayer = new Player()
            {
                Name = "Opponent",
                UserId = Guid.NewGuid(),
            },
            Moves = new List<Move>() { new(), new(), new() },
            GameState = new GameState(),
        };

        var request = new GetGameRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);


        var handler = new GetGameRequestHandler(
            _mockGameRepository.Object,
            _mockUserContextService.Object
        );

        var result = await handler.Handle(request, CancellationToken.None);


        result.Should().NotBeNull();
        result.WhitePlayer.Should().NotBeNull();
        result.BlackPlayer.Should().NotBeNull();
        result.Moves.Count.Should().Be(3);  

        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockGameRepository.Verify(x => x.Update(game), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_Game_Does_Not_Exist() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var request = new GetGameRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);


        var handler = new GetGameRequestHandler(
            _mockGameRepository.Object,
            _mockUserContextService.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockGameRepository.Verify(x => x.Update(It.IsAny<Entities.Game>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_UnauthorizedException_When_User_Does_Not_Belong_To_Game() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var game = new Entities.Game()
        {
            Id = gameId,

            WhitePlayerRegistered = true,
            BlackPlayerRegistered = true,
            WhitePlayer = new Player()
            {
                Name = "Other",
                UserId = Guid.NewGuid(),
            },
            BlackPlayer = new Player()
            {
                Name = "Opponent",
                UserId = Guid.NewGuid(),
            },
            Moves = new List<Move>() { new(), new(), new() },
            GameState = new GameState(),
        };

        var request = new GetGameRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);


        var handler = new GetGameRequestHandler(
            _mockGameRepository.Object,
            _mockUserContextService.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<UnauthorizedException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockGameRepository.Verify(x => x.Update(game), Times.Never);
    }
}
