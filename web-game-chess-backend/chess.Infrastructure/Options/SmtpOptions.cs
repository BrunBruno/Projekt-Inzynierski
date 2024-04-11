
namespace chess.Infrastructure.Options; 

public class SmtpOptions {

    public string FromMail { get; set; }

    public string FromPassword { get; set; }

    public string Body { get; set; }
}
