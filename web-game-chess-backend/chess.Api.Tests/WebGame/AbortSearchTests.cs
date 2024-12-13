
using chess.Api.Tests.User;
using chess.Core.Models;
using chess.Core.Enums;
using chess.Infrastructure.Contexts;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System.Net;

namespace chess.Api.Tests.WebGame;

public class AbortWebGameSearchTests : IClassFixture<TestWebApplicationFactory<Program>> {

    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory<Program> _factory;
    private readonly ChessAppDbContext _dbContext;

    public AbortWebGameSearchTests() {
        _factory = new TestWebApplicationFactory<Program>();

        _client = _factory.CreateClient();

        var scopeFactory = _factory.Services.GetService<IServiceScopeFactory>()
            ?? throw new InvalidOperationException("IServiceScopeFactory not registered.");

        var scope = scopeFactory.CreateScope();
        _dbContext = scope.ServiceProvider.GetService<ChessAppDbContext>()
            ?? throw new InvalidOperationException("ChessAppDbContext not registered.");
    }

    [Fact]
    public async Task AbortWebGameSearch_Should_Remove_Player_On_Success() {

        await _dbContext.Init();
        await _dbContext.AddUser();

        await _dbContext.CreateTiming(new TimingTypeModel() {
            Type = TimingTypes.Blitz,
            Minutes = 3,
            Increment = 0,
        });

        var playerId = await _dbContext.AddPlayer(Guid.Parse(Constants.UserId), Constants.Username);


        var response = await _client.DeleteAsync($"api/webgame/abort?playerId={playerId}");


        var assertDbContext = _factory.GetDbContextForAsserts();

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var player = await assertDbContext.WebGamePlayers.FirstOrDefaultAsync();
        player.Should().Be(null);
    }

    [Fact]
    public async Task AbortWebGameSearch_Should_Return_BadRequest_On_Fail() {

        await _dbContext.Init();
        await _dbContext.AddUser();

        await _dbContext.CreateTiming(new TimingTypeModel() {
            Type = TimingTypes.Blitz,
            Minutes = 3,
            Increment = 0,
        });

        var otherPlayerId = await _dbContext.AddPlayer(Guid.NewGuid(), "OtherUser"); // other player


        var response = await _client.DeleteAsync($"api/webgame/abort?playerId={otherPlayerId}");

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task AbortWebGameSearch_Should_Return_NotFound_On_Fail() {

        await _dbContext.Init();
        await _dbContext.AddUser();

        await _dbContext.CreateTiming(new TimingTypeModel() {
            Type = TimingTypes.Blitz,
            Minutes = 3,
            Increment = 0,
        });

        // player not created


        var response = await _client.DeleteAsync($"api/webgame/abort?playerId={Guid.NewGuid()}");


        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}
