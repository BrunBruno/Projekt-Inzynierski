
using chess.Api.Models.UserModels;
using chess.Core.Enums;
using chess.Infrastructure.Contexts;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Net;
using System.Text;

namespace chess.Api.Tests.User;

public class SendResetPasswordCodeTests : IClassFixture<TestWebApplicationFactory<Program>> {

    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory<Program> _factory;
    private readonly ChessAppDbContext _dbContext;

    public SendResetPasswordCodeTests() {
        _factory = new TestWebApplicationFactory<Program>();

        _client = _factory.CreateClient();

        var scopeFactory = _factory.Services.GetService<IServiceScopeFactory>()
            ?? throw new InvalidOperationException("IServiceScopeFactory not registered.");

        var scope = scopeFactory.CreateScope();
        _dbContext = scope.ServiceProvider.GetService<ChessAppDbContext>()
            ?? throw new InvalidOperationException("ChessAppDbContext not registered.");
    }

    [Fact]
    public async Task SendResetPasswordCode_Creates_Code_On_Success() {

        await _dbContext.Init();
        await _dbContext.AddUser();
        await _dbContext.AddCodeForUser();

        var model = new SendResetPasswordCodeModel()
        {
            Email = Constants.Email,
        };

        var json = JsonConvert.SerializeObject(model);
        var httpContent = new StringContent(json, Encoding.UTF8, "application/json");


        var response = await _client.PutAsync("api/user/send-password-code", httpContent);

        var assertDbContext = _factory.GetDbContextForAsserts();

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var code = await assertDbContext.UserVerificationCodes.FirstAsync();
        code.Type.Should().Be(UserCodesTypes.Password);
    }

    [Fact]
    public async Task SendResetPasswordCode_Throws_NotFound_On_Fail() {

        await _dbContext.Init();
        // user not added
        await _dbContext.AddCodeForUser();

        var model = new SendResetPasswordCodeModel()
        {
            Email = Constants.Email,
        };

        var json = JsonConvert.SerializeObject(model);
        var httpContent = new StringContent(json, Encoding.UTF8, "application/json");


        var response = await _client.PutAsync("api/user/send-password-code", httpContent);


        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}
