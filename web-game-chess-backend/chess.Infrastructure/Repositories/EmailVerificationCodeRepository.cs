using chess.Application.Repositories;
using chess.Core.Entities;
using chess.Infrastructure.Contexts;
using chess.Shared.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace chess.Infrastructure.Repositories;

public class EmailVerificationCodeRepository : IEmailVerificationCodeRepository {

    private readonly ChessAppDbContext _dbContext;

    public EmailVerificationCodeRepository(ChessAppDbContext dbContext) {
        _dbContext = dbContext;
    }

    ///<inheritdoc/>
    public async Task<EmailVerificationCode?> GetByUserId(Guid userId)
        => await _dbContext.EmailVerificationCodes
                    .FirstOrDefaultAsync(c => c.UserId == userId);

    ///<inheritdoc/>
    public async Task Add(EmailVerificationCode code) {
        await _dbContext.EmailVerificationCodes.AddAsync(code);
        await _dbContext.SaveChangesAsync();
    }

    ///<inheritdoc/>
    public async Task RemoveByUserId(Guid userId) {
        var code = await GetByUserId(userId)
            ?? throw new NotFoundException("Code not found.");

        _dbContext.EmailVerificationCodes.Remove(code);
        await _dbContext.SaveChangesAsync();
    }
}
