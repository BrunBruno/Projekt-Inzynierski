
using chess.Api.Tests.User;
using chess.Application.Pagination;
using chess.Application.Requests.GameRequests.GetAllFinishedGames;
using chess.Core.Enums;
using chess.Infrastructure.Contexts;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Net;

namespace chess.Api.Tests.Game;

public class GetAllFinishedGamesTests : IClassFixture<TestWebApplicationFactory<Program>> {

    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory<Program> _factory;
    private readonly ChessAppDbContext _dbContext;

    public GetAllFinishedGamesTests() {
        _factory = new TestWebApplicationFactory<Program>();

        _client = _factory.CreateClient();

        var scopeFactory = _factory.Services.GetService<IServiceScopeFactory>()
            ?? throw new InvalidOperationException("IServiceScopeFactory not registered.");

        var scope = scopeFactory.CreateScope();
        _dbContext = scope.ServiceProvider.GetService<ChessAppDbContext>()
            ?? throw new InvalidOperationException("ChessAppDbContext not registered.");
    }

    [Fact]
    public async Task GetFinishedGames_Should_Return_Paged_GameDtos_On_Success() {

        await _dbContext.Init();
        await _dbContext.AddUser();

        await _dbContext.AddGames(true, false);


        // without filters
        var responseFull1 = await _client.GetAsync($"api/game/all-finished?pageNumber=1&pageSize=20");
        var responseFull2 = await _client.GetAsync($"api/game/all-finished?pageNumber=1&pageSize=40");
        var responseFull3 = await _client.GetAsync($"api/game/all-finished?pageNumber=2&pageSize=20");


        responseFull1.StatusCode.Should().Be(HttpStatusCode.OK);
        var resultFull1 = JsonConvert.DeserializeObject<PagedResult<GetAllFinishedGamesDto>>(await responseFull1.Content.ReadAsStringAsync());

        resultFull1.Items.Count.Should().Be(20);

        responseFull2.StatusCode.Should().Be(HttpStatusCode.OK);
        var resultFull2 = JsonConvert.DeserializeObject<PagedResult<GetAllFinishedGamesDto>>(await responseFull2.Content.ReadAsStringAsync());

        resultFull2.Items.Count.Should().Be(40);

        responseFull3.StatusCode.Should().Be(HttpStatusCode.OK);
        var resultFull3 = JsonConvert.DeserializeObject<PagedResult<GetAllFinishedGamesDto>>(await responseFull3.Content.ReadAsStringAsync());

        resultFull3.Items.Count.Should().Be(20);


        // type filters
        var responseWithTiming1 = await _client.GetAsync($"api/game/all-finished?pageNumber=1&pageSize=100&timingTypeFilters={ TimingTypes.Rapid }");
        var responseWithTiming2 = await _client.GetAsync($"api/game/all-finished?pageNumber=1&pageSize=100&timingTypeFilters={ TimingTypes.Rapid }&timingTypeFilters={ TimingTypes.Rapid }");

        responseWithTiming1.StatusCode.Should().Be(HttpStatusCode.OK);
        var resultWithTiming1 = JsonConvert.DeserializeObject<PagedResult<GetAllFinishedGamesDto>>(await responseWithTiming1.Content.ReadAsStringAsync());

        resultWithTiming1.Items.Count.Should().Be(50);

        responseWithTiming2.StatusCode.Should().Be(HttpStatusCode.OK);
        var resultWithTiming2 = JsonConvert.DeserializeObject<PagedResult<GetAllFinishedGamesDto>>(await responseWithTiming2.Content.ReadAsStringAsync());

        resultWithTiming2.Items.Count.Should().Be(50);


        // result filters
        var responseWithResult1 = await _client.GetAsync($"api/game/all-finished?pageNumber=1&pageSize=100&resultFilters=true");
        var responseWithResult2 = await _client.GetAsync($"api/game/all-finished?pageNumber=1&pageSize=100&resultFilters=true&resultFilters=false");


        responseWithResult1.StatusCode.Should().Be(HttpStatusCode.OK);
        var resultWithResult1 = JsonConvert.DeserializeObject<PagedResult<GetAllFinishedGamesDto>>(await responseWithResult1.Content.ReadAsStringAsync());

        resultWithResult1.Items.Count.Should().Be(75);


        responseWithResult2.StatusCode.Should().Be(HttpStatusCode.OK);
        var resultWithResult2 = JsonConvert.DeserializeObject<PagedResult<GetAllFinishedGamesDto>>(await responseWithResult2.Content.ReadAsStringAsync());

        resultWithResult2.Items.Count.Should().Be(100);


        // all filters
        var responseWithFilter = await _client.GetAsync($"api/game/all-finished?pageNumber=1&pageSize=100&timingTypeFilters={ TimingTypes.Rapid }&resultFilters=true");

        responseWithFilter.StatusCode.Should().Be(HttpStatusCode.OK);
        var resultWithFilters = JsonConvert.DeserializeObject<PagedResult<GetAllFinishedGamesDto>>(await responseWithFilter.Content.ReadAsStringAsync());

        resultWithFilters.Items.Count.Should().Be(37);
    }
}