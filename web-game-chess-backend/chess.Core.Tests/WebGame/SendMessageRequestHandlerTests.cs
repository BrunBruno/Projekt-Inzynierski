using chess.Application.Repositories.WebGameRepositories;
using chess.Application.Requests.WebGameRequests.SendMessage;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.WebGame;

public class SendMessageRequestHandlerTests {

    private readonly Mock<IWebGamePlayerMessageRepository> _mockPlayerMessageRepository;
    private readonly Mock<IWebGameRepository> _mockGameRepository;
    private readonly Mock<IUserContextService> _mockUserContextService;

    public SendMessageRequestHandlerTests() {
        _mockPlayerMessageRepository = new Mock<IWebGamePlayerMessageRepository>();
        _mockGameRepository = new Mock<IWebGameRepository>();
        _mockUserContextService = new Mock<IUserContextService>();
    }

    [Fact]
    public async Task Handle_Should_Create_PlayerMessage_On_Success() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var game = new Entities.WebGame()
        {
            Id = gameId,
            WhitePlayerRegistered = true,
            BlackPlayerRegistered = true,

            WhitePlayer = new WebGamePlayer() {
                Id = Guid.NewGuid(),
                Name = "Username",
                UserId = userId,
                GameId = gameId,
            },

            BlackPlayer = new WebGamePlayer() {
                Id = Guid.NewGuid(),
                Name = "Other",
                UserId = Guid.NewGuid(),
                GameId = gameId,
            },
        };

        var request = new SendMessageRequest()
        {
            GameId = gameId,
            Message = "Message",
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);


        var handler = new SendMessageRequestHandler(
            _mockPlayerMessageRepository.Object,
            _mockGameRepository.Object,
            _mockUserContextService.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().NotThrowAsync();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockPlayerMessageRepository.Verify(x => x.Create(It.IsAny<WebGamePlayerMessage>()), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_Game_Does_Not_Exist() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var request = new SendMessageRequest()
        {
            GameId = gameId,
            Message = "Message",
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        // game not returned


        var handler = new SendMessageRequestHandler(
            _mockPlayerMessageRepository.Object,
            _mockGameRepository.Object,
            _mockUserContextService.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockPlayerMessageRepository.Verify(x => x.Create(It.IsAny<WebGamePlayerMessage>()), Times.Never);
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
                Id = Guid.NewGuid(),
                Name = "Username",
                UserId = Guid.NewGuid(), // user is not player
                GameId = gameId,
            },
            BlackPlayer = new WebGamePlayer()
            {
                Id = Guid.NewGuid(),
                Name = "Other",
                UserId = Guid.NewGuid(), // user is not player
                GameId = gameId,
            },
        };

        var request = new SendMessageRequest()
        {
            GameId = gameId,
            Message = "Message",
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);


        var handler = new SendMessageRequestHandler(
            _mockPlayerMessageRepository.Object,
            _mockGameRepository.Object,
            _mockUserContextService.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<UnauthorizedException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockPlayerMessageRepository.Verify(x => x.Create(It.IsAny<WebGamePlayerMessage>()), Times.Never);
    }
}
