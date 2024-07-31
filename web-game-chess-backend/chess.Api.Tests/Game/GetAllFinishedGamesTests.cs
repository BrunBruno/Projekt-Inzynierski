
using chess.Api.Tests.User;
using chess.Infrastructure.Contexts;
using Microsoft.Extensions.DependencyInjection;

namespace chess.Api.Tests.Game;

public class GetAllFinishedGamesTests : IClassFixture<TestWebApplicationFactory<Program>> {

    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory<Program> _factory;
    private readonly ChessAppDbContext _dbContext;

    public GetAllFinishedGamesTests() {
        _factory = new TestWebApplicationFactory<Program>();

        _client = _factory.CreateClient();

        var scopeFactory = _factory.Services.GetService<IServiceScopeFactory>()
            ?? throw new InvalidOperationException("IServiceScopeFactory not registered.");

        var scope = scopeFactory.CreateScope();
        _dbContext = scope.ServiceProvider.GetService<ChessAppDbContext>()
            ?? throw new InvalidOperationException("ChessAppDbContext not registered.");
    }

    public async Task GetFinishedGames_Should_Return_Paged_GameDtos_On_Seccess() {

        await _dbContext.Init();
        await _dbContext.AddUser();


    }
}
