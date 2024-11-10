using chess.Core.Entities;

namespace chess.Application.Repositories.UserRepositories;

/// <summary>
/// Email verification codes interface
/// </summary>
public interface IUserVerificationCodeRepository
{

    /// <summary>
    /// Gets code by user id
    /// </summary>
    /// <param name="userId"><param>
    /// <returns></returns>
    Task<UserVerificationCode?> GetByUserId(Guid userId);

    /// <summary>
    /// Creates code
    /// </summary>
    /// <param name="code"></param>
    /// <returns></returns>
    Task Add(UserVerificationCode code);

    /// <summary>
    /// Delete code by user id
    /// </summary>
    /// <param name="userId"></param>
    /// <returns></returns>
    Task RemoveByUserId(Guid userId);
}
