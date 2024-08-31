
using chess.Application.Services;

namespace chess.Api.Tests;

public class TestSmtpService : ISmtpService {
    public async Task SendGameInvitation(string email, string recipientName, string inviterName) {
    }

    public async Task SendVerificationCode(string email, string recipientName, string code) {
    }
}
