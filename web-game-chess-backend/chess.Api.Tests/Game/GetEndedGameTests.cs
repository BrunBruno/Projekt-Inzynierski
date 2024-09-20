
using chess.Api.Tests.User;
using chess.Application.Requests.GameRequests.GetEndedGame;
using chess.Core.Abstraction;
using chess.Core.Enums;
using chess.Infrastructure.Contexts;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Net;

namespace chess.Api.Tests.Game;

public class GetEndedGameTests : IClassFixture<TestWebApplicationFactory<Program>> {

    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory<Program> _factory;
    private readonly ChessAppDbContext _dbContext;

    public GetEndedGameTests() {
        _factory = new TestWebApplicationFactory<Program>();

        _client = _factory.CreateClient();

        var scopeFactory = _factory.Services.GetService<IServiceScopeFactory>()
            ?? throw new InvalidOperationException("IServiceScopeFactory not registered.");

        var scope = scopeFactory.CreateScope();
        _dbContext = scope.ServiceProvider.GetService<ChessAppDbContext>()
            ?? throw new InvalidOperationException("ChessAppDbContext not registered.");
    }

    [Fact]
    public async Task GetEndedGame_Should_Return_Winner_On_Success() {

        var timingType = new TimingType()
        {
            Type = TimingTypes.Blitz,
            Minutes = 5,
            Increment = 1,
        };

        Guid friendId = Guid.NewGuid();
        string friendEmail = "friend@test.com";
        string friendUsername = "FriendUsername";

        await _dbContext.Init();
        await _dbContext.AddUser();
        await _dbContext.AddUserWithEmail(friendEmail);

        var timingId = await _dbContext.CreateTiming(timingType);
        var userPlayerId = await _dbContext.AddPlayer(Guid.Parse(Constants.UserId), Constants.Username);
        var friendPlayerId = await _dbContext.AddPlayer(friendId, friendUsername);

        var gameId = await _dbContext.AddGame(userPlayerId, friendPlayerId, timingId, false);

        await _dbContext.StartGame(gameId);
        await _dbContext.EndGame(gameId, PieceColor.Black);


        var response = await _client.GetAsync($"api/game/{gameId}/ended");


        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var result = JsonConvert.DeserializeObject<GetEndedGameDto>(await response.Content.ReadAsStringAsync());
        result.WinnerColor.Should().Be(PieceColor.Black);
    }

    /// <summary>
    /// Get ended game that has not ended yet
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async Task GetEndedGame_Should_Return_Bad_Request_On_Fail() {


        var timingType = new TimingType()
        {
            Type = TimingTypes.Blitz,
            Minutes = 5,
            Increment = 1,
        };

        await _dbContext.Init();
        await _dbContext.AddUser();
        await _dbContext.AddUserWithEmail("friend@test.com");

        var timingId = await _dbContext.CreateTiming(timingType);
        var userPlayerId = await _dbContext.AddPlayer(Guid.Parse(Constants.UserId), Constants.Username);
        var friendPlayerId = await _dbContext.AddPlayer(Guid.NewGuid(), "FriendUsername");
        var gameId = await _dbContext.AddGame(userPlayerId, friendPlayerId, timingId, false);

        await _dbContext.StartGame(gameId);
        // no ending of game

        var response = await _client.GetAsync($"api/game/{gameId}/ended");


        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    /// <summary>
    /// Get not existing game
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async Task GetEndedGame_Should_Return_NotFound_On_Fail() {


        var timingType = new TimingType()
        {
            Type = TimingTypes.Blitz,
            Minutes = 5,
            Increment = 1,
        };

        await _dbContext.Init();
        await _dbContext.AddUser();
        await _dbContext.AddPlayer(Guid.Parse(Constants.UserId), Constants.Username);

        await _dbContext.CreateTiming(timingType);
        // game not added

        var response = await _client.GetAsync($"api/game/{Guid.NewGuid()}/ended");


        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    /// <summary>
    /// Get not owned ended game
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async Task GetEndedGame_Should_Return_Unauthorized_On_Fail() {


        var timingType = new TimingType()
        {
            Type = TimingTypes.Blitz,
            Minutes = 5,
            Increment = 1,
        };


        await _dbContext.Init();
        await _dbContext.AddUser();

        var timingId = await _dbContext.CreateTiming(timingType);

        await _dbContext.AddPlayer(Guid.Parse(Constants.UserId), Constants.Username);
        var friendPlayerId = await _dbContext.AddPlayer(Guid.NewGuid(), "FriendUsername");
        var otherPlayerId = await _dbContext.AddPlayer(Guid.NewGuid(), "OtherUsername");


        var gameId = await _dbContext.AddGame(otherPlayerId, friendPlayerId, timingId, false); // not owned game

        await _dbContext.StartGame(gameId);
        await _dbContext.EndGame(gameId, PieceColor.Black);


        var response = await _client.GetAsync($"api/game/{gameId}/ended");


        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
}
