
using chess.Application.Repositories;
using chess.Application.Requests.GameRequests.GetAllMessages;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.Game;

public class GetAllMessagesRequestHandlerTests {

    private readonly Mock<IMessageRepository> _mockMessageRepository;
    private readonly Mock<IGameRepository> _mockGameRepository;
    private readonly Mock<IUserContextService> _mockUserContextService;

    public GetAllMessagesRequestHandlerTests() {
        _mockMessageRepository = new Mock<IMessageRepository>();
        _mockGameRepository = new Mock<IGameRepository>();
        _mockUserContextService = new Mock<IUserContextService>();
    }

    [Fact]
    public async Task Handle_Returns_List_Of_Messages_On_Success() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();
        var whitePlayerId = Guid.NewGuid();
        var blackPlayerId = Guid.NewGuid();

        var game = new Entities.Game()
        {
            Id = gameId,
            WhitePlayerId = whitePlayerId,
            WhitePlayer = new Player() { 
                Id = whitePlayerId,
                Name = "Username",
                UserId = userId,
                GameId = gameId,
            },
            BlackPlayerId = blackPlayerId,
            BlackPlayer = new Player() { 
                Id = blackPlayerId,
                Name = "Other",
                UserId = Guid.NewGuid(),
                GameId = gameId,
            }
        };

        var messages = returnExampleMessages(game.WhitePlayer, game.BlackPlayer);


        var request = new GetAllMessagesRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);
        _mockMessageRepository.Setup(x => x.GetAllByPlayers(game.WhitePlayerId, game.BlackPlayerId)).ReturnsAsync(messages);


        var handler = new GetAllMessagesRequestHandler(
            _mockGameRepository.Object,
            _mockMessageRepository.Object,
            _mockUserContextService.Object
        );

        var result = await handler.Handle(request, CancellationToken.None);

        
        result.Count.Should().Be(10);


        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockMessageRepository.Verify(x => x.GetAllByPlayers(game.WhitePlayerId, game.BlackPlayerId), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_Game_Does_Not_Exist() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var request = new GetAllMessagesRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);


        var handler = new GetAllMessagesRequestHandler(
            _mockGameRepository.Object,
            _mockMessageRepository.Object,
            _mockUserContextService.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockMessageRepository.Verify(x => x.GetAllByPlayers(It.IsAny<Guid>(), It.IsAny<Guid>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_UnauthorizedException_When_User_Does_Not_Belong_To_Game() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();
        var whitePlayerId = Guid.NewGuid();
        var blackPlayerId = Guid.NewGuid();

        var game = new Entities.Game()
        {
            Id = gameId,
            WhitePlayerId = whitePlayerId,
            WhitePlayer = new Player()
            {
                Id = whitePlayerId,
                Name = "Username",
                UserId = Guid.NewGuid(),
                GameId = gameId,
            },
            BlackPlayerId = blackPlayerId,
            BlackPlayer = new Player()
            {
                Id = blackPlayerId,
                Name = "Other",
                UserId = Guid.NewGuid(),
                GameId = gameId,
            }
        };

        var request = new GetAllMessagesRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);


        var handler = new GetAllMessagesRequestHandler(
            _mockGameRepository.Object,
            _mockMessageRepository.Object,
            _mockUserContextService.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<UnauthorizedException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockMessageRepository.Verify(x => x.GetAllByPlayers(game.WhitePlayerId, game.BlackPlayerId), Times.Never);
    }

    private List<Message> returnExampleMessages(Player whitePlayer, Player blackPlayer) {

        var messages = new List<Message>();

        for(int i = 0; i < 10; i++) {
            messages.Add(new Message() { 
                Id = Guid.NewGuid(),
                Content = "Message",
                PlayerId = i % 2 == 0 ? whitePlayer.Id : blackPlayer.Id,
                Player = i % 2 == 0 ? whitePlayer : blackPlayer,
            });
        }

        return messages;
    }

}
