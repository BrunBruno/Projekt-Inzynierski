
using chess.Api.Models.UserModels;
using chess.Infrastructure.Contexts;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Net;
using System.Text;

namespace chess.Api.Tests.User;

public class RegenerateCodeTests : IClassFixture<TestWebApplicationFactory<Program>> {

    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory<Program> _factory;
    private readonly ChessAppDbContext _dbContext;

    public RegenerateCodeTests() {
        _factory = new TestWebApplicationFactory<Program>();

        _client = _factory.CreateClient();

        var scopeFactory = _factory.Services.GetService<IServiceScopeFactory>()
            ?? throw new InvalidOperationException("IServiceScopeFactory not registered.");

        var scope = scopeFactory.CreateScope();
        _dbContext = scope.ServiceProvider.GetService<ChessAppDbContext>()
            ?? throw new InvalidOperationException("ChessAppDbContext not registered.");
    }

    [Fact]
    public async Task RegenerateCode_Should_Return_Ok_On_Success() {

        await _dbContext.Init();
        await _dbContext.AddUser();
        await _dbContext.AddCodeForUser();

        var model = new RegenerateCodeModel() { };

        var json = JsonConvert.SerializeObject(model);
        var httpContent = new StringContent(json, Encoding.UTF8, "application/json");


        var response = await _client.PostAsync("api/user/regenerate-code", httpContent);


        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    /// <summary>
    /// Regenerating code, when user does not exist.
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async Task RegenerateCode_Should_Returns_NotFound_On_Fail() {
        
        await _dbContext.Init();

        var model = new RegenerateCodeModel() { };

        var json = JsonConvert.SerializeObject(model);
        var httpContent = new StringContent(json, Encoding.UTF8, "application/json");


        var response = await _client.PostAsync("api/user/regenerate-code", httpContent);


        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}
