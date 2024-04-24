﻿
using chess.Application.Repositories;
using chess.Core.Entities;
using chess.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;

namespace chess.Infrastructure.Repositories;
public class DataConfigurationRepository : IDataConfigurationRepository {

    private readonly ChessAppDbContext _dbContext;

    public DataConfigurationRepository(ChessAppDbContext dbContext) {
        _dbContext = dbContext;
    }

    public async Task<DataConfiguration?> GetById(int id) 
        => await _dbContext.DataConfigurations
            .FirstAsync(x => x.Id == id);

}