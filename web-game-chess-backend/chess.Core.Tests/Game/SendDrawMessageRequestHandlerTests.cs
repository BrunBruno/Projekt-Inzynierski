﻿
using chess.Application.Repositories;
using chess.Application.Requests.GameRequests.SendDrawMessage;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.Game;

public class SendDrawMessageRequestHandlerTests {

    private readonly Mock<IGameMessageRepository> _mockGameMessageRepository;
    private readonly Mock<IGameRepository> _mockGameRepository;
    private readonly Mock<IUserContextService> _mockUserContextService;

    public SendDrawMessageRequestHandlerTests() {
        _mockGameMessageRepository = new Mock<IGameMessageRepository>();
        _mockGameRepository = new Mock<IGameRepository>();
        _mockUserContextService = new Mock<IUserContextService>();
    }

    [Fact]
    public async Task Handle_Should_Create_DrawMessage_On_Success() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var game = new Entities.Game()
        {
            Id = gameId,
            WhitePlayerRegistered = true,
            BlackPlayerRegistered = true,

            WhitePlayerId = Guid.NewGuid(),
            WhitePlayer = new Player()
            {
                Name = "Username",
                UserId = userId,
                GameId = gameId,
            },

            BlackPlayerId = Guid.NewGuid(),
            BlackPlayer = new Player()
            {
                Name = "Other",
                UserId = Guid.NewGuid(),
                GameId = gameId,
            },
        };

        var request = new SendDrawMessageRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);


        var handler = new SendDrawMessageRequestHandler(
            _mockGameMessageRepository.Object,
            _mockGameRepository.Object,
            _mockUserContextService.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().NotThrowAsync();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockGameMessageRepository.Verify(x => x.GetDrawMessage(gameId), Times.Once);
        _mockGameMessageRepository.Verify(x => x.Create(It.IsAny<GameMessage>()), Times.Once);
    }


    [Fact]
    public async Task Handle_Throws_NotFoundException_When_Game_Does_Not_Exist() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var request = new SendDrawMessageRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        // game not returned


        var handler = new SendDrawMessageRequestHandler(
            _mockGameMessageRepository.Object,
            _mockGameRepository.Object,
            _mockUserContextService.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockGameMessageRepository.Verify(x => x.GetDrawMessage(It.IsAny<Guid>()), Times.Never);
        _mockGameMessageRepository.Verify(x => x.Create(It.IsAny<GameMessage>()), Times.Never);
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

            WhitePlayerId = Guid.NewGuid(),
            WhitePlayer = new Player()
            {  
                Name = "Friend",
                UserId = Guid.NewGuid(), // user is not player
                GameId = gameId,
            },

            BlackPlayerId = Guid.NewGuid(),
            BlackPlayer = new Player()
            {
                Name = "Other",
                UserId = Guid.NewGuid(), // user is not player
                GameId = gameId,
            },
        };

        var request = new SendDrawMessageRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);

        var handler = new SendDrawMessageRequestHandler(
            _mockGameMessageRepository.Object,
            _mockGameRepository.Object,
            _mockUserContextService.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<UnauthorizedException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockGameMessageRepository.Verify(x => x.GetDrawMessage(It.IsAny<Guid>()), Times.Never);
        _mockGameMessageRepository.Verify(x => x.Create(It.IsAny<GameMessage>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_BadRequestException_When_DrawMessage_Already_Exists() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var drawMessage = new GameMessage()
        {
            Content = "Draw offer",
            Type = MessageType.DrawAction,
        };

        var game = new Entities.Game()
        {
            Id = gameId,
            WhitePlayerRegistered = true,
            BlackPlayerRegistered = true,

            WhitePlayerId = Guid.NewGuid(),
            WhitePlayer = new Player()
            {
                Name = "Username",
                UserId = userId,
                GameId = gameId,
            },

            BlackPlayerId = Guid.NewGuid(),
            BlackPlayer = new Player()
            {
                Name = "Other",
                UserId = Guid.NewGuid(),
                GameId = gameId,
            },

            Messages = new List<GameMessage>() {
                drawMessage
            }
        };

        var request = new SendDrawMessageRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);
        _mockGameMessageRepository.Setup(x => x.GetDrawMessage(gameId)).ReturnsAsync(drawMessage); // draw message exists

        var handler = new SendDrawMessageRequestHandler(
            _mockGameMessageRepository.Object,
            _mockGameRepository.Object,
            _mockUserContextService.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<BadRequestException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockGameMessageRepository.Verify(x => x.GetDrawMessage(gameId), Times.Once);
        _mockGameMessageRepository.Verify(x => x.Create(It.IsAny<GameMessage>()), Times.Never);
    }
}
