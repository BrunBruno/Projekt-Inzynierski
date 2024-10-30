
using chess.Application.Repositories.WebGameRepositories;
using chess.Application.Requests.WebGameRequests.GetOpponent;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.WebGame;

public class GetOpponentRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IWebGameRepository> _mockGameRepository;


    public GetOpponentRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockGameRepository = new Mock<IWebGameRepository>();
    }

    [Fact]
    public async Task Handle_Returns_OpponentId_On_Success() {

        var userId = Guid.NewGuid();
        var opponentId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var game = new Entities.WebGame()
        {
            Id = gameId,

              WhitePlayerRegistered = true,
            BlackPlayerRegistered = true,
            WhitePlayer = new WebGamePlayer()
            {
                Name = "Username",
                UserId = userId,
            },
            BlackPlayer = new WebGamePlayer()
            {
                Name = "Opponent",
                UserId = opponentId,
            },
        };

        var request = new GetOpponentRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);


        var handler = new GetOpponentRequestHandler(
            _mockUserContextService.Object,
            _mockGameRepository.Object
        );

        var result = await handler.Handle(request, CancellationToken.None);


        result.OpponentId.Should().Be(opponentId);

        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_Game_Does_Not_Exist() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var request = new GetOpponentRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        // game not returned


        var handler = new GetOpponentRequestHandler(
            _mockUserContextService.Object,
            _mockGameRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_UnauthorizedException_When_User_Does_Not_Belong_To_Game() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();



        var game = new Entities.WebGame()
        {
            Id = gameId,
            WhitePlayerRegistered = true,
            BlackPlayerRegistered = true,  
            
            WhitePlayer = new WebGamePlayer()
            {
                Name = "Other",
                UserId = Guid.NewGuid(), // user is not player
            },

            BlackPlayer = new WebGamePlayer()
            {
                Name = "Opponent",
                UserId = Guid.NewGuid(),  // user is not player
            },

            Moves = new List<WebGameMove>() { },
            CurrentState = new WebGameState(),
        };

        var request = new GetOpponentRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);


        var handler = new GetOpponentRequestHandler(
            _mockUserContextService.Object,
            _mockGameRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<UnauthorizedException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
    }
}
