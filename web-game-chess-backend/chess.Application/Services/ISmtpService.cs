
namespace chess.Application.Services; 

public interface ISmtpService {

    Task SendMessage(string email, string subject, string message);
}
