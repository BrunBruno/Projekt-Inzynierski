
using chess.Application.Repositories;
using chess.Core.Entities;
using chess.Infrastructure.Contexts;

namespace chess.Infrastructure.Repositories;

public class MoveRepository : IMoveRepository {

    private readonly ChessAppDbContext _dbContext;

    public MoveRepository(ChessAppDbContext dbContext) {
        _dbContext = dbContext;
    }

    public async Task Create(Move move) {
        await _dbContext.Moves.AddAsync(move);
        await _dbContext.SaveChangesAsync();
    }
}
