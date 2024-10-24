
using chess.Api.Tests.User;
using chess.Application.Pagination;
using chess.Application.Requests.GameRequests.GetAllInvitations;
using chess.Infrastructure.Contexts;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Net;

namespace chess.Api.Tests.Game;

public class GetAllInvitationsTests : IClassFixture<TestWebApplicationFactory<Program>> {

    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory<Program> _factory;
    private readonly ChessAppDbContext _dbContext;

    public GetAllInvitationsTests() {
        _factory = new TestWebApplicationFactory<Program>();

        _client = _factory.CreateClient();

        var scopeFactory = _factory.Services.GetService<IServiceScopeFactory>()
            ?? throw new InvalidOperationException("IServiceScopeFactory not registered.");

        var scope = scopeFactory.CreateScope();
        _dbContext = scope.ServiceProvider.GetService<ChessAppDbContext>()
            ?? throw new InvalidOperationException("ChessAppDbContext not registered.");
    }

    [Fact]
    public async Task GetAllInvitations_Should_Return_Paged_InvitationDtos_On_Success() {

        await _dbContext.Init();

        await _dbContext.AddGames(false, true);


        var response1 = await _client.GetAsync($"api/game/invitations?pageNumber=1&pageSize=20");
        var response2 = await _client.GetAsync($"api/game/invitations?pageNumber=1&pageSize=50");
        var response3 = await _client.GetAsync($"api/game/invitations?pageNumber=4&pageSize=10");


        response1.StatusCode.Should().Be(HttpStatusCode.OK);
        var result1 = JsonConvert.DeserializeObject<PagedResult<GetAllInvitationsDto>>(await response1.Content.ReadAsStringAsync());

        result1.Items.Count.Should().Be(20);
        result1.TotalItemsCount.Should().Be(50);
        result1.TotalPages.Should().Be(3);
        result1.ItemsFrom.Should().Be(1);
        result1.ItemsTo.Should().Be(20);


        response2.StatusCode.Should().Be(HttpStatusCode.OK);
        var result2 = JsonConvert.DeserializeObject<PagedResult<GetAllInvitationsDto>>(await response2.Content.ReadAsStringAsync());

        result2.Items.Count.Should().Be(50);
        result2.TotalItemsCount.Should().Be(50);
        result2.TotalPages.Should().Be(1);
        result2.ItemsFrom.Should().Be(1);
        result2.ItemsTo.Should().Be(50);


        response3.StatusCode.Should().Be(HttpStatusCode.OK);
        var result3 = JsonConvert.DeserializeObject<PagedResult<GetAllInvitationsDto>>(await response3.Content.ReadAsStringAsync());

        result3.Items.Count.Should().Be(10);
        result3.TotalItemsCount.Should().Be(50);
        result3.TotalPages.Should().Be(5);
        result3.ItemsFrom.Should().Be(31);
        result3.ItemsTo.Should().Be(40);
    }
}
