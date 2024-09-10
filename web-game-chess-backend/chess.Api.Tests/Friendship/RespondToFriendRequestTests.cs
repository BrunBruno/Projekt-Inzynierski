
using chess.Api.Models.FriendshipModels;
using chess.Api.Tests.User;
using chess.Core.Enums;
using chess.Infrastructure.Contexts;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Net;
using System.Text;

namespace chess.Api.Tests.Friendship;

public class RespondToFriendRequestTests : IClassFixture<TestWebApplicationFactory<Program>> {

    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory<Program> _factory;
    private readonly ChessAppDbContext _dbContext;

    public RespondToFriendRequestTests() {
        _factory = new TestWebApplicationFactory<Program>();

        _client = _factory.CreateClient();

        var scopeFactory = _factory.Services.GetService<IServiceScopeFactory>()
            ?? throw new InvalidOperationException("IServiceScopeFactory not registered.");

        var scope = scopeFactory.CreateScope();
        _dbContext = scope.ServiceProvider.GetService<ChessAppDbContext>()
            ?? throw new InvalidOperationException("ChessAppDbContext not registered.");
    }

    [Fact]
    public async Task RespondToFriendRequest_Should_Update_Friendship_On_Success() {

        var userId = Guid.Parse(Constants.UserId);
        var friendId = Guid.NewGuid();
        var friendshipId = Guid.NewGuid();

        await _dbContext.Init();
        await _dbContext.AddUsers(friendId);
        await _dbContext.AddFriendship(friendshipId, friendId, userId, FriendshipStatus.Pending);

        var model = new RespondToFriendRequestModel()
        {
            IsAccepted = true,
        };

        var json = JsonConvert.SerializeObject(model);
        var httpContent = new StringContent(json, Encoding.UTF8, "application/json");


        var response = await _client.PutAsync($"api/friendship/{friendshipId}/respond", httpContent);


        var assertDbContext = _factory.GetDbContextForAsserts();

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var friendship = await assertDbContext.Friendships.FirstAsync();

        friendship.Status.Should().Be(FriendshipStatus.Accepted);
    }

    /// <summary>
    /// User was a requestor
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async Task RespondToFriendRequest_Should_Return_BadRequest_On_Fail() {

        var userId = Guid.Parse(Constants.UserId);
        var friendId = Guid.NewGuid();
        var friendshipId = Guid.NewGuid();

        await _dbContext.Init();
        await _dbContext.AddUsers(friendId);
        await _dbContext.AddFriendship(friendshipId, userId, friendId, FriendshipStatus.Pending); // user as requestor

        var model = new RespondToFriendRequestModel()
        {
            IsAccepted = true,
        };

        var json = JsonConvert.SerializeObject(model);
        var httpContent = new StringContent(json, Encoding.UTF8, "application/json");


        var response = await _client.PutAsync($"api/friendship/{friendshipId}/respond", httpContent);


        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    /// <summary>
    /// Request to not existing friendship
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async Task RespondToFriendRequest_Should_Return_NotFound_On_Fail() {

        await _dbContext.Init();
        await _dbContext.AddUsers(Guid.NewGuid());
        // friendship not added

        var model = new RespondToFriendRequestModel()
        {
            IsAccepted = true,
        };

        var json = JsonConvert.SerializeObject(model);
        var httpContent = new StringContent(json, Encoding.UTF8, "application/json");


        var response = await _client.PutAsync($"api/friendship/{Guid.NewGuid()}/respond", httpContent);


        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    /// <summary>
    /// Respond to not owned relation
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async Task RespondToFriendRequest_Should_Return_Unauthorized_On_Fail() {


        var friendshipId = Guid.NewGuid();

        await _dbContext.Init();
        await _dbContext.AddUsers(Guid.NewGuid());
        await _dbContext.AddFriendship(friendshipId, Guid.NewGuid(), Guid.NewGuid(), FriendshipStatus.Pending);

        var model = new RespondToFriendRequestModel()
        {
            IsAccepted = true,
        };

        var json = JsonConvert.SerializeObject(model);
        var httpContent = new StringContent(json, Encoding.UTF8, "application/json");


        // friendship not owned
        var response = await _client.PutAsync($"api/friendship/{friendshipId}/respond", httpContent);


        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
}
