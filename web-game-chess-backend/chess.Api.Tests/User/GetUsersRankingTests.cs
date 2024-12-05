
using chess.Application.Pagination;
using chess.Core.Enums;
using chess.Infrastructure.Contexts;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Net;

namespace chess.Api.Tests.User;

public class GetUsersRankingTests : IClassFixture<TestWebApplicationFactory<Program>> {

    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory<Program> _factory;
    private readonly ChessAppDbContext _dbContext;

    public GetUsersRankingTests() {
        _factory = new TestWebApplicationFactory<Program>();

        _client = _factory.CreateClient();

        var scopeFactory = _factory.Services.GetService<IServiceScopeFactory>()
            ?? throw new InvalidOperationException("IServiceScopeFactory not registered.");

        var scope = scopeFactory.CreateScope();
        _dbContext = scope.ServiceProvider.GetService<ChessAppDbContext>()
            ?? throw new InvalidOperationException("ChessAppDbContext not registered.");
    }

    [Fact]
    public async Task GetFriendshipRanking_Should_Return_Ranking_On_Success() {

        await _dbContext.Init();
        await _dbContext.AddUser(true);

        var response = await _client.GetAsync($"api/user/ranking?pageNumber=1&pageSize=10&Type={TimingTypes.Rapid}");


        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var result = JsonConvert.DeserializeObject<PagedResult<GetUsersRankingTests>>(await response.Content.ReadAsStringAsync());

        result.Items.Count.Should().Be(1);

    }
}
