
using chess.Application.Repositories;
using chess.Application.Services;
using Moq;

namespace chess.Core.Tests.Friendship;

public class RemoveFriendRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IFriendshipRepository> _mockFriendshipRepository;

    public RemoveFriendRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockFriendshipRepository = new Mock<IFriendshipRepository>();
    }
}
