
using chess.Application.Repositories.WebGameRepositories;
using chess.Application.Requests.WebGameRequests.AbortWebGameSearch;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.WebGame;

public class AbortWebGameSearchRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IWebGamePlayerRepository> _mockPlayerRepository;

    public AbortWebGameSearchRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockPlayerRepository = new Mock<IWebGamePlayerRepository>();
    }

    [Fact]
    public async Task Handle_Removes_Player_On_Success() {

        var userId = Guid.NewGuid();
        var playerId = Guid.NewGuid();

        var examplePlayer = new WebGamePlayer()
        {
            Id = playerId,
            Name = "Username",
            UserId = userId,
            IsPlaying = false,
        };

        var request = new AbortWebGameSearchRequest()
        {
            PlayerId = playerId,
        };

        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockPlayerRepository.Setup(x => x.GetById(playerId)).ReturnsAsync(examplePlayer);


        var handler = new AbortWebGameSearchRequestHandler(
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

        var request = new AbortWebGameSearchRequest()
        {
            PlayerId = playerId,
        };

        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        // player not exists


        var handler = new AbortWebGameSearchRequestHandler(
            _mockPlayerRepository.Object,
            _mockUserContextService.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetById(playerId), Times.Once);
        _mockPlayerRepository.Verify(x => x.Delete(It.IsAny<WebGamePlayer>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_BadRequestException_When_User_Does_Not_Own_Player() {

        var userId = Guid.NewGuid();
        var playerId = Guid.NewGuid();


        var examplePlayer = new WebGamePlayer()
        {
            Id = playerId,
            Name = "Username",
            UserId = Guid.NewGuid(), // not owned player
            IsPlaying = false,
        };

        var request = new AbortWebGameSearchRequest()
        {
            PlayerId = playerId,
        };

        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockPlayerRepository.Setup(x => x.GetById(playerId)).ReturnsAsync(examplePlayer);


        var handler = new AbortWebGameSearchRequestHandler(
            _mockPlayerRepository.Object,
            _mockUserContextService.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<BadRequestException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetById(playerId), Times.Once);
        _mockPlayerRepository.Verify(x => x.Delete(It.IsAny<WebGamePlayer>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_BadRequestException_When_Player_Is_In_Game() {

        var userId = Guid.NewGuid();
        var playerId = Guid.NewGuid();


        var examplePlayer = new WebGamePlayer()
        {
            Id = playerId,
            Name = "Username",
            UserId = userId,
            IsPlaying = true, // is playing
        };

        var request = new AbortWebGameSearchRequest()
        {
            PlayerId = playerId,
        };

        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockPlayerRepository.Setup(x => x.GetById(playerId)).ReturnsAsync(examplePlayer);


        var handler = new AbortWebGameSearchRequestHandler(
            _mockPlayerRepository.Object,
            _mockUserContextService.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<BadRequestException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetById(playerId), Times.Once);
        _mockPlayerRepository.Verify(x => x.Delete(It.IsAny<WebGamePlayer>()), Times.Never);
    }
}
