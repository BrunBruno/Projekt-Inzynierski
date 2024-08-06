
using chess.Application.Repositories;
using Moq;

namespace chess.Core.Tests.User;

public class GetOtherUserRequestHandlerTests {

    private readonly Mock<IUserRepository> _mockUserRepository;

    public GetOtherUserRequestHandlerTests() {
        _mockUserRepository = new Mock<IUserRepository>();
    }
}
