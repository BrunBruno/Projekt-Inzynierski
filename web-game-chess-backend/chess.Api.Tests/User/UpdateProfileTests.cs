
using chess.Api.Models.UserModels;
using chess.Infrastructure.Contexts;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Net;
using System.Text;

namespace chess.Api.Tests.User;

public class UpdateProfileTests : IClassFixture<TestWebApplicationFactory<Program>> {

    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory<Program> _factory;
    private readonly ChessAppDbContext _dbContext;

    public UpdateProfileTests() {
        _factory = new TestWebApplicationFactory<Program>();

        _client = _factory.CreateClient();

        var scopeFactory = _factory.Services.GetService<IServiceScopeFactory>()
            ?? throw new InvalidOperationException("IServiceScopeFactory not registered.");

        var scope = scopeFactory.CreateScope();
        _dbContext = scope.ServiceProvider.GetService<ChessAppDbContext>()
            ?? throw new InvalidOperationException("ChessAppDbContext not registered.");
    }

    [Fact]
    public async Task UpdateProfile_Should_Updates_User_On_Success() {

        await _dbContext.Init();
        await _dbContext.AddUser();

        string name = "Test Name";
        string bio = "Test Bio";

        var model = new UpdateProfileModel
        {
            Name = name,
            Bio = bio,
        };


        var formData = new MultipartFormDataContent();
        foreach (var property in model.GetType().GetProperties()) {
            var value = property.GetValue(model)?.ToString() ?? string.Empty;
            formData.Add(new StringContent(value), property.Name);
        }


        var response = await _client.PutAsync("api/user/profile", formData);


        var assertDbContext = _factory.GetDbContextForAsserts();

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var user = await assertDbContext.Users.FirstOrDefaultAsync();

        user.Should().NotBeNull();
        user!.Name.Should().Be(name);
        user!.Bio.Should().Be(bio);
    }

    /// <summary>
    /// Updates profile when user not exists
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async Task UpdateProfile_Should_Returns_NotFound_On_Fail() {

        await _dbContext.Init();
        // user not added

        var model = new UpdateProfileModel()
        {
            Name = "Not Exists",
        };

        var json = JsonConvert.SerializeObject(model);
        var httpContent = new StringContent(json, Encoding.UTF8, "application/json");


        var response = await _client.PutAsync("api/user/profile", httpContent);


        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}