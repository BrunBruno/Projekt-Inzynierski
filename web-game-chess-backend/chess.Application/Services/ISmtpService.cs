
namespace chess.Application.Services;

/// <summary>
/// Service used for email communication
/// </summary>
public interface ISmtpService {

    /// <summary>
    /// Sends verification code to user email
    /// </summary>
    /// <param name="email"> User email </param>
    /// <param name="recipientName"> User nickname </param>
    /// <param name="code"> code value </param>
    /// <returns></returns>
    Task SendEmailVerificationCode(string email, string recipientName, string code);

    /// <summary>
    /// Sends verification code for password reset
    /// </summary>
    /// <param name="email"></param>
    /// <param name="recipientName"></param>
    /// <param name="code"></param>
    /// <returns></returns>
    Task SendPasswordResetVerificationCode(string email, string recipientName, string code);

    /// <summary>
    /// Send game invitation
    /// </summary>
    /// <param name="email"></param>
    /// <param name="recipientName"></param>
    /// <param name="inviterName"></param>
    /// <returns></returns>
    Task SendGameInvitation(string email, string recipientName, string inviterName);
}
