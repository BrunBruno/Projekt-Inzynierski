
using chess.Application.Requests.UserRequests.GetOtherUser;
using chess.Infrastructure.Contexts;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Net;

namespace chess.Api.Tests.User;

public class GetOtherUserTests : IClassFixture<TestWebApplicationFactory<Program>> {

    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory<Program> _factory;
    private readonly ChessAppDbContext _dbContext;

    public GetOtherUserTests() {
        _factory = new TestWebApplicationFactory<Program>();

        _client = _factory.CreateClient();

        var scopeFactory = _factory.Services.GetService<IServiceScopeFactory>()
            ?? throw new InvalidOperationException("IServiceScopeFactory not registered.");

        var scope = scopeFactory.CreateScope();
        _dbContext = scope.ServiceProvider.GetService<ChessAppDbContext>()
            ?? throw new InvalidOperationException("ChessAppDbContext not registered.");
    }

    [Fact]
    public async Task GetOtherUser_Should_Return_UserDto_On_Success() {

        await _dbContext.Init();
        await _dbContext.AddUser();


        var response = await _client.GetAsync($"api/user/{Guid.Parse(Constants.UserId)}/other");


        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var result = JsonConvert.DeserializeObject<GetOtherUserDto>(await response.Content.ReadAsStringAsync());
        result.Username.Should().NotBeEmpty();
    }

    /// <summary>
    /// Get not existing user.
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async Task GetOtherUser_Returns_NotFound_On_Fail() {

        await _dbContext.Init();
        // user not added


        var response = await _client.GetAsync($"api/user/{Guid.Parse(Constants.UserId)}/other");


        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}
