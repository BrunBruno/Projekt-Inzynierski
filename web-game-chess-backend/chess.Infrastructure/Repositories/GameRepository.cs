
using chess.Application.Repositories;
using chess.Core.Entities;
using chess.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;

namespace chess.Infrastructure.Repositories;

public class GameRepository : IGameRepository {

    private readonly ChessAppDbContext _dbContext;

    public GameRepository(ChessAppDbContext dbContext) {
        _dbContext = dbContext;
    }

    ///<inheritdoc/>
    public async Task<Game?> GetGameForPlayer(Guid playerId)
        => await _dbContext.Games
                    .FirstOrDefaultAsync(g => g.WhitePlayerId == playerId || g.BlackPlayerId == playerId);

    ///<inheritdoc/>
    public async Task<Game?> GetById(Guid id)
        => await _dbContext.Games
                    .Include(g => g.Moves)
                    .Include(g => g.WhitePlayer)
                        .ThenInclude(p => p.User)
                            .ThenInclude(u => u.Image)
                    .Include(g => g.BlackPlayer)
                        .ThenInclude(p => p.User)
                            .ThenInclude(u => u.Image)
                    .Include(g => g.GameTiming)
                    .Include(g => g.GameState)
                    .FirstOrDefaultAsync(g => g.Id == id);

    ///<inheritdoc/>
    public async Task Create(Game game) {
        await _dbContext.Games.AddAsync(game);
        await _dbContext.SaveChangesAsync();
    }

    ///<inheritdoc/>
    public async Task Update(Game game) {
        _dbContext.Games.Update(game);
        await _dbContext.SaveChangesAsync();
    }


    ///<inheritdoc/>
    public async Task Delete(Game game) {
        _dbContext.Games.Remove(game);
        await _dbContext.SaveChangesAsync();
    }
}
