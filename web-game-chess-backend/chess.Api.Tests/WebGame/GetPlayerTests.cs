﻿
using chess.Api.Tests.User;
using chess.Application.Requests.WebGameRequests.GetWebGamePlayer;
using chess.Core.Models;
using chess.Core.Enums;
using chess.Infrastructure.Contexts;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Net;

namespace chess.Api.Tests.WebGame;

public class GetWebGamePlayerTests : IClassFixture<TestWebApplicationFactory<Program>> {

    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory<Program> _factory;
    private readonly ChessAppDbContext _dbContext;

    public GetWebGamePlayerTests() {
        _factory = new TestWebApplicationFactory<Program>();

        _client = _factory.CreateClient();

        var scopeFactory = _factory.Services.GetService<IServiceScopeFactory>()
            ?? throw new InvalidOperationException("IServiceScopeFactory not registered.");

        var scope = scopeFactory.CreateScope();
        _dbContext = scope.ServiceProvider.GetService<ChessAppDbContext>()
            ?? throw new InvalidOperationException("ChessAppDbContext not registered.");
    }

    [Fact]
    public async Task GetWebGamePlayer_Should_Return_PlayerDto_On_Success() {

        await _dbContext.Init();
        await _dbContext.AddUser();

        var timingId = await _dbContext.CreateTiming(new TimingTypeModel() {
            Type = TimingTypes.Rapid,
            Minutes = 10,
            Increment = 0,
        });

        var userPlayerId = await _dbContext.AddPlayer(Guid.Parse(Constants.UserId), Constants.Username);
        var otherPlayerId = await _dbContext.AddPlayer(Guid.NewGuid(), "OtherPlayer");

        var gameId = await _dbContext.AddGame(userPlayerId, otherPlayerId, timingId, false);

        await _dbContext.AddPlayerToGame(userPlayerId, gameId, PieceColor.Black);
        await _dbContext.AddPlayerToGame(otherPlayerId, gameId, PieceColor.White);


        var response = await _client.GetAsync($"api/webgame/{gameId}/player");


        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var result = JsonConvert.DeserializeObject<GetWebGamePlayerDto>(await response.Content.ReadAsStringAsync());
        result.Name.Should().Be(Constants.Username);
        result.Color.Should().Be(PieceColor.Black);
    }

    [Fact]
    public async Task GetWebGamePlayer_Should_Return_BadRequest_On_Fail() {

        await _dbContext.Init();
        await _dbContext.AddUser();

        var timingId = await _dbContext.CreateTiming(new TimingTypeModel() {
            Type = TimingTypes.Rapid,
            Minutes = 10,
            Increment = 0,
        });

        var userPlayerId = await _dbContext.AddPlayer(Guid.Parse(Constants.UserId), Constants.Username);
        var otherPlayerId = await _dbContext.AddPlayer(Guid.NewGuid(), "OtherPlayer");

        var gameId = await _dbContext.AddGame(userPlayerId, otherPlayerId, timingId, false);

        await _dbContext.AddPlayerToGame(userPlayerId, gameId, PieceColor.Black);
        await _dbContext.AddPlayerToGame(otherPlayerId, gameId, PieceColor.White);
        await _dbContext.ChangePlayerToNotPlaying(userPlayerId);
        // no player assignment


        var response = await _client.GetAsync($"api/webgame/{gameId}/player");


        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task GetWebGamePlayer_Should_Return_NotFound_On_Fail() {

        await _dbContext.Init();
        await _dbContext.AddUser();

        var timingId = await _dbContext.CreateTiming(new TimingTypeModel() {
            Type = TimingTypes.Rapid,
            Minutes = 10,
            Increment = 0,
        });

        await _dbContext.AddPlayer(Guid.Parse(Constants.UserId), Constants.Username);
        var otherPlayerId = await _dbContext.AddPlayer(Guid.NewGuid(), "OtherPlayer");
        var otherPlayer2Id = await _dbContext.AddPlayer(Guid.NewGuid(), "OtherPlayer2");

        var gameId = await _dbContext.AddGame(otherPlayerId, otherPlayer2Id, timingId, true); // game with other players


        var response = await _client.GetAsync($"api/webgame/{gameId}/player");


        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}
