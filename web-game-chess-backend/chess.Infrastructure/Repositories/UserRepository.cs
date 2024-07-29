
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
    public async Task<List<User>> GetAllNonFriends(List<Guid> ids, Guid userId)
        => await _dbContext.Users
                    .Include(u => u.Elo)
                    .Where(u => !ids.Contains(u.Id) && u.IsVerified && u.Id != userId)
                    .ToListAsync();

    ///<inheritdoc/>
    public async Task<User?> GetById(Guid id)
        => await _dbContext.Users
                    .Include(u => u.Role)
                    .Include(u => u.Elo)
                    .Include(u => u.Stats)
                    .FirstOrDefaultAsync(u => u.Id == id);

    ///<inheritdoc/>
    public async Task<User?> GetByEmail(string email)
        => await _dbContext.Users
                    .Include(u => u.Role)
                    .Include(u => u.Elo)
                    .Include(u => u.Stats)
                    .FirstOrDefaultAsync(u => u.Email == email);

    ///<inheritdoc/>
    public async Task<User?> GetByUsername(string username)
        => await _dbContext.Users
                    .Include(u => u.Role)
                    .FirstOrDefaultAsync(u => u.Username == username);

    ///<inheritdoc/>
    public async Task<User?> GetByEmailOrUsername(string value) 
        => await _dbContext.Users
                    .Include(u => u.Role)
                    .FirstOrDefaultAsync(u => u.Email == value || u.Username == value);

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