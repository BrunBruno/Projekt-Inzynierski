﻿
using chess.Api.Tests.User;
using chess.Application.Requests.WebGameRequests.GetAllMessages;
using chess.Core.Models;
using chess.Core.Enums;
using chess.Infrastructure.Contexts;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Net;

namespace chess.Api.Tests.WebGame;

public class GetAllMessagesTests : IClassFixture<TestWebApplicationFactory<Program>> {

    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory<Program> _factory;
    private readonly ChessAppDbContext _dbContext;

    public GetAllMessagesTests() {
        _factory = new TestWebApplicationFactory<Program>();

        _client = _factory.CreateClient();

        var scopeFactory = _factory.Services.GetService<IServiceScopeFactory>()
            ?? throw new InvalidOperationException("IServiceScopeFactory not registered.");

        var scope = scopeFactory.CreateScope();
        _dbContext = scope.ServiceProvider.GetService<ChessAppDbContext>()
            ?? throw new InvalidOperationException("ChessAppDbContext not registered.");
    }

    [Fact]
    public async Task GetAllMessages_Should_Return_List_Of_MessageDtos_On_Success() {

        await _dbContext.Init();
        await _dbContext.AddUser();
        var friendId = await _dbContext.AddUserWithEmail("freind@test.com");

        var timingId = await _dbContext.CreateTiming(new TimingTypeModel()
        {
            Type = TimingTypes.Bullet,
            Minutes = 2,
            Increment = 0,
        });

        var userPlayerId = await _dbContext.AddPlayer(Guid.Parse(Constants.UserId), Constants.Username);
        var friendPlayerId = await _dbContext.AddPlayer(friendId, "friend");

        var gameId = await _dbContext.AddGame(userPlayerId, friendPlayerId, timingId, false);
        await _dbContext.AddPlayerToGame(userPlayerId, gameId, PieceColor.White);
        await _dbContext.AddPlayerToGame(friendPlayerId, gameId, PieceColor.Black);
        await _dbContext.StartGame(gameId);
        await _dbContext.AddPlayerMessagesToGame(gameId);


        var response = await _client.GetAsync($"api/webgame/{gameId}/messages");


        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var result = JsonConvert.DeserializeObject<List<GetAllWebGameMessagesDto>>(await response.Content.ReadAsStringAsync());

        result.Count.Should().Be(20);
    }

    [Fact]
    public async Task GetAllMessages_Should_Return_NotFound_On_Fail() {

        await _dbContext.Init();
        await _dbContext.AddUser();
        var friendId = await _dbContext.AddUserWithEmail("freind@test.com");

        await _dbContext.CreateTiming(new TimingTypeModel()
        {
            Type = TimingTypes.Bullet,
            Minutes = 2,
            Increment = 0,
        });

        await _dbContext.AddPlayer(Guid.Parse(Constants.UserId), Constants.Username);
        await _dbContext.AddPlayer(friendId, "friend");

        // game not added


        var response = await _client.GetAsync($"api/webgame/{Guid.NewGuid()}/messages");


        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task GetAllMessages_Should_Return_Unauthorized_On_Fail() {

        await _dbContext.Init();
        await _dbContext.AddUser();
        var friendId = await _dbContext.AddUserWithEmail("freind@test.com");
        var otherUserId = await _dbContext.AddUserWithEmail("other@test.com");

        var timingId = await _dbContext.CreateTiming(new TimingTypeModel()
        {
            Type = TimingTypes.Bullet,
            Minutes = 2,
            Increment = 0,
        });

        // players not owned
        var friendPlayerId = await _dbContext.AddPlayer(friendId, "friend");
        var otherPlayerId = await _dbContext.AddPlayer(otherUserId, "other");

        var gameId = await _dbContext.AddGame(otherPlayerId, friendPlayerId, timingId, false);
        await _dbContext.AddPlayerToGame(otherPlayerId, gameId, PieceColor.White);
        await _dbContext.AddPlayerToGame(friendPlayerId, gameId, PieceColor.Black);
        await _dbContext.StartGame(gameId);
        await _dbContext.AddPlayerMessagesToGame(gameId);


        var response = await _client.GetAsync($"api/webgame/{gameId}/messages");


        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
}