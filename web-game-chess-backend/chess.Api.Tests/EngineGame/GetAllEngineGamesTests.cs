
using chess.Api.Tests.User;
using chess.Application.Pagination;
using chess.Application.Requests.EngineRequests.GetAllEngineGames;
using chess.Infrastructure.Contexts;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Net;

namespace chess.Api.Tests.EngineGame;

public class GetAllEngineGamesTests : IClassFixture<TestWebApplicationFactory<Program>> {

    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory<Program> _factory;
    private readonly ChessAppDbContext _dbContext;

    public GetAllEngineGamesTests() {
        _factory = new TestWebApplicationFactory<Program>();

        _client = _factory.CreateClient();

        var scopeFactory = _factory.Services.GetService<IServiceScopeFactory>()
            ?? throw new InvalidOperationException("IServiceScopeFactory not registered.");

        var scope = scopeFactory.CreateScope();
        _dbContext = scope.ServiceProvider.GetService<ChessAppDbContext>()
            ?? throw new InvalidOperationException("ChessAppDbContext not registered.");
    }

    [Fact]
    public async Task GetAllEngineGames_Should_Return_Games_On_Success() {

        await _dbContext.Init();
        await _dbContext.AddUser();

        await _dbContext.AddManyEngineGamesForUser();

        var responseDefault = await _client.GetAsync($"api/enginegame/all-games?pageNumber=1&pageSize=20");

        responseDefault.StatusCode.Should().Be(HttpStatusCode.OK);
        var resultDefault = JsonConvert.DeserializeObject<PagedResult<GetAllEngineGamesDto>>(await responseDefault.Content.ReadAsStringAsync());

        resultDefault.Items.Count.Should().Be(10);

        var responseFilters = await _client.GetAsync($"api/enginegame/all-games?pageNumber=1&pageSize=20&resultFilters=true");

        responseFilters.StatusCode.Should().Be(HttpStatusCode.OK);
        var resultFilters = JsonConvert.DeserializeObject<PagedResult<GetAllEngineGamesDto>>(await responseFilters.Content.ReadAsStringAsync());

        resultFilters.Items.Count.Should().Be(5);
    }
}
