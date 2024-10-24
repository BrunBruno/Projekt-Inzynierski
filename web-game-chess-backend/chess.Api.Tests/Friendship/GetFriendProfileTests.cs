
using chess.Api.Tests.User;
using chess.Application.Requests.FriendshipRequests.GetFriendProfile;
using chess.Core.Enums;
using chess.Infrastructure.Contexts;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Net;

namespace chess.Api.Tests.Friendship;

public class GetFriendProfileTests : IClassFixture<TestWebApplicationFactory<Program>> {

    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory<Program> _factory;
    private readonly ChessAppDbContext _dbContext;

    public GetFriendProfileTests() {
        _factory = new TestWebApplicationFactory<Program>();

        _client = _factory.CreateClient();

        var scopeFactory = _factory.Services.GetService<IServiceScopeFactory>()
            ?? throw new InvalidOperationException("IServiceScopeFactory not registered.");

        var scope = scopeFactory.CreateScope();
        _dbContext = scope.ServiceProvider.GetService<ChessAppDbContext>()
            ?? throw new InvalidOperationException("ChessAppDbContext not registered.");
    }

    [Fact]
    public async Task GetFriendProfile_Should_Return_UserDto_On_Success() {

        var friendId = Guid.NewGuid();
        var friendshipId = Guid.NewGuid();

        await _dbContext.Init();
        await _dbContext.AddUsers(friendId);
        await _dbContext.AddFriendship(friendshipId, Guid.Parse(Constants.UserId), friendId, FriendshipStatus.Accepted);

        var response = await _client.GetAsync($"api/friendship/{friendshipId}/profile");

        response.StatusCode.Should().Be(HttpStatusCode.OK);


        var result = JsonConvert.DeserializeObject<GetFriendProfileDto>(await response.Content.ReadAsStringAsync());
        result.Username.Should().Be("Receiver");
    }

    /// <summary>
    /// Gets not accepted friendship
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async Task GetFriendProfile_Should_Return_BadRequest_On_Fail() {

        var friendId = Guid.NewGuid();
        var friendshipId = Guid.NewGuid();

        await _dbContext.Init();
        await _dbContext.AddUsers(friendId);
        await _dbContext.AddFriendship(friendshipId, Guid.Parse(Constants.UserId), friendId, FriendshipStatus.Rejected); // rejected

        var response = await _client.GetAsync($"api/friendship/{friendshipId}/profile");

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    /// <summary>
    /// Get non existing friendship
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async Task GetFriendProfile_Should_Return_NotFound_On_Fail() {

        var friendId = Guid.NewGuid();
        var friendshipId = Guid.NewGuid();

        await _dbContext.Init();
        await _dbContext.AddUsers(friendId);
        await _dbContext.AddFriendship(friendshipId, Guid.Parse(Constants.UserId), friendId, FriendshipStatus.Accepted);


        // non existing friendship id
        var response = await _client.GetAsync($"api/friendship/{Guid.NewGuid()}/profile");


        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    /// <summary>
    /// Get someones friendship
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async Task GetFriendProfile_Should_Return_Unauthorized_On_Fail() {

        var friendId = Guid.NewGuid();
        var friendshipId = Guid.NewGuid();

        await _dbContext.Init();
        await _dbContext.AddUsers(friendId);
        await _dbContext.AddFriendship(friendshipId, Guid.NewGuid(), friendId, FriendshipStatus.Accepted);


        // not owned friendship
        var response = await _client.GetAsync($"api/friendship/{friendshipId}/profile");


        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
}
