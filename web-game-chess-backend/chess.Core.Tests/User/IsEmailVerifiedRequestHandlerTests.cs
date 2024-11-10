using chess.Application.Repositories.UserRepositories;
using chess.Application.Requests.UserRequests.IsEmailVerified;
using chess.Application.Services;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.User;

public class IsEmailVerifiedRequestHandlerTests {

    private readonly Mock<IUserRepository> _mockUserRepository;
    private readonly Mock<IUserContextService> _mockUserContextService;

    public IsEmailVerifiedRequestHandlerTests() {
        _mockUserRepository = new Mock<IUserRepository>();
        _mockUserContextService = new Mock<IUserContextService>();
    }

    [Fact]
    public async Task Handle_Returns_IsVerified_On_Success() {

        var exampleUser = new Entities.User
        {
            Id = Guid.NewGuid(),
            Email = "test@test.com",
            Username = "Username",
            IsVerified = true,
            PasswordHash = "PasswordHash",
            RoleId = (int)Roles.User
        };

        var request = new IsEmailVerifiedRequest();


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(exampleUser.Id);
        _mockUserRepository.Setup(x => x.GetById(exampleUser.Id)).ReturnsAsync(exampleUser);


        var handler = new IsEmailVerifiedRequestHandler(
            _mockUserContextService.Object,
            _mockUserRepository.Object
        );

        var result = await handler.Handle(request, CancellationToken.None);


        result.IsEmailVerified.Should().BeTrue();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(exampleUser.Id), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_User_Was_Not_Found() {

        var request = new IsEmailVerifiedRequest();


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(Guid.NewGuid());
        // user not returned


        var handler = new IsEmailVerifiedRequestHandler(
            _mockUserContextService.Object,
            _mockUserRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(It.IsAny<Guid>()), Times.Once);
    }
}
