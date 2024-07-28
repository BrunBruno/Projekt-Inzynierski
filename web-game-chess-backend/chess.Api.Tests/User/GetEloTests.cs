
using chess.Application.Requests.UserRequests.GetElo;
using chess.Infrastructure.Contexts;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Net;

namespace chess.Api.Tests.User;

public class GetEloTests : IClassFixture<TestWebApplicationFactory<Program>> {

    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory<Program> _factory;
    private readonly ChessAppDbContext _dbContext;

    public GetEloTests() {
        _factory = new TestWebApplicationFactory<Program>();

        _client = _factory.CreateClient();

        var scopeFactory = _factory.Services.GetService<IServiceScopeFactory>()
            ?? throw new InvalidOperationException("IServiceScopeFactory not registered.");

        var scope = scopeFactory.CreateScope();
        _dbContext = scope.ServiceProvider.GetService<ChessAppDbContext>()
            ?? throw new InvalidOperationException("ChessAppDbContext not registered.");
    }

    [Fact]
    public async Task GetElo_Should_Return_EloDto_On_Success() {

        await _dbContext.Init();
        await _dbContext.AddUser();
        await _dbContext.AddEloForUser();


        var response = await _client.GetAsync("api/user/elo");


        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var result = JsonConvert.DeserializeObject<GetEloDto>(await response.Content.ReadAsStringAsync());
        result.Bullet.Should().Be(1000);
    }

    /// <summary>
    /// Gets elo for non existing user
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async Task GetElo_Should_Return_NotFound_On_Fail() {

        await _dbContext.Init();
        await _dbContext.AddEloForUser();


        var response = await _client.GetAsync("api/user/elo");


        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}
