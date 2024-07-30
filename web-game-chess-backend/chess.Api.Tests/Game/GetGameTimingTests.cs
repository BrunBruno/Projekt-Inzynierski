
using chess.Api.Tests.User;
using chess.Application.Requests.GameRequests.GetGameTiming;
using chess.Core.Enums;
using chess.Infrastructure.Contexts;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Net;

namespace chess.Api.Tests.Game;

public class GetGameTimingTests : IClassFixture<TestWebApplicationFactory<Program>> {

    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory<Program> _factory;
    private readonly ChessAppDbContext _dbContext;

    public GetGameTimingTests() {
        _factory = new TestWebApplicationFactory<Program>();

        _client = _factory.CreateClient();

        var scopeFactory = _factory.Services.GetService<IServiceScopeFactory>()
            ?? throw new InvalidOperationException("IServiceScopeFactory not registered.");

        var scope = scopeFactory.CreateScope();
        _dbContext = scope.ServiceProvider.GetService<ChessAppDbContext>()
            ?? throw new InvalidOperationException("ChessAppDbContext not registered.");
    }

    [Fact]
    public async Task GetGameTiming_Should_Return_TimingDto_On_Success() {

        await _dbContext.Init();
        await _dbContext.AddUser();

        var timingId = await _dbContext.CreateTiming();
        var userPlayerId = await _dbContext.AddPlayerForUser();
        var gameId = await _dbContext.AddGame(userPlayerId, Guid.NewGuid(), timingId);


        var response = await _client.GetAsync($"api/game/{gameId}/timing");


        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var result = JsonConvert.DeserializeObject<GetGameTimingDto>(await response.Content.ReadAsStringAsync());
        result.Type.Should().Be(TimingTypes.Rapid);
    }

    /// <summary>
    /// Gets timing from not owned game 
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async Task GetGameTiming_Should_Return_BadRequest_On_Fail() {

        await _dbContext.Init();
        await _dbContext.AddUser();

        var timingId = await _dbContext.CreateTiming();
        await _dbContext.AddPlayerForUser();
        var gameId = await _dbContext.AddGame(Guid.NewGuid(), Guid.NewGuid(), timingId); // not owned game


        var response = await _client.GetAsync($"api/game/{gameId}/timing");


        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    /// <summary>
    /// Gets timing from not exissting game
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async Task GetGameTiming_Should_Return_NotFound_On_Fail() {

        await _dbContext.Init();
        await _dbContext.AddUser();

        await _dbContext.CreateTiming();
        await _dbContext.AddPlayerForUser();
        // game not added


        var response = await _client.GetAsync($"api/game/{Guid.NewGuid()}/timing");


        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}
