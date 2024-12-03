
using chess.Application.Repositories.WebGameRepositories;
using chess.Application.Requests.WebGameRequests.GetWebGameWinner;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.WebGame;

public class GetWebGameWinnerRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IWebGameRepository> _mockWebGameRepository;

    public GetWebGameWinnerRequestHandlerTests() {
        _mockWebGameRepository = new Mock<IWebGameRepository>();
        _mockUserContextService = new Mock<IUserContextService>();
    }

    [Fact]
    public async Task Handle_Returns_Winner_On_Success() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var game = new Entities.WebGame()
        {
            Id = gameId,
            HasEnded = true,
            EndGameType = GameEndReason.CheckMate,
            WinnerColor = PieceColor.Black,
            EloGain = 10,
            WhitePlayer = new WebGamePlayer()
            {
                Name = "Username",
                UserId = userId,
            },
            BlackPlayer = new WebGamePlayer()
            {
                Name = "Opponent",
                UserId = Guid.NewGuid(),
            }
        };

        var request = new GetWebGameWinnerRequest() { 
            GameId = gameId 
        };

        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockWebGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);


        var handler = new GetWebGameWinnerRequestHandler(
            _mockUserContextService.Object,
            _mockWebGameRepository.Object
        );

        var result = await handler.Handle(request, CancellationToken.None);

        result.Should().NotBeNull();
        result.WinnerColor.Should().Be(PieceColor.Black);
        result.EloGain.Should().Be(10);

        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockWebGameRepository.Verify(x => x.GetById(gameId), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_Game_Does_Not_Exists() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();


        var request = new GetWebGameWinnerRequest()
        {
            GameId = gameId
        };

        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        // game not returned


        var handler = new GetWebGameWinnerRequestHandler(
            _mockUserContextService.Object,
            _mockWebGameRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);
        await act.Should().ThrowAsync<NotFoundException>();

        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockWebGameRepository.Verify(x => x.GetById(gameId), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_UnauthorizedException_When_User_Is_Not_Player_Of_Game() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var game = new Entities.WebGame()
        {
            Id = gameId,
            HasEnded = true,
            EndGameType = GameEndReason.OutOfTime,
            WinnerColor = PieceColor.Black,
            EloGain = 10,
            WhitePlayer = new WebGamePlayer()
            {
                Name = "Username",
                UserId =Guid.NewGuid(), // not user player
            },
            BlackPlayer = new WebGamePlayer()
            {
                Name = "Opponent",
                UserId = Guid.NewGuid(), // not user player
            }
        };

        var request = new GetWebGameWinnerRequest()
        {
            GameId = gameId
        };

        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockWebGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);


        var handler = new GetWebGameWinnerRequestHandler(
            _mockUserContextService.Object,
            _mockWebGameRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);
        await act.Should().ThrowAsync<UnauthorizedException>();

        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockWebGameRepository.Verify(x => x.GetById(gameId), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_BadRequestException_When_Game_Is_Not_Ended() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var game = new Entities.WebGame()
        {
            Id = gameId,
            HasEnded = false, // game not ended
            EndGameType = null,
            WinnerColor = PieceColor.Black,
            EloGain = 10,
            WhitePlayer = new WebGamePlayer()
            {
                Name = "Username",
                UserId = userId,
            },
            BlackPlayer = new WebGamePlayer()
            {
                Name = "Opponent",
                UserId = Guid.NewGuid(),
            }
        };

        var request = new GetWebGameWinnerRequest()
        {
            GameId = gameId
        };

        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockWebGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);


        var handler = new GetWebGameWinnerRequestHandler(
            _mockUserContextService.Object,
            _mockWebGameRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);
        await act.Should().ThrowAsync<BadRequestException>();

        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockWebGameRepository.Verify(x => x.GetById(gameId), Times.Once);
    }
}
