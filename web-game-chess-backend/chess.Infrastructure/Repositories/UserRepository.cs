
using chess.Application.Repositories;
using chess.Core.Entities;
using chess.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;

namespace chess.Infrastructure.Repositories;

public class UserRepository : IUserRepository {

    private readonly ChessAppDbContext _dbContext;

    public UserRepository(ChessAppDbContext dbContext) {
        _dbContext = dbContext;
    }

    ///<inheritdoc/>
    public async Task<User?> GetById(Guid id)
        => await _dbContext.Users
                    .Include(u => u.Role)
                    .FirstOrDefaultAsync(u => u.Id == id);

    ///<inheritdoc/>
    public async Task<User?> GetByEmail(string email)
        => await _dbContext.Users
                    .Include(u => u.Role)
                    .FirstOrDefaultAsync(u => u.Email == email);

    ///<inheritdoc/>
    public async Task Add(User user) {
        await _dbContext.Users.AddAsync(user);
        await _dbContext.SaveChangesAsync();
    }

    ///<inheritdoc/>
    public async Task Update(User user) {
        _dbContext.Users.Update(user);
        await _dbContext.SaveChangesAsync();
    }

    ///<inheritdoc/>
    public async Task Delete(User user) {
        _dbContext.Users.Remove(user);
        await _dbContext.SaveChangesAsync();
    }
}