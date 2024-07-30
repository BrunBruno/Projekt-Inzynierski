
using chess.Api.Tests.User;
using chess.Application.Requests.GameRequests.GetGame;
using chess.Infrastructure.Contexts;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Net;

namespace chess.Api.Tests.Game;

public class GetGameTests : IClassFixture<TestWebApplicationFactory<Program>> {

    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory<Program> _factory;
    private readonly ChessAppDbContext _dbContext;

    public GetGameTests() {
        _factory = new TestWebApplicationFactory<Program>();

        _client = _factory.CreateClient();

        var scopeFactory = _factory.Services.GetService<IServiceScopeFactory>()
            ?? throw new InvalidOperationException("IServiceScopeFactory not registered.");

        var scope = scopeFactory.CreateScope();
        _dbContext = scope.ServiceProvider.GetService<ChessAppDbContext>()
            ?? throw new InvalidOperationException("ChessAppDbContext not registered.");
    }

    [Fact]
    public async Task GetGame_Should_Return_GameDto_On_Success() {

        Guid freindId = Guid.NewGuid();
        string friendEmail = "freind@test.com";
        string friendUsername = "FriendUsername";

        await _dbContext.Init();
        await _dbContext.AddUser();
        await _dbContext.AddUserWithEmail(friendEmail);

        var timingId = await _dbContext.CreateTiming();
        var userPlayerId = await _dbContext.AddPlayerForUser();
        var friendPlayerId = await _dbContext.AddPlayer(freindId, friendUsername);
        var gameId = await _dbContext.AddGame(userPlayerId, friendPlayerId, timingId);


        var response = await _client.GetAsync($"api/game/{gameId}");


        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var result = JsonConvert.DeserializeObject<GetGameDto>(await response.Content.ReadAsStringAsync());
        result.WhitePlayer.Name.Should().Be("TestUserName");
        result.BlackPlayer.Name.Should().Be(friendUsername);
    }

    /// <summary>
    /// Get game that not exists
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async Task GetGame_Should_Return_NotFound_On_Fail() {

        Guid freindId = Guid.NewGuid();
        string friendEmail = "freind@test.com";
        string friendUsername = "FriendUsername";

        await _dbContext.Init();
        await _dbContext.AddUser();
        await _dbContext.AddUserWithEmail(friendEmail);

        var timingId = await _dbContext.CreateTiming();
        var userPlayerId = await _dbContext.AddPlayerForUser();
        var friendPlayerId = await _dbContext.AddPlayer(freindId, friendUsername);
        // game not added

        var response = await _client.GetAsync($"api/game/{Guid.NewGuid()}");


        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    /// <summary>
    /// Get game that is not owned
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async Task GetGame_Should_Return_Unauthorized_On_Fail() {

        Guid freindId = Guid.NewGuid();
        string friendEmail = "freind@test.com";
        string friendUsername = "FriendUsername";

        await _dbContext.Init();
        await _dbContext.AddUser();
        await _dbContext.AddUserWithEmail(friendEmail);

        var timingId = await _dbContext.CreateTiming();
        await _dbContext.AddPlayerForUser();

        var friendPlayerId = await _dbContext.AddPlayer(freindId, friendUsername);
        var otherPlayerId = await _dbContext.AddPlayer(Guid.NewGuid(), "OtherPlayer");
        var gameId = await _dbContext.AddGame(otherPlayerId, friendPlayerId, timingId); // user is not in game


        var response = await _client.GetAsync($"api/game/{gameId}");


        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
}
