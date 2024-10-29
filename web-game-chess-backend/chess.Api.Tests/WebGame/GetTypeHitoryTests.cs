
using chess.Api.Tests.User;
using chess.Application.Pagination;
using chess.Application.Requests.GameRequests.GetTypeHistory;
using chess.Core.Enums;
using chess.Infrastructure.Contexts;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Net;

namespace chess.Api.Tests.Game;

public class GetTypeHistoryTests : IClassFixture<TestWebApplicationFactory<Program>> {

    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory<Program> _factory;
    private readonly ChessAppDbContext _dbContext;

    public GetTypeHistoryTests() {
        _factory = new TestWebApplicationFactory<Program>();

        _client = _factory.CreateClient();

        var scopeFactory = _factory.Services.GetService<IServiceScopeFactory>()
            ?? throw new InvalidOperationException("IServiceScopeFactory not registered.");

        var scope = scopeFactory.CreateScope();
        _dbContext = scope.ServiceProvider.GetService<ChessAppDbContext>()
            ?? throw new InvalidOperationException("ChessAppDbContext not registered.");
    }

    [Fact]
    public async Task GetTypeHistory_Should_Return_Paged_TypeHistoryDto_On_Success() {

        await _dbContext.Init();

        await _dbContext.AddGames(true, false);


        var responseBullet = await _client.GetAsync($"api/game/type-history?pageNumber=1&pageSize=100&type={TimingTypes.Bullet}");
        var responseRapid = await _client.GetAsync($"api/game/type-history?pageNumber=1&pageSize=100&type={TimingTypes.Rapid}");


        responseBullet.StatusCode.Should().Be(HttpStatusCode.OK);
        var resultBullet = JsonConvert.DeserializeObject<PagedResult<GetTypeHistoryDto>>(await responseBullet.Content.ReadAsStringAsync());

        resultBullet.Items.Count.Should().Be(50);
        resultBullet.Items.First().PrevElo.Should().Be(1000);
        resultBullet.Items.Last().PrevElo.Should().Be(1250);
        // user wins 75% of games
        // 38 * 10 - 12 * 10 = 260
        // last win - prev 260 - 10 = 250


        responseRapid.StatusCode.Should().Be(HttpStatusCode.OK);
        var resultRapid = JsonConvert.DeserializeObject<PagedResult<GetTypeHistoryDto>>(await responseRapid.Content.ReadAsStringAsync());

        resultRapid.Items.Count.Should().Be(50);
        resultRapid.Items.First().PrevElo.Should().Be(1000);
        resultRapid.Items.Last().PrevElo.Should().Be(1230);
        // user wins 75% of games
        // 37 * 10 - 13 * 10 = 240
        // last win - prev 240 - 10 = 230
    }
}
