
using chess.Application.Repositories.UserRepositories;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;

namespace chess.Infrastructure.Repositories.UserRepositories;

public class UserRepository : IUserRepository {

    private readonly ChessAppDbContext _dbContext;

    public UserRepository(ChessAppDbContext dbContext) {
        _dbContext = dbContext;
    }

    ///<inheritdoc/>
    public async Task<User?> GetById(Guid id)
        => await _dbContext.Users
                    .Include(u => u.Role)
                    .Include(u => u.Image)
                    .Include(u => u.Background)
                    .Include(u => u.Elo)
                    .Include(u => u.Stats)
                    .FirstOrDefaultAsync(u => u.Id == id);

    ///<inheritdoc/>
    public async Task<User?> GetByEmail(string email)
        => await _dbContext.Users
                    .Include(u => u.Role)
                    .Include(u => u.Image)
                    .Include(u => u.Elo)
                    .Include(u => u.Stats)
                    .FirstOrDefaultAsync(u => u.Email == email);

    ///<inheritdoc/>
    public async Task<User?> GetByUsername(string username)
        => await _dbContext.Users
                    .Include(u => u.Role)
                    .Include(u => u.Image)
                    .FirstOrDefaultAsync(u => u.Username == username);

    ///<inheritdoc/>
    public async Task<User?> GetByEmailOrUsername(string value)
        => await _dbContext.Users
                    .Include(u => u.Role)
                    .Include(u => u.Image)
                    .FirstOrDefaultAsync(u => u.Email == value || u.Username == value);

    ///<inheritdoc/>
    public async Task<List<User>> GetAllNonFriends(List<Guid> ids, Guid userId)
        => await _dbContext.Users
                    .Include(u => u.Image)
                    .Include(u => u.Elo)
                    .Include(u => u.Stats)
                    .Where(u => !ids.Contains(u.Id) && u.IsVerified && u.Id != userId && !u.IsPrivate)
                    .ToListAsync();

    ///<inheritdoc/>
    public async Task<List<User>> GetAllFriends(List<Guid> ids, Guid userId)
        => await _dbContext.Users
                    .Include(u => u.Image)
                    .Include(u => u.Elo)
                    .Include(u => u.Stats)
                    .Where(u => ids.Contains(u.Id) && u.IsVerified && u.Id != userId)
                    .ToListAsync();

    ///<inheritdoc/>
    public async Task<List<User>> GetAllJoinedToday()
        => await _dbContext.Users
                    .Where(u => u.JoinDate.Date == DateTime.UtcNow.Date)
                    .ToListAsync();

    ///<inheritdoc/>
    public async Task<List<User>> GetAllOrderByRating(TimingTypes type) {
        var users = _dbContext.Users
            .Include(u => u.Image)
            .Include(u => u.Elo)
            .Include(u => u.Stats)
            .Where(u => u.IsVerified);

        var result = await users.ToListAsync();

        var orderedResult = result
            .OrderByDescending(u =>
                type == TimingTypes.Bullet ? u.Elo.Bullet :
                type == TimingTypes.Blitz ? u.Elo.Blitz :
                type == TimingTypes.Rapid ? u.Elo.Rapid :
                type == TimingTypes.Classic ? u.Elo.Classic :
                type == TimingTypes.Daily ? u.Elo.Daily : 0)
            .ThenByDescending(u => u.Stats.OnlineWins)
            .ToList();

        return orderedResult;
    }

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