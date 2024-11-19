
using chess.Application.Repositories.WebGameRepositories;
using chess.Application.Requests.WebGameRequests.SendWebGameMessage;
using chess.Core.Entities;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.WebGame;

public class SendWebGameMessageRequestHandlerTests {

    private readonly Mock<IWebGameMessageRepository> _mockGameMessageRepository;
    private readonly Mock<IWebGameRepository> _mockGameRepository;

    public SendWebGameMessageRequestHandlerTests() {
        _mockGameMessageRepository = new Mock<IWebGameMessageRepository>();
        _mockGameRepository = new Mock<IWebGameRepository>();
    }

    [Fact]
    public async Task Handle_Should_Create_GameMessage_On_Success() {

        var gameId = Guid.NewGuid();

        var game = new Entities.WebGame()
        {
            Id = gameId,
        };

        var request = new SendWebGameMessageRequest()
        {
            GameId = gameId,
            Message = "Message",
        };


        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);


        var handler = new SendWebGameMessageRequestHandler(
            _mockGameMessageRepository.Object,
            _mockGameRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().NotThrowAsync();
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockGameMessageRepository.Verify(x => x.Create(It.IsAny<WebGameMessage>()), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_Game_Does_Not_Exist() {

        var gameId = Guid.NewGuid();

        var request = new SendWebGameMessageRequest()
        {
            GameId = gameId,
            Message = "Message",
        };


        // game not returned


        var handler = new SendWebGameMessageRequestHandler(
            _mockGameMessageRepository.Object,
            _mockGameRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockGameMessageRepository.Verify(x => x.Create(It.IsAny<WebGameMessage>()), Times.Never);
    }
}
