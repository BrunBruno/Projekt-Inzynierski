
using chess.Api.Tests.User;
using chess.Application.Requests.WebGameRequests.GetGameTiming;
using chess.Core.Enums;
using chess.Core.Models;
using chess.Infrastructure.Contexts;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Net;

namespace chess.Api.Tests.WebGame;

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

        var timingType = new TimingTypeModel() 
        { 
            Type = TimingTypes.Rapid,
            Minutes = 30,
            Increment = 10,
        };

        await _dbContext.Init();
        await _dbContext.AddUser();
        var otherUserId = await _dbContext.AddUserWithEmail("other@test.com");

        var timingId = await _dbContext.CreateTiming(timingType);

        var userPlayerId = await _dbContext.AddPlayer(Guid.Parse(Constants.UserId), Constants.Username);
        var otherPlayerId = await _dbContext.AddPlayer(otherUserId, "OtherPlayer");
        var gameId = await _dbContext.AddGame(userPlayerId, otherPlayerId, timingId, false);


        var response = await _client.GetAsync($"api/webgame/{gameId}/timing");


        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var result = JsonConvert.DeserializeObject<GetGameTimingDto>(await response.Content.ReadAsStringAsync());
        result.Type.Should().Be(timingType.Type);
        result.Minutes.Should().Be(timingType.Minutes);
        result.Increment.Should().Be(timingType.Increment);
    }

    /// <summary>
    /// Gets timing from not existing game
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async Task GetGameTiming_Should_Return_NotFound_On_Fail() {

        await _dbContext.Init();
        await _dbContext.AddUser();

        await _dbContext.CreateTiming(new TimingTypeModel() { 
            Type = TimingTypes.Rapid,
            Minutes = 30,
            Increment = 10,
        });

        await _dbContext.AddPlayer(Guid.Parse(Constants.UserId), Constants.Username);
        // game not added


        var response = await _client.GetAsync($"api/webgame/{Guid.NewGuid()}/timing");


        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}
