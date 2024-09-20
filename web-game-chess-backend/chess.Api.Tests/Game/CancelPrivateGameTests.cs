
using chess.Api.Tests.User;
using chess.Core.Abstraction;
using chess.Core.Enums;
using chess.Infrastructure.Contexts;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System.Net;

namespace chess.Api.Tests.Game;

public class CancelPrivateGameTests : IClassFixture<TestWebApplicationFactory<Program>> {

    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory<Program> _factory;
    private readonly ChessAppDbContext _dbContext;

    public CancelPrivateGameTests() {
        _factory = new TestWebApplicationFactory<Program>();

        _client = _factory.CreateClient();

        var scopeFactory = _factory.Services.GetService<IServiceScopeFactory>()
            ?? throw new InvalidOperationException("IServiceScopeFactory not registered.");

        var scope = scopeFactory.CreateScope();
        _dbContext = scope.ServiceProvider.GetService<ChessAppDbContext>()
            ?? throw new InvalidOperationException("ChessAppDbContext not registered.");
    }

    [Fact]
    public async Task CancelPrivateGame_Should_Remove_Game_On_Success() {

        await _dbContext.Init();
        await _dbContext.AddUser();
        await _dbContext.AddUserWithEmail("friend@test.com");

        var timingId = await _dbContext.CreateTiming(new TimingType()
        {
            Type = TimingTypes.Blitz,
            Minutes = 5,
            Increment = 0,
        });

        var userPlayerId = await _dbContext.AddPlayer(Guid.Parse(Constants.UserId), Constants.Username);
        var friendPlayerId = await _dbContext.AddPlayer(Guid.NewGuid(), "friend");

        var gameId = await _dbContext.AddGame(userPlayerId, friendPlayerId, timingId, true);
        await _dbContext.AddPlayerToGame(userPlayerId, gameId, PieceColor.White);
        await _dbContext.AddPlayerToGame(friendPlayerId, gameId, PieceColor.Black);


        var response = await _client.DeleteAsync($"api/game/{gameId}/cancel");


        var assertDbContext = _factory.GetDbContextForAsserts();

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var game = await assertDbContext.Games.FirstOrDefaultAsync();
        game.Should().Be(null);

        var player = await assertDbContext.Players.FirstOrDefaultAsync();
        player.Should().Be(null);
    }

    /// <summary>
    /// Cancel not existing game
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async Task CancelPrivateGame_Should_Return_NotFound_On_Fail() {

        await _dbContext.Init();
        await _dbContext.AddUser();
        await _dbContext.AddUserWithEmail("friend@test.com");

        var timingId = await _dbContext.CreateTiming(new TimingType()
        {
            Type = TimingTypes.Blitz,
            Minutes = 5,
            Increment = 0,
        });

        var userPlayerId = await _dbContext.AddPlayer(Guid.Parse(Constants.UserId), Constants.Username);
        var friendPlayerId = await _dbContext.AddPlayer(Guid.NewGuid(), "friend");
        // game not added


        var response = await _client.DeleteAsync($"api/game/{Guid.NewGuid()}/cancel");


        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    /// <summary>
    /// Try to cancel game that is not private
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async Task CancelPrivateGame_Should_Return_BadRequest_On_Fail() {

        await _dbContext.Init();
        await _dbContext.AddUser();
        await _dbContext.AddUserWithEmail("friend@test.com");

        var timingId = await _dbContext.CreateTiming(new TimingType()
        {
            Type = TimingTypes.Blitz,
            Minutes = 5,
            Increment = 0,
        });

        var userPlayerId = await _dbContext.AddPlayer(Guid.Parse(Constants.UserId), Constants.Username);
        var friendPlayerId = await _dbContext.AddPlayer(Guid.NewGuid(), "friend");

        var gameId = await _dbContext.AddGame(userPlayerId, friendPlayerId, timingId, false); // not private
        await _dbContext.AddPlayerToGame(userPlayerId, gameId, PieceColor.White);
        await _dbContext.AddPlayerToGame(friendPlayerId, gameId, PieceColor.Black);


        var response = await _client.DeleteAsync($"api/game/{gameId}/cancel");


        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    /// <summary>
    /// Cancel not owned game
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async Task CancelPrivateGame_Should_Return_Unauthorized_On_Fail() {


        await _dbContext.Init();
        await _dbContext.AddUser();
        await _dbContext.AddUserWithEmail("friend@test.com");

        var timingId = await _dbContext.CreateTiming(new TimingType()
        {
            Type = TimingTypes.Blitz,
            Minutes = 5,
            Increment = 0,
        });

       await _dbContext.AddPlayer(Guid.Parse(Constants.UserId), Constants.Username);
        var friendPlayerId = await _dbContext.AddPlayer(Guid.NewGuid(), "FriendUsername");
        var otherPlayerId = await _dbContext.AddPlayer(Guid.NewGuid(), "OtherUsername");

        var gameId = await _dbContext.AddGame(otherPlayerId, friendPlayerId, timingId, true); // user not in game
        await _dbContext.AddPlayerToGame(otherPlayerId, gameId, PieceColor.White);
        await _dbContext.AddPlayerToGame(friendPlayerId, gameId, PieceColor.Black);


        var response = await _client.DeleteAsync($"api/game/{gameId}/cancel");


        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
}
