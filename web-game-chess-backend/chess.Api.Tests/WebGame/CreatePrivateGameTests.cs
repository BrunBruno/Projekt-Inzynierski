
using chess.Api.Models.GameModels;
using chess.Api.Tests.Friendship;
using chess.Api.Tests.User;
using chess.Application.Requests.GameRequests.CreatePrivateGame;
using chess.Core.Enums;
using chess.Infrastructure.Contexts;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Net;
using System.Text;

namespace chess.Api.Tests.Game;

public class CreatePrivateGameTests : IClassFixture<TestWebApplicationFactory<Program>> {

    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory<Program> _factory;
    private readonly ChessAppDbContext _dbContext;

    public CreatePrivateGameTests() {
        _factory = new TestWebApplicationFactory<Program>();

        _client = _factory.CreateClient();

        var scopeFactory = _factory.Services.GetService<IServiceScopeFactory>()
            ?? throw new InvalidOperationException("IServiceScopeFactory not registered.");

        var scope = scopeFactory.CreateScope();
        _dbContext = scope.ServiceProvider.GetService<ChessAppDbContext>()
            ?? throw new InvalidOperationException("ChessAppDbContext not registered.");
    }

    [Fact]
    public async Task CreatePrivateGame_Should_Create_Essentials_For_Private_Game() {

        Guid friendId = Guid.NewGuid();
        Guid friendshipId = Guid.NewGuid();

        await _dbContext.Init();
        await _dbContext.AddUsers(friendId);
        await _dbContext.AddFriendship(friendshipId, friendId, Guid.Parse(Constants.UserId), FriendshipStatus.Accepted);

        var model = new CreatePrivateGameModel()
        {
            FriendshipId = friendshipId,
            Type = TimingTypes.Blitz,
            Minutes = 3,
            Increment = 0,
        };

        var json = JsonConvert.SerializeObject(model);
        var httpContent = new StringContent(json, Encoding.UTF8, "application/json");


        var response = await _client.PostAsync("api/game/private", httpContent);


        var assertDbContext = _factory.GetDbContextForAsserts();

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var players = await assertDbContext.Players.ToListAsync();
        players.Count.Should().Be(2);

        var game = await assertDbContext.Games.FirstAsync();

        game.TimingType.Should().Be(TimingTypes.Blitz);

        var result = JsonConvert.DeserializeObject<CreatePrivateGameDto>(await response.Content.ReadAsStringAsync());
        result.GameId.Should().Be(game.Id);
        result.Inviter.Should().Be("Requestor");
    }

    /// <summary>
    /// Create without friendship existing
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async Task CreatePrivateGame_Should_Return_NotFound_On_Fail() {

        Guid friendId = Guid.NewGuid();
        Guid friendshipId = Guid.NewGuid();

        await _dbContext.Init();
        await _dbContext.AddUsers(friendId);
        // friendship not added

        var model = new CreatePrivateGameModel()
        {
            FriendshipId = friendshipId,
            Type = TimingTypes.Blitz,
            Minutes = 3,
            Increment = 0,
        };

        var json = JsonConvert.SerializeObject(model);
        var httpContent = new StringContent(json, Encoding.UTF8, "application/json");


        var response = await _client.PostAsync("api/game/private", httpContent);


        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}
