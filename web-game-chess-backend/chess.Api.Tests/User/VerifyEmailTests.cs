﻿
using chess.Api.Models.UserModels;
using chess.Infrastructure.Contexts;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Net;
using System.Text;

namespace chess.Api.Tests.User;

public class VerifyEmailTests : IClassFixture<TestWebApplicationFactory<Program>> {

    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory<Program> _factory;
    private readonly ChessAppDbContext _dbContext;

    public VerifyEmailTests() {
        _factory = new TestWebApplicationFactory<Program>();

        _client = _factory.CreateClient();

        var scopeFactory = _factory.Services.GetService<IServiceScopeFactory>()
            ?? throw new InvalidOperationException("IServiceScopeFactory not registered.");

        var scope = scopeFactory.CreateScope();
        _dbContext = scope.ServiceProvider.GetService<ChessAppDbContext>()
            ?? throw new InvalidOperationException("ChessAppDbContext not registered.");
    }

    [Fact]
    public async Task VerifyEmail_Should_Set_IsVerified_To_True_On_Success() {
        
        await _dbContext.Init();
        await _dbContext.AddUser();
        await _dbContext.AddCodeForUser();

        var model = new VerifyEmailModel
        {
            Code = Constants.CodeValue
        };

        var json = JsonConvert.SerializeObject(model);
        var httpContent = new StringContent(json, Encoding.UTF8, "application/json");

        
        var response = await _client.PutAsync("api/user/verify-email", httpContent);

        
        var assertDbContext = _factory.GetDbContextForAsserts();

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var user = await assertDbContext.Users.FirstOrDefaultAsync();
        user.IsVerified.Should().BeTrue();
    }

    /// <summary>
    /// Verifying user without existing code.
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async Task VerifyEmail_Should_Return_NotFound_On_Fail() {

        await _dbContext.Init();
        await _dbContext.AddUser();

        var mdoel = new VerifyEmailModel
        {
            Code = Constants.CodeValue
        };

        var json = JsonConvert.SerializeObject(mdoel);
        var httpContent = new StringContent(json, Encoding.UTF8, "application/json");


        var response = await _client.PutAsync("api/user/verify-email", httpContent);


        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    /// <summary>
    /// Verifying user with incorrect code.
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async Task VerifyEmail_Should_Return_BadRequest_On_Fail() {

        await _dbContext.Init();
        await _dbContext.AddUser();
        await _dbContext.AddCodeForUser();

        var model = new VerifyEmailModel
        {
            Code = "Incorrect"
        };

        var json = JsonConvert.SerializeObject(model);

        var httpContent = new StringContent(json, Encoding.UTF8, "application/json");


        var response = await _client.PutAsync("api/user/verify-email", httpContent);


        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
}
