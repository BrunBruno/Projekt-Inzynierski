﻿
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

    ///<inheritdoc/>
    public async Task SendEmailVerificationCode(string email, string recipientName, string code) {

        string fromMail = _smtpOptions.FromMail!;
        string fromPassword = _smtpOptions.FromPassword!;

        string subject = "Hello " + recipientName;

        var mailMessage = new MailMessage
        {
            From = new MailAddress(fromMail),
            Subject = subject,
            IsBodyHtml = true,
        };

        mailMessage.To.Add(new MailAddress(email));

        mailMessage.AlternateViews.Add(GetWelcomeMailBody("../public/logo.png", string.Format(_smtpOptions.Body!, code)));

        using (var smtpClient = new SmtpClient(_smtpOptions.Host, _smtpOptions.Port)) {

            smtpClient.Credentials = new NetworkCredential(fromMail, fromPassword);
            smtpClient.EnableSsl = _smtpOptions.EnableSsl;

            await smtpClient.SendMailAsync(mailMessage);
        }
    }

    ///<inheritdoc/>
    public async Task SendPasswordResetVerificationCode(string email, string recipientName, string code) {

        string fromMail = _smtpOptions.FromMail!;
        string fromPassword = _smtpOptions.FromPassword!;

        string subject = "Password reset";

        var mailMessage = new MailMessage
        {
            From = new MailAddress(fromMail),
            Subject = subject,
            IsBodyHtml = true,
        };

        mailMessage.To.Add(new MailAddress(email));

        mailMessage.AlternateViews.Add(GetPasswordRecoveryMailBody(string.Format(_smtpOptions.Body!, code)));

        using var smtpClient = new SmtpClient(_smtpOptions.Host, _smtpOptions.Port);

        smtpClient.Credentials = new NetworkCredential(fromMail, fromPassword);
        smtpClient.EnableSsl = _smtpOptions.EnableSsl;

        await smtpClient.SendMailAsync(mailMessage);
    }

    ///<inheritdoc/>
    public async Task SendGameInvitation(string email, string recipientName, string inviterName) {
        string fromMail = _smtpOptions.FromMail!;
        string fromPassword = _smtpOptions.FromPassword!;

        string subject = "New game invitation";

        var mailMessage = new MailMessage
        {
            From = new MailAddress(fromMail),
            Subject = subject,
            IsBodyHtml = true,
        };

        mailMessage.To.Add(new MailAddress(email));

        mailMessage.Body = $"<b>Hello {recipientName},</b> <br/> {inviterName} has invited you to new game. <br/> <a href='http://localhost:5173/main'>Click here to accept invitation.</a>";

        using var smtpClient = new SmtpClient(_smtpOptions.Host, _smtpOptions.Port);

        smtpClient.Credentials = new NetworkCredential(fromMail, fromPassword);
        smtpClient.EnableSsl = _smtpOptions.EnableSsl;

        await smtpClient.SendMailAsync(mailMessage);
    }

    private static AlternateView GetWelcomeMailBody(string imagePath, string code) {

        LinkedResource? imageResource = null;
        string imageHtml = string.Empty;

         try{
            if (!string.IsNullOrEmpty(imagePath) && File.Exists(imagePath)) {
                imageResource = new LinkedResource(imagePath)
                {
                    ContentId = Guid.NewGuid().ToString()
                };

                imageHtml = $"<img width='100px' style='display: inline-block; margin-left: 30px;' src='cid:{imageResource.ContentId}'/>";
            }
        } catch (Exception ex){
            Console.WriteLine(ex.Message);
        }

        string htmlBody = $@"
            <html>
            <body style='color: #000;'>
                
                <h2 style='display: inline-block; font-size: 32px; color: #000;'>Hello from <br/> BRN Chess</h2>
                {imageHtml}
                <br/>
                <b>Dear user,</b>
                <p>Thank you for joining in our platform. We're excited to have you on board!</p>
                <p>To complete your account setup, please find below your verification code:</p>
                <h3>Your verification code:</h3>
                <p style='color: #da77f2; background-color: #333; padding: 10px; border-radius: 5px; margin-left: 1rem; font-size: 2rem; width: fit-content;'>{code}</p>
            </body>
            </html>";

        var alternateView = AlternateView.CreateAlternateViewFromString(htmlBody, null, MediaTypeNames.Text.Html);

        if (imageResource != null) {
            alternateView.LinkedResources.Add(imageResource);
        }

        return alternateView;
    }

    private static AlternateView GetPasswordRecoveryMailBody(string code) {

        string htmlBody = $@"
            <html>
            <body style='color: #000;'>
                <b>Dear user,</b>
                <p>To reset your account password, please enter this verification code in form.</p>
                <h3>Your password reset verification code:</h3>
                <p style='color: #da77f2; background-color: #333; padding: 10px; border-radius: 5px; margin-left: 1rem; font-size: 2rem; width: fit-content;'>{code}</p>
            </body>
            </html>";

        var alternateView = AlternateView.CreateAlternateViewFromString(htmlBody, null, MediaTypeNames.Text.Html);

        return alternateView;
    }
}
