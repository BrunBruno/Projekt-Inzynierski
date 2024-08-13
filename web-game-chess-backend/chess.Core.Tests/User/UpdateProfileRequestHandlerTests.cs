
using chess.Application.Repositories;
using chess.Application.Requests.UserRequests.UpdateProfile;
using chess.Application.Services;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.User;

public class UpdateProfileRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IUserRepository> _mockUserRepository;

    public UpdateProfileRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockUserRepository = new Mock<IUserRepository>();
    }

    [Fact]
    public async Task Handle_Should_Update_User_On_Success() {

        var userId = Guid.NewGuid();

        var request = new UpdateProfileRequest()
        {
            Name = "Name",
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockUserRepository.Setup(x => x.GetById(userId)).ReturnsAsync(new Entities.User() { 
            Email = "test@test.com",
            Username = "Username",
        });


        var handler = new UpdateProfileRequestHandler(
            _mockUserContextService.Object,
            _mockUserRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().NotThrowAsync();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(userId), Times.Once);
        _mockUserRepository.Verify(x => x.Update(It.IsAny<Entities.User>()), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_User_Does_Not_Exist() {

        var request = new UpdateProfileRequest()
        {
            Name = "Name",
        };

        var userId = Guid.NewGuid();


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);


        var handler = new UpdateProfileRequestHandler(
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
