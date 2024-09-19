
using chess.Application.Requests.UserRequests.GetRegisterConf;
using chess.Core.Enums;
using chess.Infrastructure.Contexts;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Net;

namespace chess.Api.Tests.User;

public class GetRegisterConfTests : IClassFixture<TestWebApplicationFactory<Program>> {

    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory<Program> _factory;
    private readonly ChessAppDbContext _dbContext;

    public GetRegisterConfTests() {
        _factory = new TestWebApplicationFactory<Program>();

        _client = _factory.CreateClient();

        var scopeFactory = _factory.Services.GetService<IServiceScopeFactory>()
            ?? throw new InvalidOperationException("IServiceScopeFactory not registered.");

        var scope = scopeFactory.CreateScope();
        _dbContext = scope.ServiceProvider.GetService<ChessAppDbContext>()
            ?? throw new InvalidOperationException("ChessAppDbContext not registered.");
    }

    [Fact]
    public async Task GetRegisterConf_Should_Return_RegisterConfigurationDto_On_Success() {

        await _dbContext.Init();


        var response = await _client.GetAsync($"api/user/configuration?configurationId={(int)DataConfiguration.UserPassword}");


        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var result = JsonConvert.DeserializeObject<GetRegisterConfDto>(await response.Content.ReadAsStringAsync());
        result.MinLength.Should().Be(5);

    }

    /// <summary>
    /// Gets with incorrect id
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async Task GetRegisterConf_Should_Return_BadRequest_On_Fail() {

        await _dbContext.Init();


        // incorrect id
        var response = await _client.GetAsync($"api/user/configuration?configurationId={1000}");


        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
}
