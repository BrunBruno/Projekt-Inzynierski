
using chess.Application.Repositories;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Shared.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System.Net.Mail;

namespace chess.Application.Requests.UserRequests.RegisterUser;


/// <summary>
/// Validates provided data
/// Checks if user not exists
/// Creates new user
/// Hashes password
/// Creates and hashes verification code
/// Sends created code by provided email
/// </summary>
public class RegisterUserRequestHandler : IRequestHandler<RegisterUserRequest> {

    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher<User> _passwordHasher;
    private readonly ISmtpService _smtpService;
    private readonly IEmailVerificationCodeRepository _codeRepository;
    private readonly IPasswordHasher<EmailVerificationCode> _codeHasher;

    public RegisterUserRequestHandler(
        IUserRepository userRepository,
        IPasswordHasher<User> passwordHasher,
        ISmtpService smtpService,
        IEmailVerificationCodeRepository codeRepository,
        IPasswordHasher<EmailVerificationCode> codeHasher
    ) {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _smtpService = smtpService;
        _codeRepository = codeRepository;
        _codeHasher = codeHasher;
    }

    public async Task Handle(RegisterUserRequest request, CancellationToken cancellationToken) {

        if (!IsValidEmail(request.Email))
            throw new BadRequestException("Invalid email format.");

        var emailAlreadyExists = await _userRepository.GetByEmail(request.Email.ToLower());
        if (emailAlreadyExists is not null)
            throw new BadRequestException("Email already taken");

        var usernameAlreadyExists = await _userRepository.GetByUsername(request.Username);
        if (usernameAlreadyExists is not null)
            throw new BadRequestException("Username already taken.");

        if (!request.Password.Equals(request.ConfirmPassword))
            throw new BadRequestException("Passwords don't match.");

        var user = new User() 
        {
            Id = Guid.NewGuid(),
            Email = request.Email.ToLower(),
            Username = request.Username,
            Country = request.Country,
            Elo = new Elo(),
            Stats = new UserStats(),
        };

        var hashedPassword = _passwordHasher.HashPassword(user, request.Password);
        user.PasswordHash = hashedPassword;


        await _userRepository.Add(user);

        
        var codeValue = new Random().Next(100000, 999999).ToString();

        var code = new EmailVerificationCode()
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            ExpirationDate = DateTime.UtcNow.AddMinutes(15),
        };

        var codeHash = _codeHasher.HashPassword(code, codeValue);

        code.CodeHash = codeHash;


        await _codeRepository.Add(code);


        await _smtpService.SendVerificationCode(request.Email.ToLower(), request.Username, codeValue);

    }

    private static bool IsValidEmail(string email) {
        if (string.IsNullOrWhiteSpace(email))
            return false;

        try {
            var addr = new MailAddress(email);
            return addr.Address == email;
        } catch {
            return false;
        }
    }
}
