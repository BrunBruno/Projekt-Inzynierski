
using chess.Application.Repositories;
using chess.Application.Requests.UserRequests.GetOtherUser;
using chess.Core.Entities;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.User;

public class GetOtherUserRequestHandlerTests {

    private readonly Mock<IUserRepository> _mockUserRepository;

    public GetOtherUserRequestHandlerTests() {
        _mockUserRepository = new Mock<IUserRepository>();
    }

    [Fact]
    public async Task Handle_Returns_User_On_Success() {

        var exampleUser = new Entities.User()
        {
            Id = Guid.NewGuid(),
            Email = "test@test.com",
            Username = "Username",
            Elo = new UserElo(),
            Stats = new UserStats(),
        };

        var request = new GetOtherUserRequest() 
        { 
            UserId = exampleUser.Id,
        };


        _mockUserRepository.Setup(x => x.GetById(request.UserId)).ReturnsAsync(exampleUser);


        var handler = new GetOtherUserRequestHandler(
            _mockUserRepository.Object
        );

        var result = await handler.Handle(request, CancellationToken.None);


        result.Should().NotBeNull();
        _mockUserRepository.Verify(x => x.GetById(request.UserId), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_User_Does_Not_Exist() {

        var request = new GetOtherUserRequest() { 
            UserId = Guid.NewGuid(),
        };


        var handler = new GetOtherUserRequestHandler(
            _mockUserRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserRepository.Verify(x => x.GetById(request.UserId), Times.Once);
    }
}
