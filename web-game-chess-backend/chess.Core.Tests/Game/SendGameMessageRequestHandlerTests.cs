
using chess.Application.Repositories;
using chess.Application.Requests.GameRequests.SendGameMessage;
using chess.Core.Entities;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.Game;

public class SendGameMessageRequestHandlerTests {

    private readonly Mock<IGameMessageRepository> _mockGameMessageRepository;
    private readonly Mock<IGameRepository> _mockGameRepository;

    public SendGameMessageRequestHandlerTests() {
        _mockGameMessageRepository = new Mock<IGameMessageRepository>();
        _mockGameRepository = new Mock<IGameRepository>();
    }

    [Fact]
    public async Task Handle_Should_Create_GameMessage_On_Success() {

        var gameId = Guid.NewGuid();

        var game = new Entities.Game()
        {
            Id = gameId,
            WhitePlayerRegistered = true,
            BlackPlayerRegistered = true,
        };

        var request = new SendGameMessageRequest()
        {
            GameId = gameId,
            Message = "Message",
        };


        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);


        var handler = new SendGameMessageRequestHandler(
            _mockGameMessageRepository.Object,
            _mockGameRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().NotThrowAsync();
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockGameMessageRepository.Verify(x => x.Create(It.IsAny<GameMessage>()), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_Game_Does_Not_Exist() {

        var gameId = Guid.NewGuid();

        var request = new SendGameMessageRequest()
        {
            GameId = gameId,
            Message = "Message",
        };


        // game not returned


        var handler = new SendGameMessageRequestHandler(
            _mockGameMessageRepository.Object,
            _mockGameRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockGameMessageRepository.Verify(x => x.Create(It.IsAny<GameMessage>()), Times.Never);
    }
}
