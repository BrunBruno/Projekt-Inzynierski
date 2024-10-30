using chess.Application.Repositories.WebGameRepositories;
using chess.Application.Requests.WebGameRequests.RemoveDrawMessage;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.WebGame;

public class RemoveDrawMessageRequestHandlerTests {

    private readonly Mock<IWebGameMessageRepository> _mockGameMessageRepository;
    private readonly Mock<IWebGameRepository> _mockGameRepository;
    private readonly Mock<IUserContextService> _mockUserContextService;

    public RemoveDrawMessageRequestHandlerTests() {
        _mockGameMessageRepository = new Mock<IWebGameMessageRepository>();
        _mockGameRepository = new Mock<IWebGameRepository>();
        _mockUserContextService = new Mock<IUserContextService>();
    }

    [Fact]
    public async Task Handle_Should_Remove_DrawMessage_On_Success() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var drawMessage = new WebGameMessage()
        {
            Content = "Draw offer",
            Type = MessageType.DrawAction,
        };

        var game = new Entities.WebGame()
        {
            Id = gameId,
            WhitePlayerRegistered = true,
            BlackPlayerRegistered = true,

            WhitePlayerId = Guid.NewGuid(),
            WhitePlayer = new WebGamePlayer()
            {
                Name = "Username",
                UserId = userId,
                GameId = gameId,

            },

            BlackPlayerId = Guid.NewGuid(),
            BlackPlayer = new WebGamePlayer()
            {
                Name = "Other",
                UserId = Guid.NewGuid(),
                GameId = gameId,
            },

            Messages = new List<WebGameMessage>() {
                drawMessage
            },
        };

        var request = new RemoveDrawMessageRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);
        _mockGameMessageRepository.Setup(x => x.GetDrawMessage(gameId)).ReturnsAsync(drawMessage);


        var handler = new RemoveDrawMessageRequestHandler(
            _mockGameMessageRepository.Object,
            _mockGameRepository.Object,
            _mockUserContextService.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().NotThrowAsync();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockGameMessageRepository.Verify(x => x.GetDrawMessage(gameId), Times.Once);
        _mockGameMessageRepository.Verify(x => x.Delete(drawMessage), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_Game_Does_Not_Exist() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var request = new RemoveDrawMessageRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        // game not returned


        var handler = new RemoveDrawMessageRequestHandler(
            _mockGameMessageRepository.Object,
            _mockGameRepository.Object,
            _mockUserContextService.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockGameMessageRepository.Verify(x => x.GetDrawMessage(It.IsAny<Guid>()), Times.Never);
        _mockGameMessageRepository.Verify(x => x.Delete(It.IsAny<WebGameMessage>()), Times.Never);
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

            WhitePlayerId = Guid.NewGuid(),
            WhitePlayer = new WebGamePlayer()
            {
                Name = "Friend",
                UserId = Guid.NewGuid(), // user is not plyer
                GameId = gameId,
            },

            BlackPlayerId = Guid.NewGuid(),
            BlackPlayer = new WebGamePlayer()
            {
                Name = "Other",
                UserId = Guid.NewGuid(), // user is not plyer
                GameId = gameId,
            },
        };

        var request = new RemoveDrawMessageRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);

        var handler = new RemoveDrawMessageRequestHandler(
            _mockGameMessageRepository.Object,
            _mockGameRepository.Object,
            _mockUserContextService.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<UnauthorizedException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockGameMessageRepository.Verify(x => x.GetDrawMessage(It.IsAny<Guid>()), Times.Never);
        _mockGameMessageRepository.Verify(x => x.Delete(It.IsAny<WebGameMessage>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_BadRequestException_When_DrawMessage_Not_Exist() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var game = new Entities.WebGame()
        {
            Id = gameId,

            WhitePlayerRegistered = true,
            BlackPlayerRegistered = true,
            WhitePlayerId = Guid.NewGuid(),
            WhitePlayer = new WebGamePlayer()
            {
                Name = "Username",
                UserId = userId,
                GameId = gameId,
            },
            BlackPlayerId = Guid.NewGuid(),
            BlackPlayer = new WebGamePlayer()
            {
                Name = "Other",
                UserId = Guid.NewGuid(),
                GameId = gameId,
            },
        };

        var request = new RemoveDrawMessageRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);
        // draw message not returned

        var handler = new RemoveDrawMessageRequestHandler(
            _mockGameMessageRepository.Object,
            _mockGameRepository.Object,
            _mockUserContextService.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockGameMessageRepository.Verify(x => x.GetDrawMessage(gameId), Times.Once);
        _mockGameMessageRepository.Verify(x => x.Delete(It.IsAny<WebGameMessage>()), Times.Never);
    }
}
