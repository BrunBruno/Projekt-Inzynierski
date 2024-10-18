
using chess.Application.Repositories;
using chess.Application.Requests.UserRequests.GetByEmail;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.User;

public class GetByEmailRequestHandlerTests {

    private readonly Mock<IUserRepository> _mockUserRepository;

    public GetByEmailRequestHandlerTests() {
        _mockUserRepository = new Mock<IUserRepository>();
    }

    [Fact]
    public async Task Handle_Returns_User_On_Success() {

        var request = new GetByEmailRequest()
        {
            Email = "test@test.com",
        };

        _mockUserRepository.Setup(x => x.GetByEmail(request.Email)).ReturnsAsync(new Entities.User()
        {
            Email = "test@test.com",
            Username = "Username",
        });

        var handler = new GetByEmailRequestHandler(_mockUserRepository.Object);

        var result = await handler.Handle(request, CancellationToken.None);


        result.Should().NotBeNull();
        _mockUserRepository.Verify(x => x.GetByEmail(request.Email), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_BadRequestException_When_Email_Is_Null() {

        var request = new GetByEmailRequest()
        {
            Email = null, // invalid email
        };


        var handler = new GetByEmailRequestHandler(_mockUserRepository.Object);

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<BadRequestException>();
        _mockUserRepository.Verify(x => x.GetByEmail(It.IsAny<string>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_User_Does_Not_Exist() {

        var request = new GetByEmailRequest()
        {
            Email = "test@test.com",
        };


        // user not returned


        var handler = new GetByEmailRequestHandler(_mockUserRepository.Object);

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserRepository.Verify(x => x.GetByEmail(request.Email), Times.Once);
    }
}
