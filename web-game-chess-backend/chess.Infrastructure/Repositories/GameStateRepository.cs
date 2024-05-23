
using chess.Application.Repositories;
using chess.Core.Entities;
using chess.Infrastructure.Contexts;

namespace chess.Infrastructure.Repositories;

public class GameStateRepository : IGameStateRepository {

    private readonly ChessAppDbContext _dbContext;

    public GameStateRepository(ChessAppDbContext dbContext) {
        _dbContext = dbContext;
    }

    ///<inheritdoc/>
    public async Task Create(GameState gameState) {
        await _dbContext.GameStates.AddAsync(gameState);
        await _dbContext.SaveChangesAsync();
    }
}
