
using chess.Application.Services;

namespace chess.Api.Tests;
#pragma warning disable CS1998 

public class TestSmtpService : ISmtpService {
    public async Task SendEmailVerificationCode(string email, string recipientName, string code) {
    }

    public async Task SendGameInvitation(string email, string recipientName, string inviterName) {
    }

    public async Task SendPasswordResetVerificationCode(string email, string recipientName, string code) {
    }
}
