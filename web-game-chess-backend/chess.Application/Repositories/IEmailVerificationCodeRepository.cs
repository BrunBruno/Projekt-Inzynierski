
using chess.Core.Entities;

namespace chess.Application.Repositories; 
public interface IEmailVerificationCodeRepository {

    Task<EmailVerificationCode?> GetByUserId(Guid userId);

    Task Add(EmailVerificationCode code);

    Task RemoveByUserId(Guid userId);
}
