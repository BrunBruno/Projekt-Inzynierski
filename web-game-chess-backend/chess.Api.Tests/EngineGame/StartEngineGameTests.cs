
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
public class StartEngineGameTests : IClassFixture<TestWebApplicationFactory<Program>> {

    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory<Program> _factory;
    private readonly ChessAppDbContext _dbContext;

    public StartEngineGameTests() {
        _factory = new TestWebApplicationFactory<Program>();

        _client = _factory.CreateClient();

        var scopeFactory = _factory.Services.GetService<IServiceScopeFactory>()
            ?? throw new InvalidOperationException("IServiceScopeFactory not registered.");

        var scope = scopeFactory.CreateScope();
        _dbContext = scope.ServiceProvider.GetService<ChessAppDbContext>()
            ?? throw new InvalidOperationException("ChessAppDbContext not registered.");
    }

    [Fact]
    public async Task StartEngineGame_Should_Return_Create_Move_On_Success() {

        await _dbContext.Init();
        await _dbContext.AddUser();

        var model = new StartEngineGameModel()
        {
            EngineLevel = 5,
        };

        var json = JsonConvert.SerializeObject(model);
        var httpContent = new StringContent(json, Encoding.UTF8, "application/json");


        var response = await _client.PostAsync($"api/enginegame/start", httpContent);


        var assertDbContext = _factory.GetDbContextForAsserts();

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var game = await assertDbContext.EngineGames.FirstAsync();
        game.EngineLevel.Should().Be(5);
    }

    [Fact]
    public async Task StartEngineGame_Should_Throw_NotFound_On_Fail() {

        await _dbContext.Init();
        // user not added

        var model = new StartEngineGameModel()
        {
            EngineLevel = 5,
        };

        var json = JsonConvert.SerializeObject(model);
        var httpContent = new StringContent(json, Encoding.UTF8, "application/json");


        var response = await _client.PostAsync($"api/enginegame/start", httpContent);


        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}
