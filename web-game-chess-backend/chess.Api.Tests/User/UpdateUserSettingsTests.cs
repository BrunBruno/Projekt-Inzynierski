
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

public class UpdateUserSettingsTests : IClassFixture<TestWebApplicationFactory<Program>> {

    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory<Program> _factory;
    private readonly ChessAppDbContext _dbContext;

    public UpdateUserSettingsTests() {
        _factory = new TestWebApplicationFactory<Program>();

        _client = _factory.CreateClient();

        var scopeFactory = _factory.Services.GetService<IServiceScopeFactory>()
            ?? throw new InvalidOperationException("IServiceScopeFactory not registered.");

        var scope = scopeFactory.CreateScope();
        _dbContext = scope.ServiceProvider.GetService<ChessAppDbContext>()
            ?? throw new InvalidOperationException("ChessAppDbContext not registered.");
    }

    [Fact]
    public async Task UpdateUserSettings_Updates_Settings_On_Success() {

        await _dbContext.Init();
        await _dbContext.AddUser();

        await _dbContext.AddCodeForUser(UserCodesTypes.Password);

        var model = new UpdateUserSettingsModel()
        {
            AppearanceOfPieces = AppearanceOfPieces.VariantB,
        };

        var json = JsonConvert.SerializeObject(model);
        var httpContent = new StringContent(json, Encoding.UTF8, "application/json");


        var response = await _client.PutAsync("api/user/settings", httpContent);

        var assertDbContext = _factory.GetDbContextForAsserts();


        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var settings = await assertDbContext.UserSettings.FirstAsync();
        settings.AppearanceOfPieces.Should().Be(AppearanceOfPieces.VariantB);
    }
}
