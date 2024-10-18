
using chess.Application.Repositories;
using chess.Application.Requests.GameRequests.SendMessage;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.Game;

public class SendMessageRequestHandlerTests {

    private readonly Mock<IPlayerMessageRepository> _mockMessageRepository;
    private readonly Mock<IGameRepository> _mockGameRepository;
    private readonly Mock<IUserContextService> _mockUserContextService;

    public SendMessageRequestHandlerTests() {
        _mockMessageRepository = new Mock<IPlayerMessageRepository>();
        _mockGameRepository = new Mock<IGameRepository>();
        _mockUserContextService = new Mock<IUserContextService>();
    }

    [Fact]
    public async Task Handle_Should_Create_Message_On_Success() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var game = new Entities.Game()
        {
            Id = gameId,
            WhitePlayerRegistered = true,
            BlackPlayerRegistered = true,

            WhitePlayer = new Player() {
                Id = Guid.NewGuid(),
                Name = "Username",
                UserId = userId,
                GameId = gameId,
            },

            BlackPlayer = new Player() {
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
            _mockMessageRepository.Object,
            _mockGameRepository.Object,
            _mockUserContextService.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().NotThrowAsync();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockMessageRepository.Verify(x => x.Create(It.IsAny<PlayerMessage>()), Times.Once);
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
            _mockMessageRepository.Object,
            _mockGameRepository.Object,
            _mockUserContextService.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockMessageRepository.Verify(x => x.Create(It.IsAny<PlayerMessage>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_UnauthorizedException_When_User_Does_Not_Belong_To_Game() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var game = new Entities.Game()
        {
            Id = gameId,

            WhitePlayerRegistered = true,
            BlackPlayerRegistered = true,
            WhitePlayer = new Player()
            {
                Id = Guid.NewGuid(),
                Name = "Username",
                UserId = Guid.NewGuid(), // user is not player
                GameId = gameId,
            },
            BlackPlayer = new Player()
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
            _mockMessageRepository.Object,
            _mockGameRepository.Object,
            _mockUserContextService.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<UnauthorizedException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockMessageRepository.Verify(x => x.Create(It.IsAny<PlayerMessage>()), Times.Never);
    }
}
