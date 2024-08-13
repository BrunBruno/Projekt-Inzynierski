
using chess.Application.Repositories;
using chess.Application.Requests.GameRequests.AbortSearch;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.Game;

public class AbortSearchRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IPlayerRepository> _mockPlayerRepository;

    public AbortSearchRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockPlayerRepository = new Mock<IPlayerRepository>();
    }

    [Fact]
    public async Task Handle_Removes_Player_On_Success() {

        var userId = Guid.NewGuid();
        var playerId = Guid.NewGuid();

        var examplePlayer = new Player()
        {
            Id = playerId,
            Name = "Username",
            UserId = userId,
            IsPlaying = false,
        };

        var request = new AbortSearchRequest()
        {
            PlayerId = playerId,
        };

        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockPlayerRepository.Setup(x => x.GetById(playerId)).ReturnsAsync(examplePlayer);


        var handler = new AbortSearchRequestHandler(
            _mockPlayerRepository.Object,
            _mockUserContextService.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().NotThrowAsync();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetById(playerId), Times.Once);
        _mockPlayerRepository.Verify(x => x.Delete(examplePlayer), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_Player_Does_Not_Exist() {

        var userId = Guid.NewGuid();
        var playerId = Guid.NewGuid();

        var request = new AbortSearchRequest()
        {
            PlayerId = playerId,
        };

        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);


        var handler = new AbortSearchRequestHandler(
            _mockPlayerRepository.Object,
            _mockUserContextService.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetById(playerId), Times.Once);
        _mockPlayerRepository.Verify(x => x.Delete(It.IsAny<Player>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_BadRequestException_When_User_Does_Not_Own_Player() {

        var userId = Guid.NewGuid();
        var playerId = Guid.NewGuid();


        var examplePlayer = new Player()
        {
            Id = playerId,
            Name = "Username",
            UserId = Guid.NewGuid(),
            IsPlaying = false,
        };

        var request = new AbortSearchRequest()
        {
            PlayerId = playerId,
        };

        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockPlayerRepository.Setup(x => x.GetById(playerId)).ReturnsAsync(examplePlayer);


        var handler = new AbortSearchRequestHandler(
            _mockPlayerRepository.Object,
            _mockUserContextService.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<BadRequestException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetById(playerId), Times.Once);
        _mockPlayerRepository.Verify(x => x.Delete(It.IsAny<Player>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_BadRequestException_When_Player_Is_In_Game() {

        var userId = Guid.NewGuid();
        var playerId = Guid.NewGuid();


        var examplePlayer = new Player()
        {
            Id = playerId,
            Name = "Username",
            UserId = userId,
            IsPlaying = true,
        };

        var request = new AbortSearchRequest()
        {
            PlayerId = playerId,
        };

        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockPlayerRepository.Setup(x => x.GetById(playerId)).ReturnsAsync(examplePlayer);


        var handler = new AbortSearchRequestHandler(
            _mockPlayerRepository.Object,
            _mockUserContextService.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<BadRequestException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetById(playerId), Times.Once);
        _mockPlayerRepository.Verify(x => x.Delete(It.IsAny<Player>()), Times.Never);
    }
}
