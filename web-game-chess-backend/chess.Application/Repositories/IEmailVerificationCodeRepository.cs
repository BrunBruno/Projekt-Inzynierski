
using chess.Core.Entities;

namespace chess.Application.Repositories; 

/// <summary>
/// Email verification codes interface
/// </summary>
public interface IEmailVerificationCodeRepository {

    /// <summary>
    /// Gets code by user id
    /// </summary>
    /// <param name="userId"><param>
    /// <returns></returns>
    Task<EmailVerificationCode?> GetByUserId(Guid userId);

    /// <summary>
    /// Creates code
    /// </summary>
    /// <param name="code"></param>
    /// <returns></returns>
    Task Add(EmailVerificationCode code);

    /// <summary>
    /// Delete code by user id
    /// </summary>
    /// <param name="userId"></param>
    /// <returns></returns>
    Task RemoveByUserId(Guid userId);
}
