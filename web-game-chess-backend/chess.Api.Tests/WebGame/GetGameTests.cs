
using chess.Api.Tests.User;
using chess.Application.Requests.WebGameRequests.GetWebGame;
using chess.Core.Models;
using chess.Core.Enums;
using chess.Infrastructure.Contexts;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Net;

namespace chess.Api.Tests.WebGame;

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

        string friendUsername = "FriendUsername";

        await _dbContext.Init();
        await _dbContext.AddUser();
        var friendId = await _dbContext.AddUserWithEmail("friend@test.com");

        var timingId = await _dbContext.CreateTiming(new TimingTypeModel() {
            Type = TimingTypes.Bullet,
            Minutes = 2,
            Increment = 0,
        });

        var userPlayerId = await _dbContext.AddPlayer(Guid.Parse(Constants.UserId), Constants.Username);
        var friendPlayerId = await _dbContext.AddPlayer(friendId, friendUsername);

        var gameId = await _dbContext.AddGame(userPlayerId, friendPlayerId, timingId, false);
        await _dbContext.AddPlayerToGame(userPlayerId, gameId, PieceColor.White);
        await _dbContext.AddPlayerToGame(friendPlayerId, gameId, PieceColor.Black);


        var response = await _client.GetAsync($"api/webgame/{gameId}");


        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var result = JsonConvert.DeserializeObject<GetWebGameDto>(await response.Content.ReadAsStringAsync());
        result.WhitePlayer.Name.Should().Be(Constants.Username);
        result.BlackPlayer.Name.Should().Be(friendUsername);
    }

    /// <summary>
    /// Get game that not exists
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async Task GetGame_Should_Return_NotFound_On_Fail() {

        await _dbContext.Init();
        await _dbContext.AddUser();
        var friendId = await _dbContext.AddUserWithEmail("friend@test.com");

        await _dbContext.CreateTiming(new TimingTypeModel() {
            Type = TimingTypes.Bullet,
            Minutes = 2,
            Increment = 0,
        });

        await _dbContext.AddPlayer(Guid.Parse(Constants.UserId), Constants.Username);
        await _dbContext.AddPlayer(friendId, "FriendUsername");

        // game not added


        var response = await _client.GetAsync($"api/webgame/{Guid.NewGuid()}");


        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    /// <summary>
    /// Get game that is not owned
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async Task GetGame_Should_Return_Unauthorized_On_Fail() {

        await _dbContext.Init();
        await _dbContext.AddUser();
        var friendId = await _dbContext.AddUserWithEmail("friend@test.com");
        var otherUserId = await _dbContext.AddUserWithEmail("other@test.com");

        var timingId = await _dbContext.CreateTiming(new TimingTypeModel() {
            Type = TimingTypes.Bullet,
            Minutes = 2,
            Increment = 0,
        });

        await _dbContext.AddPlayer(Guid.Parse(Constants.UserId), Constants.Username);
        var friendPlayerId = await _dbContext.AddPlayer(friendId, "FriendUsername");
        var otherPlayerId = await _dbContext.AddPlayer(otherUserId, "OtherUsername");

        var gameId = await _dbContext.AddGame(otherPlayerId, friendPlayerId, timingId, false); // user is not in game


        var response = await _client.GetAsync($"api/webgame/{gameId}");


        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
}
