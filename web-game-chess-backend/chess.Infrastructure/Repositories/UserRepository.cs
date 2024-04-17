
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

    public async Task<User?> GetById(Guid id)
        => await _dbContext.Users
            .Include(x => x.Role)
            .FirstOrDefaultAsync(x => x.Id == id);

    public async Task<User?> GetByEmail(string email)
        => await _dbContext.Users
            .Include(x => x.Role)
            .FirstOrDefaultAsync(x => x.Email == email);

    public async Task Add(User user) {
        await _dbContext.Users.AddAsync(user);
        await _dbContext.SaveChangesAsync();
    }

    public async Task Update(User user) {
        _dbContext.Users.Update(user);
        await _dbContext.SaveChangesAsync();
    }

    public async Task Delete(User user) {
        _dbContext.Users.Remove(user);
        await _dbContext.SaveChangesAsync();
    }
}