
using chess.Api.Tests.User;
using chess.Application.Requests.EngineRequests.GetAllEngineGameMessages;
using chess.Infrastructure.Contexts;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Net;

namespace chess.Api.Tests.EngineGame;

public class GetAllEngineGameMessagesTests : IClassFixture<TestWebApplicationFactory<Program>> {

    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory<Program> _factory;
    private readonly ChessAppDbContext _dbContext;

    public GetAllEngineGameMessagesTests() {
        _factory = new TestWebApplicationFactory<Program>();

        _client = _factory.CreateClient();

        var scopeFactory = _factory.Services.GetService<IServiceScopeFactory>()
            ?? throw new InvalidOperationException("IServiceScopeFactory not registered.");

        var scope = scopeFactory.CreateScope();
        _dbContext = scope.ServiceProvider.GetService<ChessAppDbContext>()
            ?? throw new InvalidOperationException("ChessAppDbContext not registered.");
    }

    [Fact]
    public async Task GetAllEngineGameMessages_Should_Return_Messages_On_Success() {

        await _dbContext.Init();
        await _dbContext.AddUser();

        var gameId = await _dbContext.AddEngineGameForUser();
        await _dbContext.AddMessagesToEngineGame(gameId);

        var response = await _client.GetAsync($"api/enginegame/{gameId}/all-messages");
        

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var result = JsonConvert.DeserializeObject<List<GetAllEngineGameMessagesDto>>(await response.Content.ReadAsStringAsync());

        result.Count.Should().Be(5);
    }

    [Fact]
    public async Task GetAllEngineGameMessages_Should_Throw_NotFound_On_Fail() {

        await _dbContext.Init();
        await _dbContext.AddUser();

        // game not added
        var gameId = Guid.NewGuid();

        var response = await _client.GetAsync($"api/enginegame/{gameId}/all-messages");


        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task GetAllEngineGameMessages_Should_Throw_Unauthorized_On_Fail() {

        await _dbContext.Init();
        await _dbContext.AddUser();
        var otherUserId = await _dbContext.AddUserWithEmail("test@test.com");

        // game for other user
        var gameId = await _dbContext.AddEngineGame(otherUserId);
        await _dbContext.AddMessagesToEngineGame(gameId);

        var response = await _client.GetAsync($"api/enginegame/{gameId}/all-messages");


        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
}
