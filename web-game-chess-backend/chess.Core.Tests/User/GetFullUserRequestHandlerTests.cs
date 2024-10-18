
using chess.Application.Repositories;
using chess.Application.Requests.UserRequests.GetFullUser;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.User;

public class GetFullUserRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IUserRepository> _mockUserRepository;

    public GetFullUserRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockUserRepository = new Mock<IUserRepository>();
    }

    [Fact]
    public async Task Handle_Returns_User_On_Success() {


        var exampleUser = new Entities.User
        {
            Id = Guid.NewGuid(),
            Email = "test@test.com",
            Username = "Username",
            IsVerified = true,
            PasswordHash = "PasswordHash",
            RoleId = (int)Roles.User,
            Elo = new UserElo(),
            Stats = new UserStats(),
            Image = new UserImage() { 
                ContentType = "Content-Type",
                Data = ""u8.ToArray()
            }
        };

        var request = new GetFullUserRequest();


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(exampleUser.Id);
        _mockUserRepository.Setup(x => x.GetById(exampleUser.Id)).ReturnsAsync(exampleUser);


        var handler = new GetFullUserRequestHandler(
            _mockUserContextService.Object,
            _mockUserRepository.Object
        );

        var result = await handler.Handle(request, CancellationToken.None);


        result.Should().NotBeNull();
        result.Email.Should().Be(exampleUser.Email);
        result.ProfilePicture.Should().NotBeNull();

        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(exampleUser.Id), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_User_Does_Not_Exist() {

        var request = new GetFullUserRequest();
        var userId = Guid.NewGuid();


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        // user not returned


        var handler = new GetFullUserRequestHandler(
            _mockUserContextService.Object,
            _mockUserRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(userId), Times.Once);
    }
}
