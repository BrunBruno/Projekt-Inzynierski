
using chess.Application.Services;

namespace chess.Api.Tests;

public class TestSmtpService : ISmtpService {
    public Task SendGameInvitation(string email, string recipientName, string inviterName) {
        throw new NotImplementedException();
    }

    public  Task SendVerificationCode(string email, string recipientName, string code) {
        throw new NotImplementedException();
    }
}
