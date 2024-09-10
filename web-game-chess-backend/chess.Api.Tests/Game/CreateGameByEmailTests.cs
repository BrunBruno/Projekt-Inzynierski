
using chess.Api.Models.GameModels;
using chess.Api.Tests.User;
using chess.Application.Requests.GameRequests.CreateGameByEmail;
using chess.Core.Enums;
using chess.Infrastructure.Contexts;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Net;
using System.Text;

namespace chess.Api.Tests.Game;

public class CreateGameByEmailTests : IClassFixture<TestWebApplicationFactory<Program>> {

    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory<Program> _factory;
    private readonly ChessAppDbContext _dbContext;

    public CreateGameByEmailTests() {
        _factory = new TestWebApplicationFactory<Program>();

        _client = _factory.CreateClient();

        var scopeFactory = _factory.Services.GetService<IServiceScopeFactory>()
            ?? throw new InvalidOperationException("IServiceScopeFactory not registered.");

        var scope = scopeFactory.CreateScope();
        _dbContext = scope.ServiceProvider.GetService<ChessAppDbContext>()
            ?? throw new InvalidOperationException("ChessAppDbContext not registered.");
    }

    [Fact]
    public async Task CreateGameByEmail_Should_Create_Essentials_For_Private_Game() {

        string friendEmail = "friend@test.com";

        await _dbContext.Init();
        await _dbContext.AddUser();
        await _dbContext.AddUserWithEmail(friendEmail);

        var model = new CreateGameByEmailModel()
        {
            Email = friendEmail,
            Type = TimingTypes.Blitz,
            Minutes = 3,
            Increment = 0,
        };

        var json = JsonConvert.SerializeObject(model);
        var httpContent = new StringContent(json, Encoding.UTF8, "application/json");


        var response = await _client.PostAsync("api/game/by-email", httpContent);


        var assertDbContext = _factory.GetDbContextForAsserts();

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var players = await assertDbContext.Players.ToListAsync();
        players.Count.Should().Be(2);

        var game = await assertDbContext.Games.FirstAsync();

        game.TimingType.Should().Be(TimingTypes.Blitz);

        var result = JsonConvert.DeserializeObject<CreateGameByEmailDto>(await response.Content.ReadAsStringAsync());
        result.GameId.Should().Be(game.Id);
        result.Inviter.Should().Be("TestUserName");
    }

    /// <summary>
    /// Create for user that not exists
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async Task CreateGameByEmail_Should_Return_NotFound_On_Fail() {

        string friendEmail = "friend@test.com";

        await _dbContext.Init();
        await _dbContext.AddUser();
        // friend not exists

        var model = new CreateGameByEmailModel()
        {
            Email = friendEmail,
            Type = TimingTypes.Blitz,
            Minutes = 3,
            Increment = 0,
        };

        var json = JsonConvert.SerializeObject(model);
        var httpContent = new StringContent(json, Encoding.UTF8, "application/json");


        var response = await _client.PostAsync("api/game/by-email", httpContent);


        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}
