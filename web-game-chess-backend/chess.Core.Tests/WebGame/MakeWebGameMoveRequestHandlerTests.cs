
using chess.Application.Repositories.WebGameRepositories;
using chess.Application.Requests.WebGameRequests.MakeWebGameMove;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.WebGame;

public class MakeWebGameMoveRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IWebGameRepository> _mockGameRepository;
    private readonly Mock<IWebGameMoveRepository> _mockMoveRepository;

    public MakeWebGameMoveRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockGameRepository = new Mock<IWebGameRepository>();
        _mockMoveRepository = new Mock<IWebGameMoveRepository>();
    }

    [Fact]
    public async Task Handle_Creates_Move_On_Success() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var game = new Entities.WebGame()
        {
            Id = gameId,
            HasEnded = false,
            StartedAt = DateTime.UtcNow,

            GameTiming = new WebGameTiming()
            {
                Type = TimingTypes.Rapid,
                Seconds = 10 * 60,
                Increment = 0,
            },

            CurrentState = new WebGameState(),

            WhitePlayer = new WebGamePlayer() 
            { 
                Name = "Username",
                UserId = userId,
                TimeLeft = 10 * 60,
            },

            BlackPlayer = new WebGamePlayer()
            {
                Name = "Opponent",
                UserId = Guid.NewGuid(),
                TimeLeft = 10 * 60,
            },

            Moves = new List<WebGameMove>(),
        };
        

        var request = new MakeWebGameMoveRequest()
        {
            GameId = gameId,
            Position = "",
            Move = "Qd7",
            FenMove = "",
            OldCoor = "d,1",
            NewCoor = "d,7",
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);


        var handler = new MakeWebGameMoveRequestHandler(
            _mockGameRepository.Object,
            _mockMoveRepository.Object,
            _mockUserContextService.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().NotThrowAsync();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockGameRepository.Verify(x => x.Update(game), Times.Once);
        _mockMoveRepository.Verify(x => x.Create(It.IsAny<WebGameMove>()), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_Game_Does_Not_Exist() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var request = new MakeWebGameMoveRequest()
        {
            GameId = gameId,
            Position = "",
            Move = "Qd7",
            FenMove = "",
            OldCoor = "d,1",
            NewCoor = "d,7",
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        // game not returned


        var handler = new MakeWebGameMoveRequestHandler(
            _mockGameRepository.Object,
            _mockMoveRepository.Object,
            _mockUserContextService.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockGameRepository.Verify(x => x.Update(It.IsAny<Entities.WebGame>()), Times.Never);
        _mockMoveRepository.Verify(x => x.Create(It.IsAny<WebGameMove>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_UnauthorizedException_When_User_Does_Not_belong_To_Game() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var game = new Entities.WebGame()
        {
            Id = gameId,
            HasEnded = false,
            StartedAt = DateTime.UtcNow,

            GameTiming = new WebGameTiming()
            {
                Type = TimingTypes.Rapid,
                Seconds = 10 * 60,
                Increment = 0,
            },
            CurrentState = new WebGameState(),

            WhitePlayer = new WebGamePlayer()
            {
                Name = "Other",
                UserId = Guid.NewGuid(), // user is not player
                TimeLeft = 10 * 60,
            },
            BlackPlayer = new WebGamePlayer()
            {
                Name = "Opponent",
                UserId = Guid.NewGuid(), // user is not player
                TimeLeft = 10 * 60,
            },
            Moves = new List<WebGameMove>(),
        };

        var request = new MakeWebGameMoveRequest()
        {
            GameId = gameId,
            Position = "",
            Move = "Qd7",
            FenMove = "",
            OldCoor = "d,1",
            NewCoor = "d,7",
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);


        var handler = new MakeWebGameMoveRequestHandler(
            _mockGameRepository.Object,
            _mockMoveRepository.Object,
            _mockUserContextService.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<UnauthorizedException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockGameRepository.Verify(x => x.Update(It.IsAny<Entities.WebGame>()), Times.Never);
        _mockMoveRepository.Verify(x => x.Create(It.IsAny<WebGameMove>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_BadRequestException_When_Game_Has_Ended() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var game = new Entities.WebGame()
        {
            Id = gameId,
            HasEnded = true, // has ended
            StartedAt = DateTime.UtcNow,

            GameTiming = new WebGameTiming()
            {
                Type = TimingTypes.Rapid,
                Seconds = 10 * 60,
                Increment = 0,
            },

            CurrentState = new WebGameState(),

            WhitePlayer = new WebGamePlayer()
            {
                Name = "Username",
                UserId = userId,
                TimeLeft = 10 * 60,
            },
            BlackPlayer = new WebGamePlayer()
            {
                Name = "Opponent",
                UserId = Guid.NewGuid(),
                TimeLeft = 10 * 60,
            },
            Moves = new List<WebGameMove>(),
        };

        var request = new MakeWebGameMoveRequest()
        {
            GameId = gameId,
            Position = "",
            Move = "Qd7",
            FenMove = "",
            OldCoor = "d,1",
            NewCoor = "d,7",
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);


        var handler = new MakeWebGameMoveRequestHandler(
            _mockGameRepository.Object,
            _mockMoveRepository.Object,
            _mockUserContextService.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<BadRequestException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockGameRepository.Verify(x => x.Update(game), Times.Never);
        _mockMoveRepository.Verify(x => x.Create(It.IsAny<WebGameMove>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_BadRequestException_When_Game_Was_Not_Started_Properly() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var game = new Entities.WebGame()
        {
            Id = gameId,
            HasEnded = false,
            // game not started

            GameTiming = new WebGameTiming()
            {
                Type = TimingTypes.Rapid,
                Seconds = 10 * 60,
                Increment = 0,
            },

            CurrentState = new WebGameState(),

            WhitePlayer = new WebGamePlayer()
            {
                Name = "Username",
                UserId = userId,
                TimeLeft = 10 * 60,
            },

            BlackPlayer = new WebGamePlayer()
            {
                Name = "Opponent",
                UserId = Guid.NewGuid(),
                TimeLeft = 10 * 60,
            },

            Moves = new List<WebGameMove>(),
        };

        var request = new MakeWebGameMoveRequest()
        {
            GameId = gameId,
            Position = "",
            Move = "Qd7",
            FenMove = "",
            OldCoor = "d,1",
            NewCoor = "d,7",
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);


        var handler = new MakeWebGameMoveRequestHandler(
            _mockGameRepository.Object,
            _mockMoveRepository.Object,
            _mockUserContextService.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<BadRequestException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockGameRepository.Verify(x => x.Update(game), Times.Never);
        _mockMoveRepository.Verify(x => x.Create(It.IsAny<WebGameMove>()), Times.Never);
    }
}
