﻿
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
                    .Include(g => g.GameTiming)
                    .Include(g => g.WhitePlayer)
                    .Include(g => g.BlackPlayer)
                    .FirstOrDefaultAsync(g => g.WhitePlayerId == playerId || g.BlackPlayerId == playerId);

    ///<inheritdoc/>
    public async Task<Game?> GetById(Guid id)
        => await _dbContext.Games
                    .Include(g => g.GameTiming)
                    .Include(g => g.WhitePlayer)
                    .Include(g => g.BlackPlayer)
                    .FirstOrDefaultAsync(g => g.Id == id);

    ///<inheritdoc/>
    public async Task Create(Game game) {
        await _dbContext.Games.AddAsync(game);
        await _dbContext.SaveChangesAsync();
    }

}
