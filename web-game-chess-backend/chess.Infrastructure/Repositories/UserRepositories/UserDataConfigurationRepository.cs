
using chess.Application.Repositories.UserRepositories;
using chess.Core.Entities;
using chess.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;

namespace chess.Infrastructure.Repositories.UserRepositories;

public class UserDataConfigurationRepository : IUserDataConfigurationRepository {

    private readonly ChessAppDbContext _dbContext;

    public UserDataConfigurationRepository(ChessAppDbContext dbContext) {
        _dbContext = dbContext;
    }

    ///<inheritdoc/>
    public async Task<UserDataConfiguration?> GetById(int id)
        => await _dbContext.DataConfigurations
                    .FirstAsync(c => c.Id == id);

}
