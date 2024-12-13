
using chess.Application.Repositories.EngineGameRepositories;
using chess.Application.Requests.EngineRequests.ChangeEngineLevel;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.EngineGame;

public class ChangeEngineLevelRequestHandlerTests {

    private readonly Mock<IEngineGameRepository> _mockEngineGameRepository;
    private readonly Mock<IUserContextService> _mockUserContextService;

    public ChangeEngineLevelRequestHandlerTests() { 
        _mockEngineGameRepository = new Mock<IEngineGameRepository>();
        _mockUserContextService = new Mock<IUserContextService>();
    }

    [Fact]
    public async Task Handle_Should_Update_Game_On_Success() {
    
        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var game = new Entities.EngineGame()
        {
            Id = gameId,
            EngineLevel = 1,
            Player = new EngineGamePlayer()
            {
                Name = "Username",
                UserId = userId,
            }
        };

        var request = new ChangeEngineLevelRequest()
        {
            GameId = gameId,
            Level = 5,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockEngineGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);


        var handler = new ChangeEngineLevelRequestHandler(
            _mockEngineGameRepository.Object,
            _mockUserContextService.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);
        await act.Should().NotThrowAsync();


        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockEngineGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockEngineGameRepository.Verify(x => x.Update(game), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_Game_Does_Not_Exists() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();


        var request = new ChangeEngineLevelRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        // game not returned


        var handler = new ChangeEngineLevelRequestHandler(
            _mockEngineGameRepository.Object,
            _mockUserContextService.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);
        await act.Should().ThrowAsync<NotFoundException>();


        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockEngineGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockEngineGameRepository.Verify(x => x.Update(It.IsAny<Entities.EngineGame>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_UnauthorizedException_When_User_Is_Not_Player() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var game = new Entities.EngineGame()
        {
            Id = gameId,
            EngineLevel = 1,
            Player = new EngineGamePlayer()
            {
                Name = "Username",
                UserId = Guid.NewGuid(), // not user player
            }
        };

        var request = new ChangeEngineLevelRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockEngineGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);


        var handler = new ChangeEngineLevelRequestHandler(
            _mockEngineGameRepository.Object,
            _mockUserContextService.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);
        await act.Should().ThrowAsync<UnauthorizedException>();


        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockEngineGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockEngineGameRepository.Verify(x => x.Update(It.IsAny<Entities.EngineGame>()), Times.Never);
    }
}
