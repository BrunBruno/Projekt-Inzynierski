
using chess.Application.Repositories;
using chess.Application.Services;
using Moq;

namespace chess.Core.Tests.Friendship;

public class GetFriendProfileRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IUserRepository> _mockUserRepository;
    private readonly Mock<IFriendshipRepository> _mockFriendshipRepository;

    public GetFriendProfileRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockUserRepository = new Mock<IUserRepository>();
        _mockFriendshipRepository = new Mock<IFriendshipRepository>();
    }
}
