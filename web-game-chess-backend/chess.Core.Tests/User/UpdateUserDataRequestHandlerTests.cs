
using chess.Application.Repositories.UserRepositories;
using chess.Application.Requests.UserRequests.UpdateProfileVisibility;
using chess.Application.Services;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.User; 
public class UpdateUserDataRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IUserRepository> _mockUserRepository;

    public UpdateUserDataRequestHandlerTests() { 
        _mockUserContextService = new Mock<IUserContextService>();
        _mockUserRepository = new Mock<IUserRepository>();
    }

    [Fact]
    public async Task Handle_Updates_User_Data_On_Success() {

        var userId = Guid.NewGuid();

        var user = new Entities.User()
        {
            Id = userId,
            Email = "test@test.com",
            Username = "username",
            IsPrivate = false,
        };

        var request = new UpdateProfileVisibilityRequest()
        {
            ProfileIsPrivate = true,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockUserRepository.Setup(x => x.GetById(userId)).ReturnsAsync(user);


        var handler = new UpdateProfileVisibilityRequestHandler(
            _mockUserContextService.Object,
            _mockUserRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);
        await act.Should().NotThrowAsync();

        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(userId), Times.Once);
        _mockUserRepository.Verify(x => x.Update(user), Times.Once);
    }

    [Fact]
    public async Task Handle_Throw_NotFoundException_When_User_Does_Not_Exists() {

        var userId = Guid.NewGuid();

        var request = new UpdateProfileVisibilityRequest()
        {
            ProfileIsPrivate = true,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        // user not returned


        var handler = new UpdateProfileVisibilityRequestHandler(
            _mockUserContextService.Object,
            _mockUserRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);
        await act.Should().ThrowAsync<NotFoundException>();

        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(userId), Times.Once);
        _mockUserRepository.Verify(x => x.Update(It.IsAny<Entities.User>()), Times.Never);
    }
}
