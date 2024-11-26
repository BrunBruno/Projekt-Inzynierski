
using chess.Api.Models.WebGameModels;
using chess.Api.Tests.User;
using chess.Application.Requests.WebGameRequests.SearchWebGame;
using chess.Core.Enums;
using chess.Infrastructure.Contexts;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Net;
using System.Text;

namespace chess.Api.Tests.WebGame;

public class StartSearchTests : IClassFixture<TestWebApplicationFactory<Program>> {

    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory<Program> _factory;
    private readonly ChessAppDbContext _dbContext;

    public StartSearchTests() {
        _factory = new TestWebApplicationFactory<Program>();

        _client = _factory.CreateClient();

        var scopeFactory = _factory.Services.GetService<IServiceScopeFactory>()
            ?? throw new InvalidOperationException("IServiceScopeFactory not registered.");

        var scope = scopeFactory.CreateScope();
        _dbContext = scope.ServiceProvider.GetService<ChessAppDbContext>()
            ?? throw new InvalidOperationException("ChessAppDbContext not registered.");
    }

    [Fact]
    public async Task StartSearch_Should_Create_Player_And_Return_Ids_On_Success() {

        await _dbContext.Init();
        await _dbContext.AddUser();

        var model = new SearchWebGameModel()
        {
            Type = TimingTypes.Rapid,
            Minutes = 10,
            Increment = 0,
        };

        var json = JsonConvert.SerializeObject(model);
        var httpContent = new StringContent(json, Encoding.UTF8, "application/json");


        var response = await _client.PostAsync("api/webgame/search", httpContent);


        var assertDbContext = _factory.GetDbContextForAsserts();

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var result = JsonConvert.DeserializeObject<SearchWebGameDto>(await response.Content.ReadAsStringAsync());

        var player = await assertDbContext.WebGamePlayers.FirstAsync();
        player.Id.Should().Be(result.PlayerId);

        var gameTiming = await assertDbContext.GameTimings.FirstAsync();
        gameTiming.Id.Should().Be(result.TimingId);
        gameTiming.Type.Should().Be(model.Type);
    }

    /// <summary>
    /// Search for non existing user
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async Task StartSearch_Should_Return_NotFound_On_Fail() {

        await _dbContext.Init();

        var model = new SearchWebGameModel()
        {
            Type = TimingTypes.Rapid,
            Minutes = 10,
            Increment = 0,
        };

        var json = JsonConvert.SerializeObject(model);
        var httpContent = new StringContent(json, Encoding.UTF8, "application/json");


        var response = await _client.PostAsync("api/webgame/search", httpContent);


        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}
