
using chess.Api.Tests.User;
using chess.Application.Requests.EngineRequests.GetEngineGameMove;
using chess.Infrastructure.Contexts;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Net;

namespace chess.Api.Tests.EngineGame;

public class GetEngineGameMoveTests : IClassFixture<TestWebApplicationFactory<Program>> {

    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory<Program> _factory;
    private readonly ChessAppDbContext _dbContext;

    public GetEngineGameMoveTests() {
        _factory = new TestWebApplicationFactory<Program>();

        _client = _factory.CreateClient();

        var scopeFactory = _factory.Services.GetService<IServiceScopeFactory>()
            ?? throw new InvalidOperationException("IServiceScopeFactory not registered.");

        var scope = scopeFactory.CreateScope();
        _dbContext = scope.ServiceProvider.GetService<ChessAppDbContext>()
            ?? throw new InvalidOperationException("ChessAppDbContext not registered.");
    }

    [Fact]
    public async Task GetEngineGameMove_Should_Get_Move_On_Success() {

        await _dbContext.Init();
        await _dbContext.AddUser();

        var gameId = await _dbContext.AddEngineGameForUser();


        var response = await _client.GetAsync($"api/enginegame/{gameId}/engine-move");

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var result = JsonConvert.DeserializeObject<GetEngineGameMoveDto>(await response.Content.ReadAsStringAsync());
        result.ShouldEnd.Should().BeFalse();
    }

    [Fact]
    public async Task GetEngineGameMove_Should_Throw_NotFound_On_Fail() {

        await _dbContext.Init();
        await _dbContext.AddUser();

        // game not added
        var gameId = Guid.NewGuid();


        var response = await _client.GetAsync($"api/enginegame/{gameId}/engine-move");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task GetEngineGameMove_Should_Throw_Unauthorized_On_Fail() {

        await _dbContext.Init();
        await _dbContext.AddUser();
        var otherUserId = await _dbContext.AddUserWithEmail("test@test.com");


        // game added for other user
        var gameId = await _dbContext.AddEngineGame(otherUserId);


        var response = await _client.GetAsync($"api/enginegame/{gameId}/engine-move");

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task GetEngineGameMove_Should_Throw_InternalServerError_On_Fail() {

        await _dbContext.Init();
        await _dbContext.AddUser();

        // game with incorrect position to get error by engine service
        var gameId = await _dbContext.AddEngineGameWithWrongPosition();

        var response = await _client.GetAsync($"api/enginegame/{gameId}/engine-move");

        response.StatusCode.Should().Be(HttpStatusCode.InternalServerError);
    }
}
