
using chess.Api.Tests.User;
using chess.Application.Pagination;
using chess.Application.Requests.FriendshipRequests.GetAllFriendsByStatus;
using chess.Application.Requests.FriendshipRequests.GetFriendshipRanking;
using chess.Core.Enums;
using chess.Infrastructure.Contexts;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Net;

namespace chess.Api.Tests.Friendship;

public class GetFriendshipRankingTests : IClassFixture<TestWebApplicationFactory<Program>> {

    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory<Program> _factory;
    private readonly ChessAppDbContext _dbContext;

    public GetFriendshipRankingTests() {
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
        await _dbContext.AddUser();
        await _dbContext.AddUsersAndFriendships();

        var response = await _client.GetAsync($"api/friendship/ranking?pageNumber=1&pageSize=10&Type={TimingTypes.Rapid}");


        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var result = JsonConvert.DeserializeObject<PagedResult<GetFriendshipRankingDto>>(await response.Content.ReadAsStringAsync());

        result.Items.Count.Should().Be(10);
 
    }
}
