
using chess.Application.Requests.UserRequests.GetFullUser;
using chess.Infrastructure.Contexts;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Net;

namespace chess.Api.Tests.User;

public class GetFullUserTests : IClassFixture<TestWebApplicationFactory<Program>> {

    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory<Program> _factory;
    private readonly ChessAppDbContext _dbContext;

    public GetFullUserTests() {
        _factory = new TestWebApplicationFactory<Program>();

        _client = _factory.CreateClient();

        var scopeFactory = _factory.Services.GetService<IServiceScopeFactory>()
            ?? throw new InvalidOperationException("IServiceScopeFactory not registered.");

        var scope = scopeFactory.CreateScope();
        _dbContext = scope.ServiceProvider.GetService<ChessAppDbContext>()
            ?? throw new InvalidOperationException("ChessAppDbContext not registered.");
    }

    [Fact]
    public async Task GetFullUser_Should_Return_UserDto_On_Success() {

        await _dbContext.Init();
        await _dbContext.AddUser();
        await _dbContext.AddStatsForUser();

        var response = await _client.GetAsync("api/user/full");


        response.StatusCode.Should().Be(HttpStatusCode.OK);


        var result = JsonConvert.DeserializeObject<GetFullUserDto>(await response.Content.ReadAsStringAsync());
        result.Email.Should().Be("test@test.com");
        result.Wins.Should().Be(0);
    }

    /// <summary>
    /// Get not existing user.
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async Task GetFullUser_Returns_NotFound_On_Fail() {

        await _dbContext.Init();


        var response = await _client.GetAsync("api/user/full");


        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}
