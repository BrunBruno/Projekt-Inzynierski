
using chess.Application.Repositories;
using chess.Core.Entities;
using chess.Infrastructure.Contexts;

namespace chess.Infrastructure.Repositories;

public class EloRepository : IEloRepository {

    private readonly ChessAppDbContext _dbContext;

    public EloRepository(ChessAppDbContext dbContext) {
        _dbContext = dbContext;
    }

    public async Task Update(Elo elo) {
        _dbContext.Elos.Update(elo);
        await _dbContext.SaveChangesAsync();
    }
}
