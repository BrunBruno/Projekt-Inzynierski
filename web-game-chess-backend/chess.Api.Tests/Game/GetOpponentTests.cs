
using chess.Api.Tests.User;
using chess.Application.Requests.GameRequests.GetOpponent;
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
        string friendEmail = "freind@test.com";
        string friendUsername = "FriendUsername";

        await _dbContext.Init();
        await _dbContext.AddUser();
        await _dbContext.AddUserWithEmail(friendEmail);

        var timingId = await _dbContext.CreateTiming();
        var userPlayerId = await _dbContext.AddPlayerForUser();
        var friendPlayerId = await _dbContext.AddPlayer(freindId, friendUsername);
        var gameId = await _dbContext.AddGame(userPlayerId, friendPlayerId, timingId);


        var response = await _client.GetAsync($"api/game/{gameId}/opponent");


        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var result = JsonConvert.DeserializeObject<GetOpponentDto>(await response.Content.ReadAsStringAsync());
        result.OppeonetId.Should().Be(friendPlayerId);
    }

    /// <summary>
    /// Gets oppones from not user game
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async Task GetOpponent_Should_Return_BadRequest_On_Fail() {
        await _dbContext.Init();
        await _dbContext.AddUser();

        var timingId = await _dbContext.CreateTiming();
        await _dbContext.AddPlayerForUser();

        var gameId = await _dbContext.AddGame(Guid.NewGuid(), Guid.NewGuid(), timingId); // not user game


        var response = await _client.GetAsync($"api/game/{gameId}/opponent");


        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    /// <summary>
    /// Gets not existsing game
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async Task GetOpponent_Should_Return_NotFound_On_Fail() {

        await _dbContext.Init();
        await _dbContext.AddUser();
        await _dbContext.AddPlayerForUser();
        // game not added


        var response = await _client.GetAsync($"api/game/{Guid.NewGuid()}/opponent");


        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}
