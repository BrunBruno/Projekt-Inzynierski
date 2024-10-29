
using chess.Application.Repositories.WebGameRepositories;
using chess.Core.Entities;
using chess.Infrastructure.Contexts;

namespace chess.Infrastructure.Repositories.WebGameRepositories;

public class WebGameStateRepository : IWebGameStateRepository {

    private readonly ChessAppDbContext _dbContext;

    public WebGameStateRepository(ChessAppDbContext dbContext) {
        _dbContext = dbContext;
    }

    ///<inheritdoc/>
    public async Task Create(WebGameState state) {
        await _dbContext.WebGameStates.AddAsync(state);
        await _dbContext.SaveChangesAsync();
    }
}
