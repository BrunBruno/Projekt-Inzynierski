
using chess.Infrastructure.Contexts;
using Microsoft.Extensions.DependencyInjection;

namespace chess.Api.Tests;

public static class Extensions {

    public static ChessAppDbContext GetDbContextForAsserts(this TestWebApplicationFactory<Program> factory) {

        var scopeFactory = factory.Services.GetService<IServiceScopeFactory>()
            ?? throw new InvalidOperationException();
        
        var scope = scopeFactory.CreateScope();
        var assertDbContext = scope.ServiceProvider.GetService<ChessAppDbContext>()
             ?? throw new InvalidOperationException();

        return assertDbContext;
    }
}
