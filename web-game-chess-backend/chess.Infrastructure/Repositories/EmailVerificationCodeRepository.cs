using chess.Application.Repositories;
using chess.Core.Entities;
using chess.Infrastructure.Contexts;
using chess.Shared.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace chess.Infrastructure.Repositories;

public class UserVerificationCodeRepository : IUserVerificationCodeRepository {

    private readonly ChessAppDbContext _dbContext;

    public UserVerificationCodeRepository(ChessAppDbContext dbContext) {
        _dbContext = dbContext;
    }

    ///<inheritdoc/>
    public async Task<UserVerificationCode?> GetByUserId(Guid userId)
        => await _dbContext.UserVerificationCodes
                    .FirstOrDefaultAsync(c => c.UserId == userId);

    ///<inheritdoc/>
    public async Task Add(UserVerificationCode code) {
        await _dbContext.UserVerificationCodes.AddAsync(code);
        await _dbContext.SaveChangesAsync();
    }

    ///<inheritdoc/>
    public async Task RemoveByUserId(Guid userId) {
        var code = await GetByUserId(userId)
            ?? throw new NotFoundException("Code not found.");

        _dbContext.UserVerificationCodes.Remove(code);
        await _dbContext.SaveChangesAsync();
    }
}
