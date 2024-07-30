
using chess.Api.Tests.User;
using chess.Application.Requests.GameRequests.GetPlayer;
using chess.Core.Enums;
using chess.Infrastructure.Contexts;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Net;

namespace chess.Api.Tests.Game;

public class GetPlayerTests : IClassFixture<TestWebApplicationFactory<Program>> {

    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory<Program> _factory;
    private readonly ChessAppDbContext _dbContext;

    public GetPlayerTests() {
        _factory = new TestWebApplicationFactory<Program>();

        _client = _factory.CreateClient();

        var scopeFactory = _factory.Services.GetService<IServiceScopeFactory>()
            ?? throw new InvalidOperationException("IServiceScopeFactory not registered.");

        var scope = scopeFactory.CreateScope();
        _dbContext = scope.ServiceProvider.GetService<ChessAppDbContext>()
            ?? throw new InvalidOperationException("ChessAppDbContext not registered.");
    }

    [Fact]
    public async Task GetPlayer_Should_Return_PlayerDto_On_Success() {

        await _dbContext.Init();
        await _dbContext.AddUser();

        var timingId = await _dbContext.CreateTiming();
        var playerId = await _dbContext.AddPlayerForUser();
        var gameId = await _dbContext.AddGame(playerId, Guid.NewGuid(), timingId);

        await _dbContext.AddPlayerToGame(playerId, gameId);
        await _dbContext.UpdatePlayer(playerId);


        var response = await _client.GetAsync($"api/game/{gameId}/player");


        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var result = JsonConvert.DeserializeObject<GetPlayerDto>(await response.Content.ReadAsStringAsync());
        result.Name.Should().Be("TestUserName");
        result.Color.Should().Be(Colors.White);
    }

    /// <summary>
    /// Get player for not updated player
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async Task GetPlayer_Should_Return_BadRequest_On_Fail() {

        await _dbContext.Init();
        await _dbContext.AddUser();

        var timingId = await _dbContext.CreateTiming();
        var playerId = await _dbContext.AddPlayerForUser();
        var gameId = await _dbContext.AddGame(playerId, Guid.NewGuid(), timingId);

        await _dbContext.AddPlayerToGame(playerId, gameId);
        // no user update


        var response = await _client.GetAsync($"api/game/{gameId}/player");


        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    /// <summary>
    /// Get player from game that not belong to user
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async Task GetPlayer_Should_Return_NotFound_On_Fail() {

        await _dbContext.Init();
        await _dbContext.AddUser();

        var timingId = await _dbContext.CreateTiming();
        await _dbContext.AddPlayerForUser();

        var gameId = await _dbContext.AddGame(Guid.NewGuid(), Guid.NewGuid(), timingId); // game with other players


        var response = await _client.GetAsync($"api/game/{gameId}/player");


        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}
