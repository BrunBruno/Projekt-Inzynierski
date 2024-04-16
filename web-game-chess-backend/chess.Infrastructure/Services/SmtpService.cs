
using chess.Application.Services;
using System.Net.Mail;
using System.Net;
using System.Net.Mime;
using chess.Infrastructure.Options;

namespace chess.Infrastructure.Services;

public class SmtpService : ISmtpService {

    private readonly SmtpOptions _smtpOptions;

    public SmtpService(SmtpOptions smtpOptions) {
        _smtpOptions = smtpOptions;
    }

    public async Task SendMessage(string email, string subject, string message) {

        string fromMail = _smtpOptions.FromMail;
        string fromPassword = _smtpOptions.FromPassword;

        var mailMessage = new MailMessage
        {
            From = new MailAddress(fromMail),
            Subject = subject,
            IsBodyHtml = true,
        };

        mailMessage.To.Add(new MailAddress(email));

        mailMessage.AlternateViews.Add(GetEmbeddedImage("../public/logo.png", string.Format(_smtpOptions.Body, message)));

        using (var smtpClient = new SmtpClient(_smtpOptions.Host, _smtpOptions.Port)) {

            smtpClient.Credentials = new NetworkCredential(fromMail, fromPassword);
            smtpClient.EnableSsl = _smtpOptions.EnableSsl;

            await smtpClient.SendMailAsync(mailMessage);
        }
    }

    private AlternateView GetEmbeddedImage(string imagePath, string emailBody) {

        var imageResource = new LinkedResource(imagePath)
        {
            ContentId = Guid.NewGuid().ToString()
        };

        string htmlBody = $@"
            <html>
            <body style='color: #000;'>
                
                <h2 style='display: inline-block; font-size: 32px; color: #000;'>Hello from <br/> BRN Chess</h2>
                <img width='100px' style='display: inline-block; margin-left: 30px;' src='cid:{imageResource.ContentId}'/>
                
                <br/>
                <b>Dear user,</b>
                <p>Thank you for joining in our platform. We're excited to have you on board!</p>
                <p>To complete your account setup, please find below your verification code:</p>
                <h3>Your verification code:</h3>
                <p style='color: #da77f2; background-color: #333; padding: 10px; border-radius: 5px; margin-left: 1rem; font-size: 2rem; width: fit-content;'>{emailBody}</p>
            </body>
            </html>";

        var alternateView = AlternateView.CreateAlternateViewFromString(htmlBody, null, MediaTypeNames.Text.Html);

        alternateView.LinkedResources.Add(imageResource);

        return alternateView;
    }
}
