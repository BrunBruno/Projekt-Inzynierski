
using chess.Application.Repositories.WebGameRepositories;
using chess.Application.Requests.WebGameRequests.AddPlayerToWebGame;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.WebGame;

public class AddPlayerToWebGameRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IWebGameRepository> _mockWebGameRepository;

    public AddPlayerToWebGameRequestHandlerTests() { 
        _mockUserContextService = new Mock<IUserContextService>();
        _mockWebGameRepository = new Mock<IWebGameRepository>();
    }

    [Fact]
    public async Task Handle_Not_Throws_Error_On_Success() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var game = new Entities.WebGame() { 
            Id = gameId,
            WhitePlayer = new WebGamePlayer() { 
                Name = "User",
                UserId = userId ,
            },
            BlackPlayer = new WebGamePlayer() { 
                Name = "Opponent",
                UserId = Guid.NewGuid(),
            },
        };

        var request = new AddPlayerToWebGameRequest() { 
            GameId = gameId 
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockWebGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game); 


        var handler = new AddPlayerToWebGameRequestHandler(
            _mockWebGameRepository.Object,
            _mockUserContextService.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);

        await act.Should().NotThrowAsync();

        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockWebGameRepository.Verify(x => x.GetById(gameId), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_Game_Not_Exists() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();


        var request = new AddPlayerToWebGameRequest()
        {
            GameId = gameId
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        // game not returned


        var handler = new AddPlayerToWebGameRequestHandler(
            _mockWebGameRepository.Object,
            _mockUserContextService.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);

        await act.Should().ThrowAsync<NotFoundException>();

        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockWebGameRepository.Verify(x => x.GetById(gameId), Times.Once);
    }

    [Fact]
    public async Task Handle_Throw_UnauthorizedException_When_User_Is_Not_Player_Of_Game() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var game = new Entities.WebGame()
        {
            Id = gameId,
            WhitePlayer = new WebGamePlayer()
            {
                Name = "User",
                UserId = Guid.NewGuid(), // no user player
            },
            BlackPlayer = new WebGamePlayer()
            {
                Name = "Opponent",
                UserId = Guid.NewGuid(), // no user player
            },
        };

        var request = new AddPlayerToWebGameRequest()
        {
            GameId = gameId
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockWebGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);


        var handler = new AddPlayerToWebGameRequestHandler(
            _mockWebGameRepository.Object,
            _mockUserContextService.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);

        await act.Should().ThrowAsync<UnauthorizedException>();

        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockWebGameRepository.Verify(x => x.GetById(gameId), Times.Once);
    }
}
