﻿
using chess.Application.Repositories;
using chess.Core.Entities;
using chess.Infrastructure.Contexts;

namespace chess.Infrastructure.Repositories;

public class UserEloRepository : IUserEloRepository {

    private readonly ChessAppDbContext _dbContext;

    public UserEloRepository(ChessAppDbContext dbContext) {
        _dbContext = dbContext;
    }

    ///<inheritdoc/>
    public async Task Update(UserElo elo) {
        _dbContext.UserElos.Update(elo);
        await _dbContext.SaveChangesAsync();
    }
}