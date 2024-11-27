
using chess.Application.Repositories.FriendshipRepositories;
using chess.Application.Repositories.WebGameRepositories;
using chess.Application.Repositories.UserRepositories;
using chess.Application.Requests.WebGameRequests.EndWebGame;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.WebGame;

public class EndWebGameRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IUserRepository> _mockUserRepository;
    private readonly Mock<IWebGameRepository> _mockGameRepository;
    private readonly Mock<IFriendshipRepository> _mockFriendshipRepository;

    public EndWebGameRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockUserRepository = new Mock<IUserRepository>();
        _mockGameRepository = new Mock<IWebGameRepository>();
        _mockFriendshipRepository = new Mock<IFriendshipRepository>();
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

        var game = new Entities.WebGame()
        {
            Id = gameId,
            HasEnded = false,

            WhitePlayer = new WebGamePlayer()
            {
                Id = Guid.NewGuid(),
                Name = "Username",
                UserId = userId,
                Color = PieceColor.White,
            },
            BlackPlayer = new WebGamePlayer()
            {
                Id = Guid.NewGuid(),
                Name = "Opponent",
                UserId = opponentId,
                Color = PieceColor.Black,
            }
        };

        var request = new EndWebGameRequest()
        {
            GameId = gameId,
            LoserColor = PieceColor.Black,
            EndGameType = GameEndReason.CheckMate,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);
        _mockUserRepository.Setup(x => x.GetById(game.WhitePlayer.UserId)).ReturnsAsync(user);
        _mockUserRepository.Setup(x => x.GetById(game.BlackPlayer.UserId)).ReturnsAsync(opponent);


        var handler = new EndWebGameRequestHandler(
            _mockGameRepository.Object,
            _mockUserContextService.Object,
            _mockUserRepository.Object,
            _mockFriendshipRepository.Object
        );


        var act = () => handler.Handle(request, CancellationToken.None);
        await act.Should().NotThrowAsync(); 


        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(game.WhitePlayer.UserId), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(game.BlackPlayer.UserId), Times.Once);
        _mockFriendshipRepository.Verify(x => x.GetByUsersIds(userId, opponentId), Times.Never);
        _mockGameRepository.Verify(x => x.Update(game), Times.Once);
        _mockUserRepository.Verify(x => x.Update(user), Times.Once);
        _mockUserRepository.Verify(x => x.Update(opponent), Times.Once);
    }

    [Fact]
    public async Task Handle_Updates_Game_And_Friendship_On_Success() {

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

        var game = new Entities.WebGame()
        {
            Id = gameId,
            HasEnded = false,
            IsPrivate = true, // game private
            TimingType =TimingTypes.Rapid,

            WhitePlayer = new WebGamePlayer()
            {
                Id = Guid.NewGuid(),
                Name = "Username",
                UserId = userId,
                Color = PieceColor.White,
            },
            BlackPlayer = new WebGamePlayer()
            {
                Id = Guid.NewGuid(),
                Name = "Opponent",
                UserId = opponentId,
                Color = PieceColor.Black,
            }
        };

        var friendship = new Entities.Friendship()
        {
            RequestorId = userId,
            ReceiverId = opponentId,
        };

        var request = new EndWebGameRequest()
        {
            GameId = gameId,
            LoserColor = PieceColor.Black,
            EndGameType = GameEndReason.CheckMate,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);
        _mockUserRepository.Setup(x => x.GetById(game.WhitePlayer.UserId)).ReturnsAsync(user);
        _mockUserRepository.Setup(x => x.GetById(game.BlackPlayer.UserId)).ReturnsAsync(opponent);
        _mockFriendshipRepository.Setup(x => x.GetByUsersIds(userId, opponentId)).ReturnsAsync(friendship);


        var handler = new EndWebGameRequestHandler(
            _mockGameRepository.Object,
            _mockUserContextService.Object,
            _mockUserRepository.Object,
            _mockFriendshipRepository.Object
        );


        var act = () => handler.Handle(request, CancellationToken.None);
        await act.Should().NotThrowAsync();

        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(game.WhitePlayer.UserId), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(game.BlackPlayer.UserId), Times.Once);
        _mockFriendshipRepository.Verify(x => x.GetByUsersIds(userId, opponentId), Times.Once);
        _mockGameRepository.Verify(x => x.Update(game), Times.Once);
        _mockUserRepository.Verify(x => x.Update(user), Times.Once);
        _mockUserRepository.Verify(x => x.Update(opponent), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_BadRequestException_When_Result_Is_Incorrect() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var request = new EndWebGameRequest()
        {
            GameId = gameId,
            LoserColor = PieceColor.Black,
            EndGameType = GameEndReason.StaleMate,
            // winner is set but reason is set for draw
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);


        var handler = new EndWebGameRequestHandler(
            _mockGameRepository.Object,
            _mockUserContextService.Object,
            _mockUserRepository.Object,
            _mockFriendshipRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<BadRequestException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Never);
        _mockUserRepository.Verify(x => x.GetById(It.IsAny<Guid>()), Times.Never);
        _mockFriendshipRepository.Verify(x => x.GetByUsersIds(It.IsAny<Guid>(), It.IsAny<Guid>()), Times.Never);
        _mockGameRepository.Verify(x => x.Update(It.IsAny<Entities.WebGame>()), Times.Never);
        _mockUserRepository.Verify(x => x.Update(It.IsAny<Entities.User>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_Game_Does_Not_Exist() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var request = new EndWebGameRequest()
        {
            GameId = gameId,
            LoserColor = PieceColor.Black,
            EndGameType = GameEndReason.CheckMate,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        // game not returned


        var handler = new EndWebGameRequestHandler(
            _mockGameRepository.Object,
            _mockUserContextService.Object,
            _mockUserRepository.Object,
            _mockFriendshipRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(It.IsAny<Guid>()), Times.Never);
        _mockFriendshipRepository.Verify(x => x.GetByUsersIds(It.IsAny<Guid>(), It.IsAny<Guid>()), Times.Never);
        _mockGameRepository.Verify(x => x.Update(It.IsAny<Entities.WebGame>()), Times.Never);
        _mockUserRepository.Verify(x => x.Update(It.IsAny<Entities.User>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_UnauthorizedException_When_User_Is_Not_Participant_Of_The_Game() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var game = new Entities.WebGame()
        {
            Id = gameId,
            HasEnded = false,
            TimingType = TimingTypes.Rapid,

            WhitePlayer = new WebGamePlayer()
            {
                Id = Guid.NewGuid(),
                Name = "Other",
                UserId = Guid.NewGuid(), // user is not a player
                Color = PieceColor.White,
            },
            BlackPlayer = new WebGamePlayer()
            {
                Id = Guid.NewGuid(),
                Name = "Opponent",
                UserId = Guid.NewGuid(), // user is not a player
                Color = PieceColor.Black,
            }
        };

        var request = new EndWebGameRequest()
        {
            GameId = gameId,
            LoserColor = PieceColor.Black,
            EndGameType = GameEndReason.CheckMate,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);


        var handler = new EndWebGameRequestHandler(
            _mockGameRepository.Object,
            _mockUserContextService.Object,
            _mockUserRepository.Object,
            _mockFriendshipRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<UnauthorizedException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(It.IsAny<Guid>()), Times.Never);
        _mockFriendshipRepository.Verify(x => x.GetByUsersIds(It.IsAny<Guid>(), It.IsAny<Guid>()), Times.Never);
        _mockGameRepository.Verify(x => x.Update(It.IsAny<Entities.WebGame>()), Times.Never);
        _mockUserRepository.Verify(x => x.Update(It.IsAny<Entities.User>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_User_Does_Not_Exist() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var game = new Entities.WebGame()
        {
            Id = gameId,
            HasEnded = false,
            TimingType = TimingTypes.Rapid,

            WhitePlayer = new WebGamePlayer()
            {
                Id = Guid.NewGuid(),
                Name = "Username",
                UserId = userId,
                Color = PieceColor.White,
            },
            BlackPlayer = new WebGamePlayer()
            {
                Id = Guid.NewGuid(),
                Name = "Opponent",
                UserId = Guid.NewGuid(),
                Color = PieceColor.Black,
            }
        };

        var request = new EndWebGameRequest()
        {
            GameId = gameId,
            LoserColor = PieceColor.Black,
            EndGameType = GameEndReason.CheckMate,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);
        // user not returned


        var handler = new EndWebGameRequestHandler(
            _mockGameRepository.Object,
            _mockUserContextService.Object,
            _mockUserRepository.Object,
            _mockFriendshipRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(game.WhitePlayer.UserId), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(game.BlackPlayer.UserId), Times.Never);
        _mockFriendshipRepository.Verify(x => x.GetByUsersIds(It.IsAny<Guid>(), It.IsAny<Guid>()), Times.Never);
        _mockGameRepository.Verify(x => x.Update(It.IsAny<Entities.WebGame>()), Times.Never);
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

        var game = new Entities.WebGame()
        {
            Id = gameId,
            HasEnded = false,
            TimingType = TimingTypes.Rapid,

            WhitePlayer = new WebGamePlayer()
            {
                Id = Guid.NewGuid(),
                Name = "Username",
                UserId = userId,
                Color = PieceColor.White,
            },
            BlackPlayer = new WebGamePlayer()
            {
                Id = Guid.NewGuid(),
                Name = "Opponent",
                UserId = opponentId,
                Color = PieceColor.Black,
            }
        };

        var request = new EndWebGameRequest()
        {
            GameId = gameId,
            LoserColor = PieceColor.Black,
            EndGameType = GameEndReason.CheckMate,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);
        _mockUserRepository.Setup(x => x.GetById(game.WhitePlayer.UserId)).ReturnsAsync(user);


        var handler = new EndWebGameRequestHandler(
            _mockGameRepository.Object,
            _mockUserContextService.Object,
            _mockUserRepository.Object,
            _mockFriendshipRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(game.WhitePlayer.UserId), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(game.BlackPlayer.UserId), Times.Once);
        _mockFriendshipRepository.Verify(x => x.GetByUsersIds(It.IsAny<Guid>(), It.IsAny<Guid>()), Times.Never);
        _mockGameRepository.Verify(x => x.Update(It.IsAny<Entities.WebGame>()), Times.Never);
        _mockUserRepository.Verify(x => x.Update(It.IsAny<Entities.User>()), Times.Never);
    }
}
