
using chess.Api.Models.EngineGameModels;
using chess.Api.Tests.User;
using chess.Infrastructure.Contexts;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Net;
using System.Text;

namespace chess.Api.Tests.EngineGame;

public class ChangeEngineLevelTests : IClassFixture<TestWebApplicationFactory<Program>> {

    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory<Program> _factory;
    private readonly ChessAppDbContext _dbContext;

    public ChangeEngineLevelTests() {
        _factory = new TestWebApplicationFactory<Program>();

        _client = _factory.CreateClient();

        var scopeFactory = _factory.Services.GetService<IServiceScopeFactory>()
            ?? throw new InvalidOperationException("IServiceScopeFactory not registered.");

        var scope = scopeFactory.CreateScope();
        _dbContext = scope.ServiceProvider.GetService<ChessAppDbContext>()
            ?? throw new InvalidOperationException("ChessAppDbContext not registered.");
    }

    [Fact]
    public async Task ChangeEngineLevel_Should_Update_EngineGame_On_Success() {

        await _dbContext.Init();
        await _dbContext.AddUser();

        var gameId = await _dbContext.AddEngineGameForUser();


        var model = new ChangeEngineLevelModel()
        {
            GameId = gameId,
            Level = 20,
        };

        var json = JsonConvert.SerializeObject(model);
        var httpContent = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _client.PutAsync($"api/enginegame/{gameId}/change-engine", httpContent);


        var assertDbContext = _factory.GetDbContextForAsserts();

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var game = await assertDbContext.EngineGames.FirstAsync();
        game.EngineLevel.Should().Be(20);
    }

    [Fact]
    public async Task ChangeEngineLevel_Should_Throw_NotFound_On_Fali() {

        await _dbContext.Init();
        await _dbContext.AddUser();

        // game not added
        var gameId = Guid.NewGuid();


        var model = new ChangeEngineLevelModel()
        {
            GameId = gameId,
            Level = 20,
        };

        var json = JsonConvert.SerializeObject(model);
        var httpContent = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _client.PutAsync($"api/enginegame/{gameId}/change-engine", httpContent);



        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task ChangeEngineLevel_Should_Throw_Unauthorized_On_Fail() {

        await _dbContext.Init();
        await _dbContext.AddUser();
        var otherUserId = await _dbContext.AddUserWithEmail("test@test.com");

        // game not for user
        var gameId = await _dbContext.AddEngineGame(otherUserId);


        var model = new ChangeEngineLevelModel()
        {
            GameId = gameId,
            Level = 20,
        };

        var json = JsonConvert.SerializeObject(model);
        var httpContent = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _client.PutAsync($"api/enginegame/{gameId}/change-engine", httpContent);


        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
}
