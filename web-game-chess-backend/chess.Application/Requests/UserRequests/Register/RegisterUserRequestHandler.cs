
using chess.Application.Repositories;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Shared.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace chess.Application.Requests.UserRequests.Register;

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

        var emailAlreadyExists = await _userRepository.GetByEmail(request.Email.ToLower());

        if (emailAlreadyExists is not null)
            throw new BadRequestException("User already exists.");

        if (!request.Password.Equals(request.ConfirmPassword))
            throw new BadRequestException("Passwords don't match.");

        var user = new User() 
        {
            Id = Guid.NewGuid(),
            Email = request.Email.ToLower(),
            Username = request.Username,
            JoinDate = DateTime.UtcNow,
            Elo = 1000,
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
}
