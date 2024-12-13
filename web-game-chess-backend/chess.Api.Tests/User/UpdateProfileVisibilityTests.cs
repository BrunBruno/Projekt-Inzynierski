
using chess.Api.Models.UserModels;
using chess.Infrastructure.Contexts;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Net;
using System.Text;

namespace chess.Api.Tests.User;

public class UpdateProfileVisibilityTests : IClassFixture<TestWebApplicationFactory<Program>> {

    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory<Program> _factory;
    private readonly ChessAppDbContext _dbContext;

    public UpdateProfileVisibilityTests() {
        _factory = new TestWebApplicationFactory<Program>();

        _client = _factory.CreateClient();

        var scopeFactory = _factory.Services.GetService<IServiceScopeFactory>()
            ?? throw new InvalidOperationException("IServiceScopeFactory not registered.");

        var scope = scopeFactory.CreateScope();
        _dbContext = scope.ServiceProvider.GetService<ChessAppDbContext>()
            ?? throw new InvalidOperationException("ChessAppDbContext not registered.");
    }

    [Fact]
    public async Task UpdateProfileVisibility_Updates_User_On_Success() {

        await _dbContext.Init();
        await _dbContext.AddUser();

        var model = new UpdateProfileVisibilityModel()
        {
            ProfileIsPrivate = true,
        };


        var json = JsonConvert.SerializeObject(model);
        var httpContent = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _client.PutAsync("api/user/visibility", httpContent);


        var assertDbContext = _factory.GetDbContextForAsserts();

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var user = await assertDbContext.Users.FirstAsync();
        user.IsPrivate.Should().BeTrue();
    }

    [Fact]
    public async Task UpdateProfileVisibility_Throws_NotFound_On_Fail() {

        await _dbContext.Init();
        // user not added

        var model = new UpdateProfileVisibilityModel()
        {
            ProfileIsPrivate = true,
        };


        var json = JsonConvert.SerializeObject(model);
        var httpContent = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _client.PutAsync("api/user/visibility", httpContent);


        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}
