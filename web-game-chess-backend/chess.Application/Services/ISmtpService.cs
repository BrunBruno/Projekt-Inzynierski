
using System.Net.Mail;

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
    Task SendVerificationCode(string email, string recipientName, string code);
}
