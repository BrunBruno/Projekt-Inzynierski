
using chess.Api.Tests.User;
using chess.Application.Requests.GameRequests.GetOpponent;
using chess.Core.Abstraction;
using chess.Core.Enums;
using chess.Infrastructure.Contexts;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Net;

namespace chess.Api.Tests.Game;

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

        Guid freindId = Guid.NewGuid();

        await _dbContext.Init();
        await _dbContext.AddUser();
        await _dbContext.AddUserWithEmail("freind@test.com");

        var timingId = await _dbContext.CreateTiming(new TimingType() {
            Type = TimingTypes.Bullet,
            Minutes = 1,
            Increment = 0,
        });

        var userPlayerId = await _dbContext.AddPlayer(Guid.Parse(Constants.UserId), Constants.Username);
        var friendPlayerId = await _dbContext.AddPlayer(freindId, "FriendUsername");

        var gameId = await _dbContext.AddGame(userPlayerId, friendPlayerId, timingId);


        var response = await _client.GetAsync($"api/game/{gameId}/opponent");


        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var result = JsonConvert.DeserializeObject<GetOpponentDto>(await response.Content.ReadAsStringAsync());
        result.OppeonetId.Should().Be(freindId);
    }

    /// <summary>
    /// Gets oppones from not user game
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async Task GetOpponent_Should_Return_Unauthorized_On_Fail() {

        await _dbContext.Init();
        await _dbContext.AddUser();

        var timingId = await _dbContext.CreateTiming(new TimingType() {  
            Type = TimingTypes.Bullet,
            Minutes = 1,
            Increment = 0,
        });

        await _dbContext.AddPlayer(Guid.Parse(Constants.UserId), Constants.Username);
        var otherPlaywerId = await _dbContext.AddPlayer(Guid.NewGuid(), "OtherUsername");
        var otherPlaywer2Id = await _dbContext.AddPlayer(Guid.NewGuid(), "OtherUsername2");

        var gameId = await _dbContext.AddGame(otherPlaywerId, otherPlaywer2Id, timingId); // not user game
        await _dbContext.AddPlayerToGame(otherPlaywerId, gameId, Colors.White);
        await _dbContext.AddPlayerToGame(otherPlaywer2Id, gameId, Colors.Black);


        var response = await _client.GetAsync($"api/game/{gameId}/opponent");


        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    /// <summary>
    /// Gets not existsing game
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async Task GetOpponent_Should_Return_NotFound_On_Fail() {

        await _dbContext.Init();
        await _dbContext.AddUser();

        await _dbContext.CreateTiming(new TimingType() {
            Type = TimingTypes.Bullet,
            Minutes = 1,
            Increment = 0,
        });

        await _dbContext.AddPlayer(Guid.Parse(Constants.UserId), Constants.Username);
        // game not added


        var response = await _client.GetAsync($"api/game/{Guid.NewGuid()}/opponent");


        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}
