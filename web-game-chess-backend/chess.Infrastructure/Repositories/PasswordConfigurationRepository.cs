
using chess.Application.Repositories;
using chess.Core.Entities;
using chess.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;

namespace chess.Infrastructure.Repositories;
public class PasswordConfigurationRepository : IPasswordConfigurationRepository {

    private readonly ChessAppDbContext _dbContext;

    public PasswordConfigurationRepository(ChessAppDbContext dbContext) {
        _dbContext = dbContext;
    }

    public async Task<PasswordConfiguration?> GetById(int id) 
        => await _dbContext.PasswordConfigurations
            .FirstAsync(x => x.Id == id);

}
