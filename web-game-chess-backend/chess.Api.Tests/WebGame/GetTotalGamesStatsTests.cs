
using chess.Api.Tests.User;
using chess.Application.Requests.WebGameRequests.GetTotalGamesStats;
using chess.Application.Requests.WebGameRequests.GetWebGamePlayer;
using chess.Core.Enums;
using chess.Infrastructure.Contexts;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Net;

namespace chess.Api.Tests.WebGame;

public class GetTotalGamesStatsTests : IClassFixture<TestWebApplicationFactory<Program>> {

    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory<Program> _factory;
    private readonly ChessAppDbContext _dbContext;

    public GetTotalGamesStatsTests() {
        _factory = new TestWebApplicationFactory<Program>();

        _client = _factory.CreateClient();

        var scopeFactory = _factory.Services.GetService<IServiceScopeFactory>()
            ?? throw new InvalidOperationException("IServiceScopeFactory not registered.");

        var scope = scopeFactory.CreateScope();
        _dbContext = scope.ServiceProvider.GetService<ChessAppDbContext>()
            ?? throw new InvalidOperationException("ChessAppDbContext not registered.");
    }

    [Fact]
    public async Task GetTotalGamesStats_Should_Get_Global_Data_On_Success() {

        await _dbContext.Init();

        await _dbContext.AddGames(false, false);

        var response = await _client.GetAsync($"api/webgame/stats");


        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var result = JsonConvert.DeserializeObject<GetTotalGamesStatsDto>(await response.Content.ReadAsStringAsync());
        result.GamesPlayed.Should().Be(100);
        result.UsersJoined.Should().Be(2);
    }
}
