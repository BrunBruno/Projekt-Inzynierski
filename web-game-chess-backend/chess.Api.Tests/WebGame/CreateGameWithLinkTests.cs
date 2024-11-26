
using chess.Api.Models.WebGameModels;
using chess.Api.Tests.User;
using chess.Application.Requests.WebGameRequests.CreatePrivateGameWithLink;
using chess.Core.Enums;
using chess.Infrastructure.Contexts;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Net;
using System.Text;

namespace chess.Api.Tests.WebGame;

public class CreateGameWithLinkTests : IClassFixture<TestWebApplicationFactory<Program>> {

    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory<Program> _factory;
    private readonly ChessAppDbContext _dbContext;

    public CreateGameWithLinkTests() {
        _factory = new TestWebApplicationFactory<Program>();

        _client = _factory.CreateClient();

        var scopeFactory = _factory.Services.GetService<IServiceScopeFactory>()
            ?? throw new InvalidOperationException("IServiceScopeFactory not registered.");

        var scope = scopeFactory.CreateScope();
        _dbContext = scope.ServiceProvider.GetService<ChessAppDbContext>()
            ?? throw new InvalidOperationException("ChessAppDbContext not registered.");
    }

    [Fact]
    public async Task CreateGameWithLink_Should_Create_Private_Game_On_Success() {

        await _dbContext.Init();
        await _dbContext.AddUser();
        await _dbContext.AddUserWithEmail("friend@test.com");

        var model = new CreatePrivateGameWithLinkModel()
        {
            Type = TimingTypes.Rapid,
            Minutes = 15,
            Increment = 0,
        };

        var json = JsonConvert.SerializeObject(model);
        var httpContent = new StringContent(json, Encoding.UTF8, "application/json");


        var response = await _client.PostAsync("api/webgame/link", httpContent);


        var assertDbContext = _factory.GetDbContextForAsserts();

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var players = await assertDbContext.WebGamePlayers.ToListAsync();
        players.Count.Should().Be(2);
        players[0].UserId.Should().Be(Guid.Parse(Constants.UserId));
        players[1].UserId.Should().Be(Guid.Parse(Constants.UserId));

        var game = await assertDbContext.WebGames.FirstAsync();

        game.TimingType.Should().Be(TimingTypes.Rapid);
        game.IsPrivate.Should().Be(true);

        var result = JsonConvert.DeserializeObject<CreatePrivateGameWithLinkDto>(await response.Content.ReadAsStringAsync());
        result.GameId.Should().Be(game.Id);
    }

    /// <summary>
    /// Try to create game with link when user does not exists
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async Task CreateGameWithLink_Should_Return_NotFound_On_Fail() {

        await _dbContext.Init();
        // user not added

        var model = new CreatePrivateGameWithLinkModel()
        {
            Type = TimingTypes.Rapid,
            Minutes = 15,
            Increment = 0,
        };

        var json = JsonConvert.SerializeObject(model);
        var httpContent = new StringContent(json, Encoding.UTF8, "application/json");


        var response = await _client.PostAsync("api/webgame/link", httpContent);


        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}
