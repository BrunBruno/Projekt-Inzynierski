
using chess.Application.Repositories;
using chess.Application.Requests.FriendshipRequests.InviteFriend;
using chess.Application.Requests.GameRequests.MakeMove;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.Game;

public class MakeMoveRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IGameRepository> _mockGameRepository;
    private readonly Mock<IMoveRepository> _mockMoveRepository;

    public MakeMoveRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockGameRepository = new Mock<IGameRepository>();
        _mockMoveRepository = new Mock<IMoveRepository>();
    }

    [Fact]
    public async Task Handle_Creates_Move_On_Success() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var game = new Entities.Game()
        {
            Id = gameId,
            HasEnded = false,
            StartedAt = DateTime.UtcNow,
            GameTiming = new GameTiming()
            {
                Type = TimingTypes.Rapid,
                Seconds = 10 * 60,
                Increment = 0,
            },
            GameState = new GameState(),

            WhitePlayer = new Player() 
            { 
                Name = "Username",
                UserId = userId,
                TimeLeft = 10 * 60,
            },
            BlackPlayer = new Player()
            {
                Name = "Opponent",
                UserId = Guid.NewGuid(),
                TimeLeft = 10 * 60,
            },
            Moves = new List<Move>(),
        };
        

        var request = new MakeMoveRequest()
        {
            GameId = gameId,
            Position = "",
            Move = "Qd7",
            OldCoor = "d,1",
            NewCoor = "d,7",
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);


        var handler = new MakeMoveRequestHandler(
            _mockGameRepository.Object,
            _mockMoveRepository.Object,
            _mockUserContextService.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().NotThrowAsync();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockGameRepository.Verify(x => x.Update(game), Times.Once);
        _mockMoveRepository.Verify(x => x.Create(It.IsAny<Move>()), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_Game_Does_Not_Exist() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var request = new MakeMoveRequest()
        {
            GameId = gameId,
            Position = "",
            Move = "Qd7",
            OldCoor = "d,1",
            NewCoor = "d,7",
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);


        var handler = new MakeMoveRequestHandler(
            _mockGameRepository.Object,
            _mockMoveRepository.Object,
            _mockUserContextService.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockGameRepository.Verify(x => x.Update(It.IsAny<Entities.Game>()), Times.Never);
        _mockMoveRepository.Verify(x => x.Create(It.IsAny<Move>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_UnauthorizedException_When_User_Does_Not_belong_To_Game() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var game = new Entities.Game()
        {
            Id = gameId,
            HasEnded = false,
            StartedAt = DateTime.UtcNow,
            GameTiming = new GameTiming()
            {
                Type = TimingTypes.Rapid,
                Seconds = 10 * 60,
                Increment = 0,
            },
            GameState = new GameState(),

            WhitePlayer = new Player()
            {
                Name = "Other",
                UserId = Guid.NewGuid(),
                TimeLeft = 10 * 60,
            },
            BlackPlayer = new Player()
            {
                Name = "Opponent",
                UserId = Guid.NewGuid(),
                TimeLeft = 10 * 60,
            },
            Moves = new List<Move>(),
        };

        var request = new MakeMoveRequest()
        {
            GameId = gameId,
            Position = "",
            Move = "Qd7",
            OldCoor = "d,1",
            NewCoor = "d,7",
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);


        var handler = new MakeMoveRequestHandler(
            _mockGameRepository.Object,
            _mockMoveRepository.Object,
            _mockUserContextService.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<UnauthorizedException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockGameRepository.Verify(x => x.Update(It.IsAny<Entities.Game>()), Times.Never);
        _mockMoveRepository.Verify(x => x.Create(It.IsAny<Move>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_BadRequestException_When_Game_Has_Ended() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var game = new Entities.Game()
        {
            Id = gameId,
            HasEnded = true,
            StartedAt = DateTime.UtcNow,
            GameTiming = new GameTiming()
            {
                Type = TimingTypes.Rapid,
                Seconds = 10 * 60,
                Increment = 0,
            },
            GameState = new GameState(),

            WhitePlayer = new Player()
            {
                Name = "Username",
                UserId = userId,
                TimeLeft = 10 * 60,
            },
            BlackPlayer = new Player()
            {
                Name = "Opponent",
                UserId = Guid.NewGuid(),
                TimeLeft = 10 * 60,
            },
            Moves = new List<Move>(),
        };

        var request = new MakeMoveRequest()
        {
            GameId = gameId,
            Position = "",
            Move = "Qd7",
            OldCoor = "d,1",
            NewCoor = "d,7",
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);


        var handler = new MakeMoveRequestHandler(
            _mockGameRepository.Object,
            _mockMoveRepository.Object,
            _mockUserContextService.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<BadRequestException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockGameRepository.Verify(x => x.Update(game), Times.Never);
        _mockMoveRepository.Verify(x => x.Create(It.IsAny<Move>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_BadRequestException_When_Game_Was_Not_Started_Properly() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var game = new Entities.Game()
        {
            Id = gameId,
            HasEnded = false,
            GameTiming = new GameTiming()
            {
                Type = TimingTypes.Rapid,
                Seconds = 10 * 60,
                Increment = 0,
            },
            GameState = new GameState(),

            WhitePlayer = new Player()
            {
                Name = "Username",
                UserId = userId,
                TimeLeft = 10 * 60,
            },
            BlackPlayer = new Player()
            {
                Name = "Opponent",
                UserId = Guid.NewGuid(),
                TimeLeft = 10 * 60,
            },
            Moves = new List<Move>(),
        };

        var request = new MakeMoveRequest()
        {
            GameId = gameId,
            Position = "",
            Move = "Qd7",
            OldCoor = "d,1",
            NewCoor = "d,7",
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);


        var handler = new MakeMoveRequestHandler(
            _mockGameRepository.Object,
            _mockMoveRepository.Object,
            _mockUserContextService.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<BadRequestException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockGameRepository.Verify(x => x.Update(game), Times.Never);
        _mockMoveRepository.Verify(x => x.Create(It.IsAny<Move>()), Times.Never);
    }
}
