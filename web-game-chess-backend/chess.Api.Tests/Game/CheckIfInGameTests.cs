
using chess.Api.Tests.User;
using chess.Application.Requests.GameRequests.CheckIfInGame;
using chess.Core.Abstraction;
using chess.Core.Enums;
using chess.Infrastructure.Contexts;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Net;

namespace chess.Api.Tests.Game;

public class CheckIfInGameTests : IClassFixture<TestWebApplicationFactory<Program>> {

    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory<Program> _factory;
    private readonly ChessAppDbContext _dbContext;

    public CheckIfInGameTests() {
        _factory = new TestWebApplicationFactory<Program>();

        _client = _factory.CreateClient();

        var scopeFactory = _factory.Services.GetService<IServiceScopeFactory>()
            ?? throw new InvalidOperationException("IServiceScopeFactory not registered.");

        var scope = scopeFactory.CreateScope();
        _dbContext = scope.ServiceProvider.GetService<ChessAppDbContext>()
            ?? throw new InvalidOperationException("ChessAppDbContext not registered.");
    }

    [Fact]
    public async Task CheckIfInGame_Should_Return_Bool_Value_On_Success() {

        await _dbContext.Init();
        await _dbContext.AddUser();

        var timingId = await _dbContext.CreateTiming(new TimingType() {
            Type = TimingTypes.Bullet,
            Minutes = 1,
            Increment = 5,
        });

        var userPlayerId = await _dbContext.AddPlayer(Guid.Parse(Constants.UserId), Constants.Username);
        var otherPlayerId = await _dbContext.AddPlayer(Guid.NewGuid(), "OtherUser");


        var response_false = await _client.GetAsync($"api/game/check-if-in-game?playerId={userPlayerId}");


        response_false.StatusCode.Should().Be(HttpStatusCode.OK);

        var result_false = JsonConvert.DeserializeObject<CheckIfInGameDto>(await response_false.Content.ReadAsStringAsync());
        result_false.IsInGame.Should().Be(false);
        result_false.GameId.Should().Be(null);


        var gameId = await _dbContext.AddGame(userPlayerId, otherPlayerId, timingId);
        await _dbContext.AddPlayerToGame(userPlayerId, gameId, Colors.White);
        await _dbContext.AddPlayerToGame(otherPlayerId, gameId, Colors.Black);


        var response_true = await _client.GetAsync($"api/game/check-if-in-game?playerId={userPlayerId}");


        response_true.StatusCode.Should().Be(HttpStatusCode.OK);

        var result_true = JsonConvert.DeserializeObject<CheckIfInGameDto>(await response_true.Content.ReadAsStringAsync());
        result_true.IsInGame.Should().Be(true);
        result_true.GameId.Should().Be(gameId);
    }

    /// <summary>
    /// Check for not existing player
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async Task CheckIfInGame_Should_Return_NotFound_On_Fail() {

        await _dbContext.Init();
        await _dbContext.AddUser();

        // no player added


        var response = await _client.GetAsync($"api/game/check-if-in-game?playerId={Guid.NewGuid()}");


        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    /// <summary>
    /// Check for not owned player
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async Task CheckIfInGame_Should_Return_Unauthorized_On_Fail() {

        await _dbContext.Init();
        await _dbContext.AddUser();

        var playerId = await _dbContext.AddPlayer(Guid.NewGuid(), "OtherPlayer"); // not owned player


        var response = await _client.GetAsync($"api/game/check-if-in-game?playerId={playerId}");


        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
}
