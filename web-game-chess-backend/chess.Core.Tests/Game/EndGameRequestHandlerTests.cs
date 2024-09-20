
using chess.Application.Repositories;
using chess.Application.Requests.GameRequests.EndGame;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.Game;

public class EndGameRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IUserRepository> _mockUserRepository;
    private readonly Mock<IGameRepository> _mockGameRepository;

    public EndGameRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockUserRepository = new Mock<IUserRepository>();
        _mockGameRepository = new Mock<IGameRepository>();
    }

    [Fact]
    public async Task Handle_Updates_Game_On_Success() {

        var userId = Guid.NewGuid();
        var opponentId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var user = new Entities.User() 
        { 
            Id = userId,
            Email = "user@test.com",
            Username = "Username",
            Elo = new UserElo(),
            Stats = new UserStats(),
        };
        var opponent = new Entities.User()
        {
            Id = opponentId,
            Email = "opponent@test.com",
            Username = "Opponent",
            Elo = new UserElo(),
            Stats = new UserStats(),
        };

        var game = new Entities.Game()
        {
            Id = gameId,
            HasEnded = false,
              WhitePlayerRegistered = true,
            BlackPlayerRegistered = true,

            WhitePlayer = new Player()
            {
                Id = Guid.NewGuid(),
                Name = "Username",
                UserId = userId,
                Color = PieceColor.White,
            },
            BlackPlayer = new Player()
            {
                Id = Guid.NewGuid(),
                Name = "Opponent",
                UserId = opponentId,
                Color = PieceColor.Black,
            }
        };

        var request = new EndGameRequest()
        {
            GameId = gameId,
            LoserColor = PieceColor.Black,
            EndGameType = GameEndReason.CheckMate,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);
        _mockUserRepository.Setup(x => x.GetById(game.WhitePlayer.UserId)).ReturnsAsync(user);
        _mockUserRepository.Setup(x => x.GetById(game.BlackPlayer.UserId)).ReturnsAsync(opponent);


        var handler = new EndGameRequestHandler(
            _mockGameRepository.Object,
            _mockUserContextService.Object,
            _mockUserRepository.Object
        );


        var result = await handler.Handle(request, CancellationToken.None);


        result.Should().NotBeNull();
        result.WinnerColor.Should().Be(PieceColor.White);

        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(game.WhitePlayer.UserId), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(game.BlackPlayer.UserId), Times.Once);
        _mockGameRepository.Verify(x => x.Update(game), Times.Once);
        _mockUserRepository.Verify(x => x.Update(user), Times.Once);
        _mockUserRepository.Verify(x => x.Update(opponent), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_BadRequestException_When_Result_Is_Incorrect() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var request = new EndGameRequest()
        {
            GameId = gameId,
            LoserColor = PieceColor.Black,
            EndGameType = GameEndReason.StaleMate,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);


        var handler = new EndGameRequestHandler(
            _mockGameRepository.Object,
            _mockUserContextService.Object,
            _mockUserRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<BadRequestException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Never);
        _mockUserRepository.Verify(x => x.GetById(It.IsAny<Guid>()), Times.Never);
        _mockUserRepository.Verify(x => x.GetById(It.IsAny<Guid>()), Times.Never);
        _mockGameRepository.Verify(x => x.Update(It.IsAny<Entities.Game>()), Times.Never);
        _mockUserRepository.Verify(x => x.Update(It.IsAny<Entities.User>()), Times.Never);
        _mockUserRepository.Verify(x => x.Update(It.IsAny<Entities.User>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_Game_Does_Not_Exist() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var request = new EndGameRequest()
        {
            GameId = gameId,
            LoserColor = PieceColor.Black,
            EndGameType = GameEndReason.CheckMate,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);


        var handler = new EndGameRequestHandler(
            _mockGameRepository.Object,
            _mockUserContextService.Object,
            _mockUserRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(It.IsAny<Guid>()), Times.Never);
        _mockUserRepository.Verify(x => x.GetById(It.IsAny<Guid>()), Times.Never);
        _mockGameRepository.Verify(x => x.Update(It.IsAny<Entities.Game>()), Times.Never);
        _mockUserRepository.Verify(x => x.Update(It.IsAny<Entities.User>()), Times.Never);
        _mockUserRepository.Verify(x => x.Update(It.IsAny<Entities.User>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_UnauthorizedException_When_User_Is_Not_Participant_Of_The_Game() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var game = new Entities.Game()
        {
            Id = gameId,
            HasEnded = false,

              WhitePlayerRegistered = true,
            BlackPlayerRegistered = true,

            WhitePlayer = new Player()
            {
                Id = Guid.NewGuid(),
                Name = "Other",
                UserId = Guid.NewGuid(),
                Color = PieceColor.White,
            },
            BlackPlayer = new Player()
            {
                Id = Guid.NewGuid(),
                Name = "Opponent",
                UserId = Guid.NewGuid(),
                Color = PieceColor.Black,
            }
        };

        var request = new EndGameRequest()
        {
            GameId = gameId,
            LoserColor = PieceColor.Black,
            EndGameType = GameEndReason.CheckMate,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);


        var handler = new EndGameRequestHandler(
            _mockGameRepository.Object,
            _mockUserContextService.Object,
            _mockUserRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<UnauthorizedException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(game.WhitePlayer.UserId), Times.Never);
        _mockUserRepository.Verify(x => x.GetById(game.BlackPlayer.UserId), Times.Never);
        _mockGameRepository.Verify(x => x.Update(It.IsAny<Entities.Game>()), Times.Never);
        _mockUserRepository.Verify(x => x.Update(It.IsAny<Entities.User>()), Times.Never);
        _mockUserRepository.Verify(x => x.Update(It.IsAny<Entities.User>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_User_Does_Not_Exist() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var game = new Entities.Game()
        {
            Id = gameId,
            HasEnded = false,

              WhitePlayerRegistered = true,
            BlackPlayerRegistered = true,
            WhitePlayer = new Player()
            {
                Id = Guid.NewGuid(),
                Name = "Username",
                UserId = userId,
                Color = PieceColor.White,
            },
            BlackPlayer = new Player()
            {
                Id = Guid.NewGuid(),
                Name = "Opponent",
                UserId = Guid.NewGuid(),
                Color = PieceColor.Black,
            }
        };

        var request = new EndGameRequest()
        {
            GameId = gameId,
            LoserColor = PieceColor.Black,
            EndGameType = GameEndReason.CheckMate,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);


        var handler = new EndGameRequestHandler(
            _mockGameRepository.Object,
            _mockUserContextService.Object,
            _mockUserRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(game.WhitePlayer.UserId), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(game.BlackPlayer.UserId), Times.Never);
        _mockGameRepository.Verify(x => x.Update(It.IsAny<Entities.Game>()), Times.Never);
        _mockUserRepository.Verify(x => x.Update(It.IsAny<Entities.User>()), Times.Never);
        _mockUserRepository.Verify(x => x.Update(It.IsAny<Entities.User>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_Opponent_Does_Not_Exist() {

        var userId = Guid.NewGuid();
        var opponentId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var user = new Entities.User()
        {
            Id = userId,
            Email = "user@test.com",
            Username = "Username",
            Elo = new UserElo(),
            Stats = new UserStats(),
        };

        var game = new Entities.Game()
        {
            Id = gameId,
            HasEnded = false,
              WhitePlayerRegistered = true,
            BlackPlayerRegistered = true,
            WhitePlayer = new Player()
            {
                Id = Guid.NewGuid(),
                Name = "Username",
                UserId = userId,
                Color = PieceColor.White,
            },
            BlackPlayer = new Player()
            {
                Id = Guid.NewGuid(),
                Name = "Opponent",
                UserId = opponentId,
                Color = PieceColor.Black,
            }
        };

        var request = new EndGameRequest()
        {
            GameId = gameId,
            LoserColor = PieceColor.Black,
            EndGameType = GameEndReason.CheckMate,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);
        _mockUserRepository.Setup(x => x.GetById(game.WhitePlayer.UserId)).ReturnsAsync(user);


        var handler = new EndGameRequestHandler(
            _mockGameRepository.Object,
            _mockUserContextService.Object,
            _mockUserRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(game.WhitePlayer.UserId), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(game.BlackPlayer.UserId), Times.Once);
        _mockGameRepository.Verify(x => x.Update(It.IsAny<Entities.Game>()), Times.Never);
        _mockUserRepository.Verify(x => x.Update(It.IsAny<Entities.User>()), Times.Never);
        _mockUserRepository.Verify(x => x.Update(It.IsAny<Entities.User>()), Times.Never);
    }
}
