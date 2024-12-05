
using chess.Application.Repositories.FriendshipRepositories;
using chess.Application.Repositories.WebGameRepositories;
using chess.Application.Requests.FriendshipRequests.GetGamesOfFriendship;
using chess.Core.Entities;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.Friendship;

public class GetGamesOfFriendshipRequestHandlerTests {

    private readonly Mock<IFriendshipRepository> _mockFriendshipRepository;
    private readonly Mock<IWebGameRepository> _mockWebGameRepository;

    public GetGamesOfFriendshipRequestHandlerTests() {
        _mockFriendshipRepository = new Mock<IFriendshipRepository>();
        _mockWebGameRepository = new Mock<IWebGameRepository>();
    }

    [Fact]
    public async Task Handle_Returns_PagedResult_Of_Games_On_Success() {

        var friendshipId = Guid.NewGuid();

        var friendship = new Entities.Friendship() { 
            Id = friendshipId,
            RequestorId = Guid.NewGuid(),
            ReceiverId = Guid.NewGuid(),
        };

        var request = new GetGamesOfFriendshipRequest()
        {
            FriendshipId = friendshipId,
            PageNumber = 1,
            PageSize = 10,
        };


        _mockFriendshipRepository.Setup(x => x.GetById(friendshipId)).ReturnsAsync(friendship);
        _mockWebGameRepository.Setup(x => x.GetAllForFriendship(friendship.RequestorId, friendship.ReceiverId)).ReturnsAsync(ReturnExampleGames());



        var handler = new GetGamesOfFriendshipRequestHandler(
            _mockFriendshipRepository.Object,
            _mockWebGameRepository.Object
        );

        var result = await handler.Handle(request, CancellationToken.None);
        result.Items.Count.Should().Be(10);


        _mockFriendshipRepository.Verify(x => x.GetById(friendshipId), Times.Once());
        _mockWebGameRepository.Verify(x => x.GetAllForFriendship(friendship.RequestorId, friendship.ReceiverId), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_Friendship_Does_Not_Exists() {

        var friendshipId = Guid.NewGuid();


        var request = new GetGamesOfFriendshipRequest()
        {
            FriendshipId = friendshipId,
            PageNumber = 1,
            PageSize = 10,
        };


        // friendship not returned


        var handler = new GetGamesOfFriendshipRequestHandler(
            _mockFriendshipRepository.Object,
            _mockWebGameRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);
        await act.Should().ThrowAsync<NotFoundException>();

        _mockFriendshipRepository.Verify(x => x.GetById(friendshipId), Times.Once());
        _mockWebGameRepository.Verify(x => x.GetAllForFriendship(It.IsAny<Guid>(), It.IsAny<Guid>()), Times.Never);
    }

    private static List<Entities.WebGame> ReturnExampleGames() {
        var games = new List<Entities.WebGame>();

        for (int i = 0; i < 10; i++) {
            games.Add(new Entities.WebGame()
            {
                Id = Guid.NewGuid(),
                TimingType = Enums.TimingTypes.Classic,
                CreatedAt = DateTime.UtcNow,
                WhitePlayer = new WebGamePlayer()
                {
                    Name = "Username",
                    User = new Entities.User()
                    {
                        Email = "test@test.com",
                        Username = "Username",
                    },
                },
                BlackPlayer = new WebGamePlayer()
                {
                    Name = "Opponent",
                    User = new Entities.User()
                    {
                        Email = "opponent@test.com",
                        Username = "Opponent",
                    },
                }
            });
        }

        return games;
    }
}
