
using chess.Api.Tests.User;
using chess.Api.Tests.WebGame;
using chess.Application.Pagination;
using chess.Application.Requests.FriendshipRequests.GetGamesOfFriendship;
using chess.Core.Enums;
using chess.Infrastructure.Contexts;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Net;

namespace chess.Api.Tests.Friendship;

public class GetGamesOfFriendshipTests : IClassFixture<TestWebApplicationFactory<Program>> {

    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory<Program> _factory;
    private readonly ChessAppDbContext _dbContext;

    public GetGamesOfFriendshipTests() {
        _factory = new TestWebApplicationFactory<Program>();

        _client = _factory.CreateClient();

        var scopeFactory = _factory.Services.GetService<IServiceScopeFactory>()
            ?? throw new InvalidOperationException("IServiceScopeFactory not registered.");

        var scope = scopeFactory.CreateScope();
        _dbContext = scope.ServiceProvider.GetService<ChessAppDbContext>()
            ?? throw new InvalidOperationException("ChessAppDbContext not registered.");
    }

    [Fact]
    public async Task GetGamesOfFriendship_Returns_Games_On_Success() {

        var friendshipId = Guid.NewGuid();
        var friendId = Guid.NewGuid();

        await _dbContext.Init();

        await _dbContext.AddGames(true, false, friendId);
        await _dbContext.AddFriendship(friendshipId, friendId, Guid.Parse(Constants.UserId), FriendshipStatus.Accepted);


        var response = await _client.GetAsync($"api/friendship/{friendshipId}/games?pageNumber=1&pageSize=6&friendshipId={friendshipId}");


        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var result = JsonConvert.DeserializeObject<PagedResult<GetGamesOfFriendshipDto>>(await response.Content.ReadAsStringAsync());

        result.Items.Count.Should().Be(6);
    }
}
