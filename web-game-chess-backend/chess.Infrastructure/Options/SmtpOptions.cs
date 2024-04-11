
namespace chess.Infrastructure.Options; 

public class SmtpOptions {

    public string Host {  get; set; }
    public int Port { get; set; }
    public bool EnableSsl { get; set; }
    public string FromMail { get; set; }
    public string FromPassword { get; set; }
    public string Body { get; set; }
}
