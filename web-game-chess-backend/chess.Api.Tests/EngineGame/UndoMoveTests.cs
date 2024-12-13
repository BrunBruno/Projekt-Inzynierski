
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

public class UndoMoveTests : IClassFixture<TestWebApplicationFactory<Program>> {

    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory<Program> _factory;
    private readonly ChessAppDbContext _dbContext;

    public UndoMoveTests() {
        _factory = new TestWebApplicationFactory<Program>();

        _client = _factory.CreateClient();

        var scopeFactory = _factory.Services.GetService<IServiceScopeFactory>()
            ?? throw new InvalidOperationException("IServiceScopeFactory not registered.");

        var scope = scopeFactory.CreateScope();
        _dbContext = scope.ServiceProvider.GetService<ChessAppDbContext>()
            ?? throw new InvalidOperationException("ChessAppDbContext not registered.");
    }

    [Fact]
    public async Task UndoMove_Should_Update_Moves_On_Success() {

        await _dbContext.Init();
        await _dbContext.AddUser();

        var gameId = await _dbContext.AddEngineGameForUser();
        await _dbContext.AddMovesToEngineGame(gameId);

        var model = new UndoMoveModel() {  
            GameId = gameId,
        };

        var json = JsonConvert.SerializeObject(model);
        var httpContent = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _client.PutAsync($"api/enginegame/{gameId}/undo-move", httpContent);

        var assertDbContext = _factory.GetDbContextForAsserts();

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var game = await assertDbContext.EngineGames.Include(eg => eg.Moves).FirstAsync();
        game.Moves.Count.Should().Be(3); // 5
    }

    [Fact]
    public async Task UndoMove_Should_Throw_NotFound_On_Fail() {

        await _dbContext.Init();
        await _dbContext.AddUser();

        // game not added
        var gameId = Guid.NewGuid();

        var model = new UndoMoveModel()
        {
            GameId = gameId,
        };

        var json = JsonConvert.SerializeObject(model);
        var httpContent = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _client.PutAsync($"api/enginegame/{gameId}/undo-move", httpContent);


        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task UndoMove_Should_Throw_Unauthorized_On_Fail() {

        await _dbContext.Init();
        await _dbContext.AddUser();
        var otherUserId = await _dbContext.AddUserWithEmail("test@test.com");

        // game not added
        var gameId = await _dbContext.AddEngineGame(otherUserId);
        await _dbContext.AddMovesToEngineGame(gameId);

        var model = new UndoMoveModel()
        {
            GameId = gameId,
        };

        var json = JsonConvert.SerializeObject(model);
        var httpContent = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _client.PutAsync($"api/enginegame/{gameId}/undo-move", httpContent);


        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task UndoMove_Should_Throw_BadRequest_On_Fail() {

        await _dbContext.Init();
        await _dbContext.AddUser();

        var gameId = await _dbContext.AddEngineGameForUser();
        // moves not added

        var model = new UndoMoveModel()
        {
            GameId = gameId,
        };

        var json = JsonConvert.SerializeObject(model);
        var httpContent = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _client.PutAsync($"api/enginegame/{gameId}/undo-move", httpContent);


        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

}
