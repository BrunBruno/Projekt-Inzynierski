﻿
using chess.Application.Repositories;
using chess.Application.Requests.GameRequests.GetAllMessages;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.Game;

public class GetAllMessagesRequestHandlerTests {

    private readonly Mock<IPlayerMessageRepository> _mockPlayerMessageRepository;
    private readonly Mock<IGameMessageRepository> _mockGameMessageRepository;
    private readonly Mock<IGameRepository> _mockGameRepository;
    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IUserImageRepository> _mockUserImageRepository;

    public GetAllMessagesRequestHandlerTests() {
        _mockPlayerMessageRepository = new Mock<IPlayerMessageRepository>();
        _mockGameMessageRepository = new Mock<IGameMessageRepository>();
        _mockGameRepository = new Mock<IGameRepository>();
        _mockUserContextService = new Mock<IUserContextService>();
        _mockUserImageRepository = new Mock<IUserImageRepository>();
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
            WhitePlayerRegistered = true,
            BlackPlayerRegistered = true,
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

        var playerMessages = ReturnPlayerMessages(game.WhitePlayer, game.BlackPlayer);
        var gameMessages = ReturnGameMessages(gameId);


        var request = new GetAllMessagesRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);
        _mockGameMessageRepository.Setup(x => x.GetAll(gameId)).ReturnsAsync(gameMessages);
        _mockPlayerMessageRepository.Setup(x => x.GetAllByPlayers(game.WhitePlayerId, game.BlackPlayerId)).ReturnsAsync(playerMessages);


        var handler = new GetAllMessagesRequestHandler(
            _mockGameRepository.Object,
            _mockPlayerMessageRepository.Object,
            _mockGameMessageRepository.Object,
            _mockUserContextService.Object,
            _mockUserImageRepository.Object
        );

        var result = await handler.Handle(request, CancellationToken.None);


        result.Should().NotBeEmpty();
        result.Count.Should().Be(playerMessages.Count + gameMessages.Count);


        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockGameMessageRepository.Verify(x => x.GetAll(gameId), Times.Once);
        _mockPlayerMessageRepository.Verify(x => x.GetAllByPlayers(game.WhitePlayerId, game.BlackPlayerId), Times.Once);
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
            _mockPlayerMessageRepository.Object,
            _mockGameMessageRepository.Object,
            _mockUserContextService.Object,
            _mockUserImageRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockGameMessageRepository.Verify(x => x.GetAll(It.IsAny<Guid>()), Times.Never);
        _mockPlayerMessageRepository.Verify(x => x.GetAllByPlayers(It.IsAny<Guid>(), It.IsAny<Guid>()), Times.Never);
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

              WhitePlayerRegistered = true,
            BlackPlayerRegistered = true,
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
            _mockPlayerMessageRepository.Object,
            _mockGameMessageRepository.Object,
            _mockUserContextService.Object,
            _mockUserImageRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<UnauthorizedException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockGameMessageRepository.Verify(x => x.GetAll(It.IsAny<Guid>()), Times.Never);
        _mockPlayerMessageRepository.Verify(x => x.GetAllByPlayers(game.WhitePlayerId, game.BlackPlayerId), Times.Never);
    }

    private static List<PlayerMessage> ReturnPlayerMessages(Player whitePlayer, Player blackPlayer) {

        var messages = new List<PlayerMessage>();

        for(int i = 0; i < 10; i++) {
            messages.Add(new PlayerMessage() { 
                Id = Guid.NewGuid(),
                Content = "Message",
                PlayerId = i % 2 == 0 ? whitePlayer.Id : blackPlayer.Id,
                Player = i % 2 == 0 ? whitePlayer : blackPlayer,
                Type = MessageType.Normal,
            });
        }

        return messages;
    }

    private static List<GameMessage> ReturnGameMessages(Guid gameId) {

        var messages = new List<GameMessage>
        {
            new()
            {
                Id = Guid.NewGuid(),
                Content = "Draw Offer",
                GameId = gameId,
                Type = MessageType.DrawAction,
            }
        };

        return messages;
    }
}
