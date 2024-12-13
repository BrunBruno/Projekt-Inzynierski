
using chess.Api.Tests.User;
using chess.Core.Enums;
using chess.Infrastructure.Contexts;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System.Net;

namespace chess.Api.Tests.Friendship;

public class RemoveFriendTests : IClassFixture<TestWebApplicationFactory<Program>> {

    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory<Program> _factory;
    private readonly ChessAppDbContext _dbContext;

    public RemoveFriendTests() {
        _factory = new TestWebApplicationFactory<Program>();

        _client = _factory.CreateClient();

        var scopeFactory = _factory.Services.GetService<IServiceScopeFactory>()
            ?? throw new InvalidOperationException("IServiceScopeFactory not registered.");

        var scope = scopeFactory.CreateScope();
        _dbContext = scope.ServiceProvider.GetService<ChessAppDbContext>()
            ?? throw new InvalidOperationException("ChessAppDbContext not registered.");
    }

    [Fact]
    public async Task RemoveFriend_Should_Remove_Friendship_On_Success() {

        var friendId = Guid.NewGuid();
        var friendshipId = Guid.NewGuid();

        await _dbContext.Init();
        await _dbContext.AddUsers(friendId);
        await _dbContext.AddFriendship(friendshipId, friendId, Guid.Parse(Constants.UserId), FriendshipStatus.Accepted);


        var response = await _client.DeleteAsync($"api/friendship/{friendshipId}");


        var assertDbContext = _factory.GetDbContextForAsserts();

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var friendship = await assertDbContext.Friendships.FirstOrDefaultAsync();

        friendship.Should().Be(null);
    }

    [Fact]
    public async Task RemoveFriend_Should_Remove_NotFound_On_Fail() {

        var friendId = Guid.NewGuid();

        await _dbContext.Init();
        await _dbContext.AddUsers(friendId);
        // friendship not added


        var response = await _client.DeleteAsync($"api/friendship/{Guid.NewGuid()}");


        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task RemoveFriend_Should_Remove_Unauthorized_On_Fail() {

        var friendId = Guid.NewGuid();
        var friendshipId = Guid.NewGuid();

        await _dbContext.Init();
        await _dbContext.AddUsers(friendId);
        await _dbContext.AddFriendship(friendshipId, friendId, Guid.NewGuid(), FriendshipStatus.Accepted);


        // not owned relationship
        var response = await _client.DeleteAsync($"api/friendship/{friendshipId}");


        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
}
