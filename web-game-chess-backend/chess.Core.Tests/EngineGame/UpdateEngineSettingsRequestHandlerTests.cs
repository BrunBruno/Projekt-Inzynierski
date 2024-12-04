
using chess.Application.Repositories.UserRepositories;
using chess.Application.Requests.EngineRequests.UpdateEngineSettings;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.EngineGame;

public class UpdateEngineSettingsRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IUserSettingsRepository> _mockUserSettingsRepository;

    public UpdateEngineSettingsRequestHandlerTests() { 
        _mockUserContextService = new Mock<IUserContextService>();
        _mockUserSettingsRepository = new Mock<IUserSettingsRepository>();
    }

    [Fact]
    public async Task Handle_Updates_User_Settings_On_Success() {
    
        var userId = Guid.NewGuid();

        var settings = new UserSettings();

        var request = new UpdateEngineSettingsRequest() { 
            AllowCheats = true 
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockUserSettingsRepository.Setup(x => x.GetByUserId(userId)).ReturnsAsync(settings);


        var handler = new UpdateEngineSettingsRequestHandler(
            _mockUserContextService.Object,
            _mockUserSettingsRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);
        await act.Should().NotThrowAsync();

        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserSettingsRepository.Verify( x => x.GetByUserId(userId), Times.Once);
        _mockUserSettingsRepository.Verify(x => x.Update(settings), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_UserSettings_Not_Exists() {

        var userId = Guid.NewGuid();

        var request = new UpdateEngineSettingsRequest()
        {
            AllowCheats = true
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        // settings not returned


        var handler = new UpdateEngineSettingsRequestHandler(
            _mockUserContextService.Object,
            _mockUserSettingsRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);
        await act.Should().ThrowAsync<NotFoundException>();

        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserSettingsRepository.Verify(x => x.GetByUserId(userId), Times.Once);
        _mockUserSettingsRepository.Verify(x => x.Update(It.IsAny<UserSettings>()), Times.Never);
    }
}
