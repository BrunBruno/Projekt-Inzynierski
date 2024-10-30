
using chess.Api.Tests.User;
using chess.Application.Pagination;
using chess.Application.Requests.WebGameRequests.GetAllActiveGames;
using chess.Core.Enums;
using chess.Infrastructure.Contexts;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Net;

namespace chess.Api.Tests.WebGame;

public class GetAllActiveGamesTests : IClassFixture<TestWebApplicationFactory<Program>> {

    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory<Program> _factory;
    private readonly ChessAppDbContext _dbContext;

    public GetAllActiveGamesTests() {
        _factory = new TestWebApplicationFactory<Program>();

        _client = _factory.CreateClient();

        var scopeFactory = _factory.Services.GetService<IServiceScopeFactory>()
            ?? throw new InvalidOperationException("IServiceScopeFactory not registered.");

        var scope = scopeFactory.CreateScope();
        _dbContext = scope.ServiceProvider.GetService<ChessAppDbContext>()
            ?? throw new InvalidOperationException("ChessAppDbContext not registered.");
    }

    [Fact]
    public async Task GetActiveGames_Should_Return_Paged_GameDtos_On_Success() {

        await _dbContext.Init();

        await _dbContext.AddGames(false, false);


        // without filters
        var responseFull1 = await _client.GetAsync($"api/webgame/all-ongoing?pageNumber=1&pageSize=20");
        var responseFull2 = await _client.GetAsync($"api/webgame/all-ongoing?pageNumber=1&pageSize=40");
        var responseFull3 = await _client.GetAsync($"api/webgame/all-ongoing?pageNumber=2&pageSize=20");


        responseFull1.StatusCode.Should().Be(HttpStatusCode.OK);
        var resultFull1 = JsonConvert.DeserializeObject<PagedResult<GetAllActiveGamesDto>>(await responseFull1.Content.ReadAsStringAsync());

        resultFull1.Items.Count.Should().Be(20);

        responseFull2.StatusCode.Should().Be(HttpStatusCode.OK);
        var resultFull2 = JsonConvert.DeserializeObject<PagedResult<GetAllActiveGamesDto>>(await responseFull2.Content.ReadAsStringAsync());

        resultFull2.Items.Count.Should().Be(40);

        responseFull3.StatusCode.Should().Be(HttpStatusCode.OK);
        var resultFull3 = JsonConvert.DeserializeObject<PagedResult<GetAllActiveGamesDto>>(await responseFull3.Content.ReadAsStringAsync());

        resultFull3.Items.Count.Should().Be(20);


        // type filters
        var responseWithTiming1 = await _client.GetAsync($"api/webgame/all-ongoing?pageNumber=1&pageSize=100&timingTypeFilters={TimingTypes.Rapid}");
        var responseWithTiming2 = await _client.GetAsync($"api/webgame/all-ongoing?pageNumber=1&pageSize=100&timingTypeFilters={TimingTypes.Rapid}&timingTypeFilters={TimingTypes.Rapid}");

        responseWithTiming1.StatusCode.Should().Be(HttpStatusCode.OK);
        var resultWithTiming1 = JsonConvert.DeserializeObject<PagedResult<GetAllActiveGamesDto>>(await responseWithTiming1.Content.ReadAsStringAsync());

        resultWithTiming1.Items.Count.Should().Be(50);

        responseWithTiming2.StatusCode.Should().Be(HttpStatusCode.OK);
        var resultWithTiming2 = JsonConvert.DeserializeObject<PagedResult<GetAllActiveGamesDto>>(await responseWithTiming2.Content.ReadAsStringAsync());

        resultWithTiming2.Items.Count.Should().Be(50);
    }
}