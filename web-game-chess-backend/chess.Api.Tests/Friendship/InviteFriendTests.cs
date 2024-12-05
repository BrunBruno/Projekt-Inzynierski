
using chess.Api.Models.FriendshipModels;
using chess.Api.Tests.User;
using chess.Infrastructure.Contexts;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Net;
using System.Text;

namespace chess.Api.Tests.Friendship;

public class InviteFriendTests : IClassFixture<TestWebApplicationFactory<Program>> {

    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory<Program> _factory;
    private readonly ChessAppDbContext _dbContext;

    public InviteFriendTests() {
        _factory = new TestWebApplicationFactory<Program>();

        _client = _factory.CreateClient();

        var scopeFactory = _factory.Services.GetService<IServiceScopeFactory>()
            ?? throw new InvalidOperationException("IServiceScopeFactory not registered.");

        var scope = scopeFactory.CreateScope();
        _dbContext = scope.ServiceProvider.GetService<ChessAppDbContext>()
            ?? throw new InvalidOperationException("ChessAppDbContext not registered.");
    }

    [Fact]
    public async Task InviteFriend_Should_Create_Friendship_On_Success() {

        Guid friendId = Guid.NewGuid();

        await _dbContext.Init();
        await _dbContext.AddUsers(friendId);

        var model = new InviteFriendModel()
        {
            ReceiverId = friendId,
        };

        var json = JsonConvert.SerializeObject(model);
        var httpContent = new StringContent(json, Encoding.UTF8, "application/json");


        var response = await _client.PostAsync("api/friendship/invite", httpContent);


        var assertDbContext = _factory.GetDbContextForAsserts();

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var friendship = await assertDbContext.Friendships.FirstAsync();

        friendship.RequestorId.Should().Be(Constants.UserId);
        friendship.ReceiverId.Should().Be(friendId);

    }

    [Fact]
    public async Task InviteFriend_Should_Return_BadRequest_On_Fail() {

        await _dbContext.Init();
        await _dbContext.AddUsers(Guid.NewGuid());

        var model = new InviteFriendModel()
        {
            ReceiverId = Guid.Parse(Constants.UserId), // user id as receiver id
        };

        var json = JsonConvert.SerializeObject(model);
        var httpContent = new StringContent(json, Encoding.UTF8, "application/json");


        var response = await _client.PostAsync("api/friendship/invite", httpContent);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task InviteFriend_Should_Return_NotFound_On_Fail() {

        await _dbContext.Init();
        await _dbContext.AddUsers(Guid.NewGuid());

        var model = new InviteFriendModel()
        {
            ReceiverId = Guid.NewGuid(), // not existing user
        };

        var json = JsonConvert.SerializeObject(model);
        var httpContent = new StringContent(json, Encoding.UTF8, "application/json");


        var response = await _client.PostAsync("api/friendship/invite", httpContent);

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}
