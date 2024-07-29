
using chess.Api.Tests.User;
using chess.Application.Pagination;
using chess.Application.Requests.FriendshipRequests.GetAllNonFriends;
using chess.Infrastructure.Contexts;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Net;

namespace chess.Api.Tests.Friendship;

public class GetAllNonFriendsTests : IClassFixture<TestWebApplicationFactory<Program>> {

    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory<Program> _factory;
    private readonly ChessAppDbContext _dbContext;

    public GetAllNonFriendsTests() {
        _factory = new TestWebApplicationFactory<Program>();

        _client = _factory.CreateClient();

        var scopeFactory = _factory.Services.GetService<IServiceScopeFactory>()
            ?? throw new InvalidOperationException("IServiceScopeFactory not registered.");

        var scope = scopeFactory.CreateScope();
        _dbContext = scope.ServiceProvider.GetService<ChessAppDbContext>()
            ?? throw new InvalidOperationException("ChessAppDbContext not registered.");
    }

    [Fact]
    public async Task GetAllNonFriends_Should_Return_Users_On_Success() {

        await _dbContext.Init();
        await _dbContext.AddUser();
        await _dbContext.AddUsersAndFreindships();

        var respionse = await _client.GetAsync("api/friendship/all-non-friends?pageNumber=1&pageSize=20");
        var responseWithName = await _client.GetAsync("api/friendship/all-non-friends?pageNumber=1&pageSize=20&Username=friend");

        respionse.StatusCode.Should().Be(HttpStatusCode.OK);
        var result = JsonConvert.DeserializeObject<PagedResult<GetAllNonFriendsDto>>(await respionse.Content.ReadAsStringAsync());

        result.TotalItemsCount.Should().Be(9);


        responseWithName.StatusCode.Should().Be(HttpStatusCode.OK);
        var resultWithName = JsonConvert.DeserializeObject<PagedResult<GetAllNonFriendsDto>>(await responseWithName.Content.ReadAsStringAsync());

        resultWithName.TotalItemsCount.Should().Be(1);
        resultWithName.Items.First().Username.Should().Be("friend");
    }
}
