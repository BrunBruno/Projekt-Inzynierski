﻿
using chess.Api.Models.GameModels;
using chess.Api.Tests.User;
using chess.Application.Requests.GameRequests.CreateRematchGame;
using chess.Core.Abstraction;
using chess.Core.Enums;
using chess.Infrastructure.Contexts;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Net;
using System.Text;

namespace chess.Api.Tests.Game;

public class CreateRematchGameTests : IClassFixture<TestWebApplicationFactory<Program>> {

    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory<Program> _factory;
    private readonly ChessAppDbContext _dbContext;

    public CreateRematchGameTests() {
        _factory = new TestWebApplicationFactory<Program>();

        _client = _factory.CreateClient();

        var scopeFactory = _factory.Services.GetService<IServiceScopeFactory>()
            ?? throw new InvalidOperationException("IServiceScopeFactory not registered.");

        var scope = scopeFactory.CreateScope();
        _dbContext = scope.ServiceProvider.GetService<ChessAppDbContext>()
            ?? throw new InvalidOperationException("ChessAppDbContext not registered.");
    }

    [Fact]
    public async Task CreateRematchGame_Should_Create_Game_Essentials_And_Return_Game_Id() {

        var timingType = new TimingType()
        {
            Type = TimingTypes.Classic,
            Minutes = 60,
            Increment = 0,
        };

        string friendEmail = "friend@test.com";

        await _dbContext.Init();
        await _dbContext.AddUser();
        var friendId = await _dbContext.AddUserWithEmail(friendEmail);
        await _dbContext.CreateTiming(timingType);

        var model = new CreateRematchGameModel()
        {
            OpponentId = friendId,
            Type = timingType.Type,
            Minutes = timingType.Minutes,
            Increment = timingType.Increment,
        };

        var json = JsonConvert.SerializeObject(model);
        var httpContent = new StringContent(json, Encoding.UTF8, "application/json");


        var response = await _client.PostAsync("api/game/rematch", httpContent);


        var assertDbContext = _factory.GetDbContextForAsserts();

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var game = await assertDbContext.Games.FirstAsync();

        var result = JsonConvert.DeserializeObject<CreateRematchGameDto>(await response.Content.ReadAsStringAsync());
        result.GameId.Should().Be(game.Id);
    }

    /// <summary>
    /// Create rematch for not existing timing
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async Task CreateRematchGame_Should_Return_NotFound_On_Fail() {

        string friendEmail = "friend@test.com";

        await _dbContext.Init();
        await _dbContext.AddUser();
        var friendId = await _dbContext.AddUserWithEmail(friendEmail);
        // no timing added

        var model = new CreateRematchGameModel()
        {
            OpponentId = friendId,
            Type = TimingTypes.Classic,
            Minutes = 60,
            Increment = 0,
        };

        var json = JsonConvert.SerializeObject(model);
        var httpContent = new StringContent(json, Encoding.UTF8, "application/json");


        var response = await _client.PostAsync("api/game/rematch", httpContent);


        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}
