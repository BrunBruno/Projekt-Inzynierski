﻿
using chess.Application.Repositories;
using chess.Application.Requests.GameRequests.GetEndedGame;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.Game;

public class GetEndedGameRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IGameRepository> _mockGameRepository;

    public GetEndedGameRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockGameRepository = new Mock<IGameRepository>();
    }

    [Fact]
    public async Task Handle_Returns_Winner_On_Success() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var game = new Entities.Game()
        {
            Id = gameId,
            WinnerColor = PieceColor.Black,
            HasEnded = true,
            WhitePlayerRegistered = true,
            BlackPlayerRegistered = true,

            WhitePlayer = new Player() { 
                Name = "Username",
                UserId = userId,
            },
            BlackPlayer = new Player()
            {
                Name = "Opponent",
                UserId = Guid.NewGuid(),
            },
            
        };

        var request = new GetEndedGameRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);


        var handler = new GetEndedGameRequestHandler(
            _mockGameRepository.Object,
            _mockUserContextService.Object
        );

        var result = await handler.Handle(request, CancellationToken.None);


        result.WinnerColor.Should().Be(PieceColor.Black);

        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_Game_Does_Not_Exist() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var request = new GetEndedGameRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        // game not returned


        var handler = new GetEndedGameRequestHandler(
            _mockGameRepository.Object,
            _mockUserContextService.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_UnauthorizedException_When_User_Does_Not_Belong_To_Game() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var game = new Entities.Game()
        {
            Id = gameId,
            WinnerColor = PieceColor.Black,
            HasEnded = true,
            WhitePlayerRegistered = true,
            BlackPlayerRegistered = true,

            WhitePlayer = new Player()
            {
                Name = "Other",
                UserId = Guid.NewGuid(), // user is not player
            },
            BlackPlayer = new Player()
            {
                Name = "Opponent",
                UserId = Guid.NewGuid(), // user is not player
            },

        };

        var request = new GetEndedGameRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);


        var handler = new GetEndedGameRequestHandler(
            _mockGameRepository.Object,
            _mockUserContextService.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<UnauthorizedException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_BadRequestException_When_Game_Has_Not_Ended() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var game = new Entities.Game()
        {
            Id = gameId,
            WinnerColor = PieceColor.Black,
            HasEnded = false, // game has not ended
            WhitePlayerRegistered = true,
            BlackPlayerRegistered = true,

            WhitePlayer = new Player()
            {
                Name = "Username",
                UserId = userId,
            },
            BlackPlayer = new Player()
            {
                Name = "Opponent",
                UserId = Guid.NewGuid(),
            },

        };

        var request = new GetEndedGameRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);


        var handler = new GetEndedGameRequestHandler(
            _mockGameRepository.Object,
            _mockUserContextService.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<BadRequestException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
    }
}
