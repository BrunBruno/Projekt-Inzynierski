using chess.Application.Repositories.GameRepositories;
using chess.Application.Requests.GameRequests.GetAllInvitations;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Core.Enums;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.Game;

public class GetAllInvitationsRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IGameInvitationRepository> _mockGameInvitationRepository;

    public GetAllInvitationsRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockGameInvitationRepository = new Mock<IGameInvitationRepository>();
    }

    [Fact]
    public async Task Handle_Returns_PagedResult_Of_Invitations_On_Success() {

        var userId = Guid.NewGuid();
        var invitations = ReturnExampleInvitations(userId);

        var request = new GetAllInvitationsRequest()
        {
            PageNumber = 1,
            PageSize = 10,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameInvitationRepository.Setup(x => x.GetAllForUser(userId)).ReturnsAsync(invitations);


        var handler = new GetAllInvitationsRequestHandler(
            _mockUserContextService.Object,
            _mockGameInvitationRepository.Object
        );

        var result = await handler.Handle(request, CancellationToken.None);


        result.Items.Count.Should().Be(10);
        result.TotalItemsCount.Should().Be(20);
        result.ItemsFrom = 1;
        result.ItemsTo = 10;

        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameInvitationRepository.Verify(x => x.GetAllForUser(userId), Times.Once);
    }

    private static List<GameInvitation> ReturnExampleInvitations(Guid userId) {

        var invitations = new List<GameInvitation>();

        for(int i = 0; i < 20; i++) {
            invitations.Add(new GameInvitation() { 
                InviterId = Guid.NewGuid(),
                InviterName = "Inviter",
                InviteeId = userId,
                InviteeName = "Username",
                GameId = Guid.NewGuid(),
                Type = TimingTypes.Blitz,
            });
        }

        return invitations;
    }
}
