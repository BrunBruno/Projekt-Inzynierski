
using chess.Api.Tests.User;
using chess.Application.Requests.WebGameRequests.CheckIfUpdateRequired;
using chess.Core.Models;
using chess.Core.Enums;
using chess.Infrastructure.Contexts;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Net;

namespace chess.Api.Tests.WebGame;

public class CheckIfUpdateRequiredTests : IClassFixture<TestWebApplicationFactory<Program>> {

    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory<Program> _factory;
    private readonly ChessAppDbContext _dbContext;

    public CheckIfUpdateRequiredTests() {
        _factory = new TestWebApplicationFactory<Program>();

        _client = _factory.CreateClient();

        var scopeFactory = _factory.Services.GetService<IServiceScopeFactory>()
            ?? throw new InvalidOperationException("IServiceScopeFactory not registered.");

        var scope = scopeFactory.CreateScope();
        _dbContext = scope.ServiceProvider.GetService<ChessAppDbContext>()
            ?? throw new InvalidOperationException("ChessAppDbContext not registered.");
    }

    [Fact]
    public async Task CheckIfUpdateRequired_Returns_IsRequired_On_Success() {

        await _dbContext.Init();
        await _dbContext.AddUser();
        await _dbContext.AddUserWithEmail("friend@test.com");

        var timingId = await _dbContext.CreateTiming(new TimingTypeModel()
        {
            Type = TimingTypes.Classic,
            Minutes = 120,
            Increment = 0,
        });

        var userPlayerId = await _dbContext.AddPlayer(Guid.Parse(Constants.UserId), Constants.Username);

        var gameId = await _dbContext.AddGame(userPlayerId, userPlayerId, timingId, true);
        await _dbContext.AddPlayerToGame(userPlayerId, gameId, PieceColor.White);

        var response = await _client.GetAsync($"api/webgame/{gameId}/update-required");


        response.StatusCode.Should().Be(HttpStatusCode.OK);


        var result = JsonConvert.DeserializeObject<CheckIfUpdateRequiredDto>(await response.Content.ReadAsStringAsync());
        result.IsRequired.Should().Be(true);
        result.Type.Should().Be(TimingTypes.Classic);
    }

    /// <summary>
    /// Game not added
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async Task CheckIfUpdateRequired_Returns_NotFound_On_Fail() {

        await _dbContext.Init();
        await _dbContext.AddUser();
        await _dbContext.AddUserWithEmail("friend@test.com");

        await _dbContext.CreateTiming(new TimingTypeModel() 
        {
            Type = TimingTypes.Classic,
            Minutes = 120,
            Increment = 0,
        });

        await _dbContext.AddPlayer(Guid.Parse(Constants.UserId), Constants.Username);
        // game not added


        var response = await _client.GetAsync($"api/webgame/{Guid.NewGuid()}/update-required");


        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}
