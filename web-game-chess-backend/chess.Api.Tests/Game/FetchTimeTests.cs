
using chess.Api.Tests.User;
using chess.Application.Requests.Abstraction;
using chess.Application.Requests.GameRequests.FetchTime;
using chess.Core.Enums;
using chess.Infrastructure.Contexts;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Net;

namespace chess.Api.Tests.Game;

public class FetchTimeTests : IClassFixture<TestWebApplicationFactory<Program>> {

    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory<Program> _factory;
    private readonly ChessAppDbContext _dbContext;

    public FetchTimeTests() {
        _factory = new TestWebApplicationFactory<Program>();

        _client = _factory.CreateClient();

        var scopeFactory = _factory.Services.GetService<IServiceScopeFactory>()
            ?? throw new InvalidOperationException("IServiceScopeFactory not registered.");

        var scope = scopeFactory.CreateScope();
        _dbContext = scope.ServiceProvider.GetService<ChessAppDbContext>()
            ?? throw new InvalidOperationException("ChessAppDbContext not registered.");
    }

    [Fact]
    public async Task FetchTime_Should_Return_TimeDto_On_Success() {

        var timingType = new TimingType()
        {
            Type = TimingTypes.Daily,
            Minutes = 24 * 60,
            Increment = 0,
        };

        await _dbContext.Init();
        await _dbContext.AddUser();
        await _dbContext.AddUserWithEmail("freind@test.com");

        var timingId = await _dbContext.CreateTiming(timingType);

        var userPlayerId = await _dbContext.AddPlayer(Guid.Parse(Constants.UserId), Constants.Username);
        var friendPlayerId = await _dbContext.AddPlayer(Guid.NewGuid(), "FriendUsername");

        var gameId = await _dbContext.AddGame(userPlayerId, friendPlayerId, timingId);
        await _dbContext.StartGame(gameId);


        var response = await _client.GetAsync($"api/game/{gameId}/time");


        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var result = JsonConvert.DeserializeObject<FetchTimeDto>(await response.Content.ReadAsStringAsync());
        result.WhiteTimeLeft.Should().BeGreaterThan(0);
        result.BlackTimeLeft.Should().BeGreaterThan(0);

        result.WhiteTimeLeft.Should().BeApproximately(timingType.Minutes * 60, 1);
    }

    /// <summary>
    /// Fetch time for not started game
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async Task FetchTime_Should_Return_BadRequest_On_Fail() {

        await _dbContext.Init();
        await _dbContext.AddUser();
        await _dbContext.AddUserWithEmail("freind@test.com");

        var timingId = await _dbContext.CreateTiming(new TimingType() {
            Type = TimingTypes.Daily,
            Minutes = 24 * 60,
            Increment = 0,
        });

        var userPlayerId = await _dbContext.AddPlayer(Guid.Parse(Constants.UserId), Constants.Username);
        var friendPlayerId = await _dbContext.AddPlayer(Guid.NewGuid(), "FriendUsername");

        var gameId = await _dbContext.AddGame(userPlayerId, friendPlayerId, timingId);
        // no game start


        var response = await _client.GetAsync($"api/game/{gameId}/time");


        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    /// <summary>
    /// Get time from not existsing game
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async Task FetchTime_Should_Return_NotFound_On_Fail() {

        await _dbContext.Init();
        await _dbContext.AddUser();
        await _dbContext.AddPlayer(Guid.Parse(Constants.UserId), Constants.Username);

        await _dbContext.CreateTiming(new TimingType() {
            Type = TimingTypes.Daily,
            Minutes = 24 * 60,
            Increment = 0,
        });

        // no game added


        var response = await _client.GetAsync($"api/game/{Guid.NewGuid()}/time");


        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}
