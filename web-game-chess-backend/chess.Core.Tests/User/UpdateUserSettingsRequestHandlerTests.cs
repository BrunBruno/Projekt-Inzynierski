
using chess.Application.Repositories.UserRepositories;
using chess.Application.Requests.UserRequests.UpdateUserSettings;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.User;

public class UpdateUserSettingsRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IUserSettingsRepository> _mockUserSettingsRepository;

    public UpdateUserSettingsRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockUserSettingsRepository = new Mock<IUserSettingsRepository>();
    }

    [Fact]
    public async Task Handle_Updates_UserSettings_On_Success() {

        var userId = Guid.NewGuid();

        var settings = new UserSettings() { 
            UserId = userId,
        };

        var request = new UpdateUserSettingsRequest()
        {
            AppearanceOfPieces = AppearanceOfPieces.VariantB,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockUserSettingsRepository.Setup(x => x.GetByUserId(userId)).ReturnsAsync(settings);


        var handler = new UpdateUserSettingsRequestHandler(
            _mockUserContextService.Object,
            _mockUserSettingsRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);
        await act.Should().NotThrowAsync();


        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserSettingsRepository.Verify(x => x.GetByUserId(userId), Times.Once);
        _mockUserSettingsRepository.Verify(x => x.Update(settings), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_Settings_Does_Not_Exists() {

        var userId = Guid.NewGuid();


        var request = new UpdateUserSettingsRequest()
        {
            AppearanceOfPieces = AppearanceOfPieces.VariantB,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        // settings not returned


        var handler = new UpdateUserSettingsRequestHandler(
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
