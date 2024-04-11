
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
        mailMessage.AlternateViews.Add(GetEmbeddedImage("..\\logo-dark.png", string.Format(_smtpOptions.Body, message)));

        var smtpClient = new SmtpClient("smtp.gmail.com")
        {
            Port = 587,
            Credentials = new NetworkCredential(fromMail, fromPassword),
            EnableSsl = true
        };

        smtpClient.Send(mailMessage);
    }

    private AlternateView GetEmbeddedImage(string imagePath, string emailBody) {

        var imageResource = new LinkedResource(imagePath)
        {
            ContentId = Guid.NewGuid().ToString()
        };

        string htmlBody = $@"<html><body><img src='cid:{imageResource.ContentId}'/>{emailBody}</body></html>";

        var alternateView = AlternateView.CreateAlternateViewFromString(htmlBody, null, MediaTypeNames.Text.Html);

        alternateView.LinkedResources.Add(imageResource);

        return alternateView;
    }
}
