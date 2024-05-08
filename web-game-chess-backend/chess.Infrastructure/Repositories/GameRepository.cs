
using chess.Application.Repositories;
using chess.Core.Entities;
using chess.Infrastructure.Contexts;

namespace chess.Infrastructure.Repositories;

public class GameRepository : IGameRepository {

    private readonly ChessAppDbContext _dbContext;

    public GameRepository(ChessAppDbContext dbContext) {
        _dbContext = dbContext;
    }

    public async Task Create(Game game) {
        await _dbContext.Games.AddAsync(game);
        await _dbContext.SaveChangesAsync();
    }
}
