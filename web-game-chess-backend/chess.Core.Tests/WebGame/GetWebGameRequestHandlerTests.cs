
using chess.Application.Repositories.FriendshipRepositories;
using chess.Application.Repositories.UserRepositories;
using chess.Application.Repositories.WebGameRepositories;
using chess.Application.Requests.WebGameRequests.GetWebGame;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.WebGame;

public class GetWebGameRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IWebGameRepository> _mockGameRepository;
    private readonly Mock<IUserSettingsRepository> _mockUserSettingsRepository;
    private readonly Mock<IWebGameMessageRepository> _mockWebGameMessageRepository;
    private readonly Mock<IFriendshipRepository> _mockFriendshipRepository;

    public GetWebGameRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockGameRepository = new Mock<IWebGameRepository>();
        _mockUserSettingsRepository = new Mock<IUserSettingsRepository>();
        _mockWebGameMessageRepository = new Mock<IWebGameMessageRepository>();
        _mockFriendshipRepository = new Mock<IFriendshipRepository>();
    }


    [Fact]
    public async Task Handle_Returns_Game_On_Success() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var move = new WebGameMove()
        {
            DoneMove = "",
            FenMove = "",
            Position = "",
            OldCoordinates = "",
            NewCoordinates = "",
        };

        var game = new Entities.WebGame()
        {
            Id = gameId,
            StartedAt = DateTime.UtcNow,

            WhitePlayer = new WebGamePlayer()
            {
                Name = "Username",
                UserId = userId,
                User = new Entities.User() { 
                    Email = "user@test.com",
                    Username = "User"
                }
            },

            BlackPlayer = new WebGamePlayer()
            {
                Name = "Opponent",
                UserId = Guid.NewGuid(),
                User = new Entities.User()
                {
                    Email = "opponent@test.com",
                    Username = "Opponent"
                }
            },

            Moves = new List<WebGameMove>() { move, move, move },
            CurrentState = new WebGameState(),
        };

        var request = new GetWebGameRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);


        var handler = new GetWebGameRequestHandler(
            _mockGameRepository.Object,
            _mockUserContextService.Object,
            _mockUserSettingsRepository.Object,
            _mockWebGameMessageRepository.Object,
            _mockFriendshipRepository.Object
        );

        var result = await handler.Handle(request, CancellationToken.None);


        result.Should().NotBeNull();
        result.WhitePlayer.Should().NotBeNull();
        result.BlackPlayer.Should().NotBeNull();
        result.Moves.Count.Should().Be(3);  

        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockGameRepository.Verify(x => x.Update(game), Times.Never);
    }

    [Fact]
    public async Task Handle_Returns_Game_And_Updates_Start_On_Success() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var move = new WebGameMove() { 
            DoneMove = "",
            FenMove = "",
            Position = "",
            OldCoordinates = "",
            NewCoordinates = "",
        };

        var game = new Entities.WebGame()
        {
            Id = gameId,
            // game not started

            WhitePlayer = new WebGamePlayer()
            {
                Name = "Username",
                UserId = userId,
                User = new Entities.User()
                {
                    Email = "user@test.com",
                    Username = "User"
                }
            },

            BlackPlayer = new WebGamePlayer()
            {
                Name = "Opponent",
                UserId = Guid.NewGuid(),
                User = new Entities.User()
                {
                    Email = "opponent@test.com",
                    Username = "Opponent"
                }
            },

            Moves = new List<WebGameMove>() { move, move, move },
            CurrentState = new WebGameState(),
        };

        var request = new GetWebGameRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);


        var handler = new GetWebGameRequestHandler(
            _mockGameRepository.Object,
            _mockUserContextService.Object,
            _mockUserSettingsRepository.Object,
            _mockWebGameMessageRepository.Object,
            _mockFriendshipRepository.Object
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

        var request = new GetWebGameRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);


        var handler = new GetWebGameRequestHandler(
            _mockGameRepository.Object,
            _mockUserContextService.Object,
            _mockUserSettingsRepository.Object,
            _mockWebGameMessageRepository.Object,
            _mockFriendshipRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockGameRepository.Verify(x => x.Update(It.IsAny<Entities.WebGame>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_UnauthorizedException_When_User_Does_Not_Belong_To_Game() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var move = new WebGameMove()
        {
            DoneMove = "",
            FenMove = "",
            Position = "",
            OldCoordinates = "",
            NewCoordinates = "",
        };

        var game = new Entities.WebGame()
        {
            Id = gameId,

            WhitePlayer = new WebGamePlayer()
            {
                Name = "Other",
                UserId = Guid.NewGuid(),
            },
            BlackPlayer = new WebGamePlayer()
            {
                Name = "Opponent",
                UserId = Guid.NewGuid(),
            },
            Moves = new List<WebGameMove>() { move, move, move },
            CurrentState = new WebGameState(),
        };

        var request = new GetWebGameRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);


        var handler = new GetWebGameRequestHandler(
            _mockGameRepository.Object,
            _mockUserContextService.Object,
            _mockUserSettingsRepository.Object,
            _mockWebGameMessageRepository.Object,
            _mockFriendshipRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<UnauthorizedException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockGameRepository.Verify(x => x.Update(game), Times.Never);
    }
}
