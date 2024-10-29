
using chess.Application.Repositories.WebGameRepositories;
using chess.Core.Entities;
using chess.Infrastructure.Contexts;

namespace chess.Infrastructure.Repositories.WebGameRepositories;

public class WebGameMoveRepository : IWebGameMoveRepository {

    private readonly ChessAppDbContext _dbContext;

    public WebGameMoveRepository(ChessAppDbContext dbContext) {
        _dbContext = dbContext;
    }

    ///<inheritdoc/>
    public async Task Create(WebGameMove move) {
        await _dbContext.WebGameMoves.AddAsync(move);
        await _dbContext.SaveChangesAsync();
    }
}
