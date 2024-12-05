
using chess.Application.Repositories.EngineGameRepositories;
using chess.Application.Requests.EngineRequests.GetAllEngineGameMessages;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.EngineGame;

public class GetAllEngineGameMessagesRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IEngineGameRepository> _mockEngineGameRepository;
    private readonly Mock<IEngineGameMessageRepository> _mockEngineGameMessageRepository;

    public GetAllEngineGameMessagesRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockEngineGameRepository = new Mock<IEngineGameRepository>();
        _mockEngineGameMessageRepository = new Mock<IEngineGameMessageRepository>();
    }

    [Fact]
    public async Task Handle_Returns_List_Of_Messages_On_Success() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var game = new Entities.EngineGame() { 
            Id = gameId,
            Player = new EngineGamePlayer()
            {
                Name = "Username",
                UserId = userId,
            },
            Messages = ReturnExampleMessages(),
        };

        var request = new GetAllEngineGameMessagesRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockEngineGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);
        _mockEngineGameMessageRepository.Setup(x => x.GetAllForGame(gameId)).ReturnsAsync(game.Messages);


        var handler = new GetAllEngineGameMessagesRequestHandler(
            _mockUserContextService.Object,
            _mockEngineGameRepository.Object,
            _mockEngineGameMessageRepository.Object
        );

        var result = await handler.Handle(request, CancellationToken.None);
        result.Count.Should().Be(10);

        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockEngineGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockEngineGameMessageRepository.Verify(x => x.GetAllForGame(gameId), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_Game_Not_Exist() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var request = new GetAllEngineGameMessagesRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        // game not returned


        var handler = new GetAllEngineGameMessagesRequestHandler(
            _mockUserContextService.Object,
            _mockEngineGameRepository.Object,
            _mockEngineGameMessageRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);
        await act.Should().ThrowAsync<NotFoundException>();

        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockEngineGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockEngineGameMessageRepository.Verify(x => x.GetAllForGame(It.IsAny<Guid>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throw_UnauthorizedException_When_User_Is_Not_Player_Of_Game() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var game = new Entities.EngineGame()
        {
            Id = gameId,
            Player = new EngineGamePlayer()
            {
                Name = "Username",
                UserId = Guid.NewGuid(), // not user payer
            },
            Messages = ReturnExampleMessages(),
        };

        var request = new GetAllEngineGameMessagesRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockEngineGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);
        _mockEngineGameMessageRepository.Setup(x => x.GetAllForGame(gameId)).ReturnsAsync(game.Messages);


        var handler = new GetAllEngineGameMessagesRequestHandler(
            _mockUserContextService.Object,
            _mockEngineGameRepository.Object,
            _mockEngineGameMessageRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);
        await act.Should().ThrowAsync<UnauthorizedException>();

        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockEngineGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockEngineGameMessageRepository.Verify(x => x.GetAllForGame(It.IsAny<Guid>()), Times.Never);
    }

    private static List<EngineGameMessage> ReturnExampleMessages() {

        var messages = new List<EngineGameMessage>();

        for (int i = 0; i < 10; i++) {
            messages.Add(new EngineGameMessage()
            {
                Content = "message"
            });
        }

        return messages;
    }
}
