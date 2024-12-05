
using chess.Api.Models.UserModels;
using chess.Core.Enums;
using chess.Infrastructure.Contexts;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Net;
using System.Text;

namespace chess.Api.Tests.User;

public class ChangePasswordTests : IClassFixture<TestWebApplicationFactory<Program>> {

    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory<Program> _factory;
    private readonly ChessAppDbContext _dbContext;

    public ChangePasswordTests() {
        _factory = new TestWebApplicationFactory<Program>();

        _client = _factory.CreateClient();

        var scopeFactory = _factory.Services.GetService<IServiceScopeFactory>()
            ?? throw new InvalidOperationException("IServiceScopeFactory not registered.");

        var scope = scopeFactory.CreateScope();
        _dbContext = scope.ServiceProvider.GetService<ChessAppDbContext>()
            ?? throw new InvalidOperationException("ChessAppDbContext not registered.");
    }


    [Fact]
    public async Task ChangePassword_Should_Update_User_Password_On_Success() {

        await _dbContext.Init();
        await _dbContext.AddUser();

        await _dbContext.AddCodeForUser(UserCodesTypes.Password);

        var model = new ChangePasswordModel()
        {
            OldPassword = "string",
            NewPassword = "newPass",
            ConfirmPassword = "newPass",
        };

        var json = JsonConvert.SerializeObject(model);
        var httpContent = new StringContent(json, Encoding.UTF8, "application/json");


        var response = await _client.PutAsync("api/user/change-password", httpContent);

        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task ChangePassword_Should_Throw_NotFound_On_Fail() {

        await _dbContext.Init();
        // user not added

        await _dbContext.AddCodeForUser(UserCodesTypes.Password);

        var model = new ChangePasswordModel()
        {
            OldPassword = "string",
            NewPassword = "newPass",
            ConfirmPassword = "newPass",
        };

        var json = JsonConvert.SerializeObject(model);
        var httpContent = new StringContent(json, Encoding.UTF8, "application/json");


        var response = await _client.PutAsync("api/user/change-password", httpContent);

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task ChangePassword_Should_Throw_BadRequest_On_Fail() {

        await _dbContext.Init();
        await _dbContext.AddUser();

        await _dbContext.AddCodeForUser(UserCodesTypes.Password);

        var model = new ChangePasswordModel()
        {
            OldPassword = "string",
            NewPassword = "newPass",
            ConfirmPassword = "badPass", // passwords not matching
        };

        var json = JsonConvert.SerializeObject(model);
        var httpContent = new StringContent(json, Encoding.UTF8, "application/json");


        var response = await _client.PutAsync("api/user/change-password", httpContent);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
}
