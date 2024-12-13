
using chess.Api.Tests.User;
using chess.Application.Requests.WebGameRequests.GetOpponent;
using chess.Core.Models;
using chess.Core.Enums;
using chess.Infrastructure.Contexts;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Net;

namespace chess.Api.Tests.WebGame;

public class GetOpponentTests : IClassFixture<TestWebApplicationFactory<Program>> {

    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory<Program> _factory;
    private readonly ChessAppDbContext _dbContext;

    public GetOpponentTests() {
        _factory = new TestWebApplicationFactory<Program>();

        _client = _factory.CreateClient();

        var scopeFactory = _factory.Services.GetService<IServiceScopeFactory>()
            ?? throw new InvalidOperationException("IServiceScopeFactory not registered.");

        var scope = scopeFactory.CreateScope();
        _dbContext = scope.ServiceProvider.GetService<ChessAppDbContext>()
            ?? throw new InvalidOperationException("ChessAppDbContext not registered.");
    }

    [Fact]
    public async Task GetOpponent_Should_Return_PlayerDto_On_Success() {

        await _dbContext.Init();
        await _dbContext.AddUser();
        var friendId = await _dbContext.AddUserWithEmail("friend@test.com");

        var timingId = await _dbContext.CreateTiming(new TimingTypeModel() {
            Type = TimingTypes.Bullet,
            Minutes = 1,
            Increment = 0,
        });

        var userPlayerId = await _dbContext.AddPlayer(Guid.Parse(Constants.UserId), Constants.Username);
        var friendPlayerId = await _dbContext.AddPlayer(friendId, "FriendUsername");

        var gameId = await _dbContext.AddGame(userPlayerId, friendPlayerId, timingId, false);


        var response = await _client.GetAsync($"api/webgame/{gameId}/opponent");


        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var result = JsonConvert.DeserializeObject<GetOpponentDto>(await response.Content.ReadAsStringAsync());
        result.OpponentId.Should().Be(friendId);
    }

    [Fact]
    public async Task GetOpponent_Should_Return_Unauthorized_On_Fail() {

        await _dbContext.Init();
        await _dbContext.AddUser();
        var friendId = await _dbContext.AddUserWithEmail("freind@test.com");
        var otherUserId = await _dbContext.AddUserWithEmail("other@test.com");

        var timingId = await _dbContext.CreateTiming(new TimingTypeModel() {  
            Type = TimingTypes.Bullet,
            Minutes = 1,
            Increment = 0,
        });

        await _dbContext.AddPlayer(Guid.Parse(Constants.UserId), Constants.Username);
        var otherPlayerId = await _dbContext.AddPlayer(friendId, "friend");
        var otherPlayer2Id = await _dbContext.AddPlayer(otherUserId, "other");

        var gameId = await _dbContext.AddGame(otherPlayerId, otherPlayer2Id, timingId, false); // not user game
        await _dbContext.AddPlayerToGame(otherPlayerId, gameId, PieceColor.White);
        await _dbContext.AddPlayerToGame(otherPlayer2Id, gameId, PieceColor.Black);


        var response = await _client.GetAsync($"api/webgame/{gameId}/opponent");


        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task GetOpponent_Should_Return_NotFound_On_Fail() {

        await _dbContext.Init();
        await _dbContext.AddUser();

        await _dbContext.CreateTiming(new TimingTypeModel() {
            Type = TimingTypes.Bullet,
            Minutes = 1,
            Increment = 0,
        });

        await _dbContext.AddPlayer(Guid.Parse(Constants.UserId), Constants.Username);
        // game not added


        var response = await _client.GetAsync($"api/webgame/{Guid.NewGuid()}/opponent");


        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}
