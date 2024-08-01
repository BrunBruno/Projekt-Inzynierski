
using chess.Api.Models.UserModels;
using chess.Application.Requests.UserRequests.LogInUser;
using chess.Infrastructure.Contexts;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Net;
using System.Text;

namespace chess.Api.Tests.User;

public class LogInTests : IClassFixture<TestWebApplicationFactory<Program>> {

    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory<Program> _factory;
    private readonly ChessAppDbContext _dbContext;

    public LogInTests() {
        _factory = new TestWebApplicationFactory<Program>();

        _client = _factory.CreateClient();

        var scopeFactory = _factory.Services.GetService<IServiceScopeFactory>()
            ?? throw new InvalidOperationException("IServiceScopeFactory not registered.");

        var scope = scopeFactory.CreateScope();
        _dbContext = scope.ServiceProvider.GetService<ChessAppDbContext>()
            ?? throw new InvalidOperationException("ChessAppDbContext not registered.");
    }

    [Fact]
    public async Task LogIn_Should_Return_Token_On_Success() {

        await _dbContext.Init();
        await _dbContext.AddUser();

        var model = new LogInUserModel()
        {
            EmailOrUsername = "test@test.com",
            Password = "string",
        };

        var json = JsonConvert.SerializeObject(model);
        var httpContent = new StringContent(json, Encoding.UTF8, "application/json");


        var response = await _client.PostAsync("api/user/sign-in", httpContent);


        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var result = JsonConvert.DeserializeObject<LogInUserDto>(await response.Content.ReadAsStringAsync());
        result.Token.Should().NotBeEmpty();
    }

    /// <summary>
    /// Log in with incorrect password
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async Task LogIn_Should_Return_BadRequest_On_Fail() {

        await _dbContext.Init();
        var userEmail = "user@test.com";

        await _dbContext.AddUserWithEmail(userEmail);

        var model = new LogInUserModel()
        {
            EmailOrUsername = userEmail,
            Password = "Password",
        };

        var json = JsonConvert.SerializeObject(model);
        var httpContent = new StringContent(json, Encoding.UTF8, "application/json");


        var response = await _client.PostAsync("api/user/sign-in", httpContent);


        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
}
