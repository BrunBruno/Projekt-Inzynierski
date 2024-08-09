
using chess.Application.Repositories;
using chess.Application.Requests.GameRequests.GetGame;
using chess.Application.Requests.GameRequests.GetPlayer;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;
using System.Numerics;

namespace chess.Core.Tests.Game;

public class GetPlayerRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IPlayerRepository> _mockPlayerRepository;

    public GetPlayerRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockPlayerRepository = new Mock<IPlayerRepository>();
    }

    [Fact]
    public async Task Handle_Returns_Player_On_Success() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var player = new Player()
        {
            Name = "Username",
            UserId = userId,
            Color = Colors.White,
            IsPlaying = true,
        };

        var request = new GetPlayerRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockPlayerRepository.Setup(x => x.GetByUserIdAndGameId(userId, gameId)).ReturnsAsync(player);


        var handler = new GetPlayerRequestHandler(
            _mockPlayerRepository.Object,
            _mockUserContextService.Object
        );

        var result = await handler.Handle(request, CancellationToken.None);


        result.Name.Should().Be("Username");

        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetByUserIdAndGameId(userId, gameId), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_Player_Does_Not_Exist() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var request = new GetPlayerRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);


        var handler = new GetPlayerRequestHandler(
            _mockPlayerRepository.Object,
            _mockUserContextService.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetByUserIdAndGameId(userId, gameId), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_BadRequestException_When_Player_Is_Not_Playing() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var player = new Player()
        {
            Name = "Username",
            UserId = userId,
            Color = null,
            IsPlaying = false,
        };

        var request = new GetPlayerRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockPlayerRepository.Setup(x => x.GetByUserIdAndGameId(userId, gameId)).ReturnsAsync(player);


        var handler = new GetPlayerRequestHandler(
            _mockPlayerRepository.Object,
            _mockUserContextService.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<BadRequestException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetByUserIdAndGameId(userId, gameId), Times.Once);
    }
}
