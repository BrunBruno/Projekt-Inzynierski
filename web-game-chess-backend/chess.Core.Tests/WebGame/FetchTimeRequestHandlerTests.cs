﻿
using chess.Application.Repositories.WebGameRepositories;
using chess.Application.Requests.WebGameRequests.FetchTime;
using chess.Core.Entities;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.WebGame;

public class FetchTimeRequestHandlerTests {

    private readonly Mock<IWebGameRepository> _mockGameRepository;

    public FetchTimeRequestHandlerTests() {
        _mockGameRepository = new Mock<IWebGameRepository>();
    }

    [Fact]
    public async Task Handle_Returns_Times_On_Success() {

        var gameId = Guid.NewGuid();

        var game = new Entities.WebGame()
        {
            Id = gameId,
            HasEnded = false,
            StartedAt = DateTime.UtcNow,

            WhitePlayer = new WebGamePlayer() 
            { 
                Id = Guid.NewGuid(),
                Name = "WhitePlayer",
                TimeLeft = 10 * 60,
            },
            BlackPlayer = new WebGamePlayer()
            {
                Id = Guid.NewGuid(),
                Name = "BlackPlayer",
                TimeLeft = 10 * 60,
            },
            Moves = new List<WebGameMove>() { },
        };

        var request = new FetchTimeRequest()
        {
            GameId = gameId,
        };


        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);


        var handler = new FetchTimeRequestHandler(
            _mockGameRepository.Object
        );

        var result = await handler.Handle(request, CancellationToken.None);


        result.Should().NotBeNull();
        result.WhiteTimeLeft.Should().BeApproximately(10 * 60, 1);
        result.BlackTimeLeft.Should().Be(10 * 60);

        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_Game_Does_Not_Exist() {

        var gameId = Guid.NewGuid();

        var request = new FetchTimeRequest()
        {
            GameId = gameId,
        };


        // game is not returned


        var handler = new FetchTimeRequestHandler(
            _mockGameRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);



        await act.Should().ThrowAsync<NotFoundException>();
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_BadRequestException_When_Game_Is_Not_Properly_Initialized() {

        var gameId = Guid.NewGuid();

        var game = new Entities.WebGame()
        {
            Id = gameId,
            HasEnded = false,
            // started at not set

            WhitePlayer = new WebGamePlayer()
            {
                Id = Guid.NewGuid(),
                Name = "WhitePlayer",
                TimeLeft = 10 * 60,
            },
            BlackPlayer = new WebGamePlayer()
            {
                Id = Guid.NewGuid(),
                Name = "BlackPlayer",
                TimeLeft = 10 * 60,
            },
            Moves = new List<WebGameMove>() { },
        };

        var request = new FetchTimeRequest()
        {
            GameId = gameId,
        };


        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);


        var handler = new FetchTimeRequestHandler(
            _mockGameRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);



        await act.Should().ThrowAsync<BadRequestException>();
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_BadRequestException_When_StartTime_Is_Incorrect() {

        var gameId = Guid.NewGuid();

        var game = new Entities.WebGame()
        {
            Id = gameId,
            HasEnded = false,
            StartedAt = DateTime.UtcNow.AddHours(1), // start time incorrect

            WhitePlayer = new WebGamePlayer()
            {
                Id = Guid.NewGuid(),
                Name = "WhitePlayer",
                TimeLeft = 10 * 60,
            },
            BlackPlayer = new WebGamePlayer()
            {
                Id = Guid.NewGuid(),
                Name = "BlackPlayer",
                TimeLeft = 10 * 60,
            },
            Moves = new List<WebGameMove>() { },
        };

        var request = new FetchTimeRequest()
        {
            GameId = gameId,
        };


        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);


        var handler = new FetchTimeRequestHandler(
            _mockGameRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);



        await act.Should().ThrowAsync<BadRequestException>();
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
    }
}
