
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

public class BlockUserTests : IClassFixture<TestWebApplicationFactory<Program>> {

    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory<Program> _factory;
    private readonly ChessAppDbContext _dbContext;

    public BlockUserTests() {
        _factory = new TestWebApplicationFactory<Program>();

        _client = _factory.CreateClient();

        var scopeFactory = _factory.Services.GetService<IServiceScopeFactory>()
            ?? throw new InvalidOperationException("IServiceScopeFactory not registered.");

        var scope = scopeFactory.CreateScope();
        _dbContext = scope.ServiceProvider.GetService<ChessAppDbContext>()
            ?? throw new InvalidOperationException("ChessAppDbContext not registered.");
    }

    [Fact]
    public async Task BlockUser_Should_Remove_Friendship_On_Success() {

        await _dbContext.Init();
        await _dbContext.AddUser();
        var userToBlockId = await _dbContext.AddUserWithEmail("freind@test.com");


        var model = new BlockUserModel()
        {
            UserId = userToBlockId,
        };

        var json = JsonConvert.SerializeObject(model);
        var httpContent = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _client.PostAsync($"api/friendship/block", httpContent);


        var assertDbContext = _factory.GetDbContextForAsserts();

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var friendship = await assertDbContext.Friendships.FirstOrDefaultAsync();
        friendship.Should().NotBeNull();
        friendship!.Status.Should().Be(FriendshipStatus.Rejected);
    }

    [Fact]
    public async Task BlockUser_Should_Return_BadRequest_On_Fail() {

        await _dbContext.Init();
        await _dbContext.AddUser();
        var userToBlockId = await _dbContext.AddUserWithEmail("freind@test.com");


        var model = new BlockUserModel()
        {
            UserId = Guid.Parse(Constants.UserId), // try to block itself
        };

        var json = JsonConvert.SerializeObject(model);
        var httpContent = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _client.PostAsync($"api/friendship/block", httpContent);


        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task BlockUser_Should_Return_NotFound_On_Fail() {

        await _dbContext.Init();
        await _dbContext.AddUser();
        var userToBlockId = Guid.NewGuid(); // user not added


        var model = new BlockUserModel()
        {
            UserId = userToBlockId,
        };

        var json = JsonConvert.SerializeObject(model);
        var httpContent = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _client.PostAsync($"api/friendship/block", httpContent);


        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}
