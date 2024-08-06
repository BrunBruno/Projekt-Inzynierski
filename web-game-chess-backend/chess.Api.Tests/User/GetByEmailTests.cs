
using chess.Application.Requests.UserRequests.CheckIfEmailExists;
using chess.Infrastructure.Contexts;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Net;

namespace chess.Api.Tests.User;

public class GetByEmailTests : IClassFixture<TestWebApplicationFactory<Program>> {

    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory<Program> _factory;
    private readonly ChessAppDbContext _dbContext;

    public GetByEmailTests() {
        _factory = new TestWebApplicationFactory<Program>();

        _client = _factory.CreateClient();

        var scopeFactory = _factory.Services.GetService<IServiceScopeFactory>()
            ?? throw new InvalidOperationException("IServiceScopeFactory not registered.");

        var scope = scopeFactory.CreateScope();
        _dbContext = scope.ServiceProvider.GetService<ChessAppDbContext>()
            ?? throw new InvalidOperationException("ChessAppDbContext not registered.");
    }

    [Fact]
    public async Task GetByEmail_Should_Return_UserDto_On_Success() {

        await _dbContext.Init();
        await _dbContext.AddUser();

        string email = "test@test.com";


        var response = await _client.GetAsync($"api/user/by-email?email={email}");


        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var result = JsonConvert.DeserializeObject<GetByEmailDto>(await response.Content.ReadAsStringAsync());
        result.Email.Should().Be(email);
    }

    /// <summary>
    /// Gets non existing user
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async Task GetByEmail_Should_Return_NotFound_On_Fail() {

        await _dbContext.Init();
        // user not added

        string email = "test@test.com";


        var response = await _client.GetAsync($"api/user/by-email?email={email}");


        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    /// <summary>
    /// Gets with incorrect email
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async Task GetByEmail_Should_Return_BadRequest_On_Fail() {

        await _dbContext.Init();
        await _dbContext.AddUser();


        // incorrect email
        var response = await _client.GetAsync($"api/user/by-email?email={null}");


        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
}
