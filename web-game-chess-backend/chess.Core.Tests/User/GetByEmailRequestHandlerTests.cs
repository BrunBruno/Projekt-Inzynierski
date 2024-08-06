
using chess.Application.Repositories;
using Moq;

namespace chess.Core.Tests.User;

public class GetByEmailRequestHandlerTests {

    private readonly Mock<IUserRepository> _mockUserRepository;

    public GetByEmailRequestHandlerTests() {
        _mockUserRepository = new Mock<IUserRepository>();
    }
}
