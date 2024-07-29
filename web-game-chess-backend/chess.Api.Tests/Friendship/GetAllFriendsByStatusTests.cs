
using chess.Api.Tests.User;
using chess.Application.Pagination;
using chess.Application.Requests.FriendshipRequests.GetAllFriendsByStatus;
using chess.Core.Enums;
using chess.Infrastructure.Contexts;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Net;

namespace chess.Api.Tests.Friendship;

public class GetAllFriendsByStatusTests : IClassFixture<TestWebApplicationFactory<Program>> {

    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory<Program> _factory;
    private readonly ChessAppDbContext _dbContext;

    public GetAllFriendsByStatusTests() {
        _factory = new TestWebApplicationFactory<Program>();

        _client = _factory.CreateClient();

        var scopeFactory = _factory.Services.GetService<IServiceScopeFactory>()
            ?? throw new InvalidOperationException("IServiceScopeFactory not registered.");

        var scope = scopeFactory.CreateScope();
        _dbContext = scope.ServiceProvider.GetService<ChessAppDbContext>()
            ?? throw new InvalidOperationException("ChessAppDbContext not registered.");
    }

    [Fact]
    public async Task GetAllFriendsByStatus_Should_Return_Users_On_Success() {

        await _dbContext.Init();
        await _dbContext.AddUser();
        await _dbContext.AddUsersAndFreindships();

        var responseForAccepted = await _client.GetAsync($"api/friendship/all-by-status?pageNumber=1&pageSize=20&Status={FriendshipStatus.Accepted}");
        var responseForPending = await _client.GetAsync($"api/friendship/all-by-status?pageNumber=1&pageSize=20&Status={FriendshipStatus.Pending}");
        var responseForRejected = await _client.GetAsync($"api/friendship/all-by-status?pageNumber=1&pageSize=20&Status={FriendshipStatus.Rejected}");

        responseForAccepted.StatusCode.Should().Be(HttpStatusCode.OK);
        var resultForAccepted = JsonConvert.DeserializeObject<PagedResult<GetAllFriendsByStatusDto>>(await responseForAccepted.Content.ReadAsStringAsync());

        resultForAccepted.TotalItemsCount.Should().Be(10);


        responseForPending.StatusCode.Should().Be(HttpStatusCode.OK);
        var resultForPending = JsonConvert.DeserializeObject<PagedResult<GetAllFriendsByStatusDto>>(await responseForPending.Content.ReadAsStringAsync());

        resultForPending.TotalItemsCount.Should().Be(0);

        responseForRejected.StatusCode.Should().Be(HttpStatusCode.OK);
        var resultForRejected = JsonConvert.DeserializeObject<PagedResult<GetAllFriendsByStatusDto>>(await responseForRejected.Content.ReadAsStringAsync());

        resultForRejected.TotalItemsCount.Should().Be(1);
    }
}
