
using chess.Api.Models.UserModels;
using chess.Infrastructure.Contexts;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Net;
using System.Text;

namespace chess.Api.Tests.User;

public class RegisterTests : IClassFixture<TestWebApplicationFactory<Program>> {
 
    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory<Program> _factory;
    private readonly ChessAppDbContext _dbContext;

    public RegisterTests() {
        _factory = new TestWebApplicationFactory<Program>();

        _client = _factory.CreateClient();

        var scopeFactory = _factory.Services.GetService<IServiceScopeFactory>()
            ?? throw new InvalidOperationException("IServiceScopeFactory not registered.");

        var scope = scopeFactory.CreateScope();
        _dbContext = scope.ServiceProvider.GetService<ChessAppDbContext>()
            ?? throw new InvalidOperationException("ChessAppDbContext not registered.");
    }

    /// <summary>
    /// Register already existing user
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async Task Register_Should_Create_User_On_Success() {

        await _dbContext.Init();

        var model = new RegisterUserModel()
        {
            Email= "test@test.com",
            Username = "Test",
            Password = "Password",
            ConfirmPassword = "Password",
            Country = "PL"
        };

        var json = JsonConvert.SerializeObject(model);
        var httpContent = new StringContent(json, Encoding.UTF8, "application/json");


        var response = await _client.PostAsync("api/user/sign-up", httpContent);


        var assertDbContext = _factory.GetDbContextForAsserts();

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var user = await assertDbContext.Users.FirstOrDefaultAsync();

        user.Username.Should().Be("Test");
        user.Email.Should().Be("test@test.com");
    }

    /// <summary>
    /// Check with already existing email
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async Task Register_Should_Return_BadRequest_On_Fail() {

        await _dbContext.Init();
        await _dbContext.AddUserWithEmail("test@test.com");

        var model = new RegisterUserModel()
        {
            Email = "test@test.com",
            Username = "Test",
            Password = "Password",
            ConfirmPassword = "Password",
            Country = "PL"
        };

        var json = JsonConvert.SerializeObject(model);
        var httpContent = new StringContent(json, Encoding.UTF8, "application/json");


        var response = await _client.PostAsync("api/user/sign-up", httpContent);


        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
}
