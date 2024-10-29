using chess.Application.Repositories.UserRepositories;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace chess.Application.Requests.UserRequests.SendResetPasswordCode;

/// <summary>
/// Checks if user for provided email exists
/// Remove existing verification code for user
/// Creates new verification code for password reset
/// Sends email with code to user mail
/// </summary>
public class SendResetPasswordCodeRequestHandler : IRequestHandler<SendResetPasswordCodeRequest> {

    private readonly IUserRepository _userRepository;
    private readonly IUserVerificationCodeRepository _userVerificationCodeRepository;
    private readonly ISmtpService _smtpService;
    private readonly IPasswordHasher<UserVerificationCode> _codeHasher;

    public SendResetPasswordCodeRequestHandler(
        IUserRepository userRepository,
        IUserVerificationCodeRepository userVerificationCodeRepository,
        ISmtpService smtpService,
        IPasswordHasher<UserVerificationCode> codeHasher
    ) {
        _userRepository = userRepository;
        _userVerificationCodeRepository = userVerificationCodeRepository;
        _smtpService = smtpService;
        _codeHasher = codeHasher;
    }

    public async Task Handle(SendResetPasswordCodeRequest request, CancellationToken cancellationToken) {

        var user = await _userRepository.GetByEmail(request.Email)
            ?? throw new NotFoundException("User not found.");


        await _userVerificationCodeRepository.RemoveByUserId(user.Id);


        var codeValue = new Random().Next(100000, 999999).ToString();

        var code = new UserVerificationCode()
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            ExpirationDate = DateTime.UtcNow.AddMinutes(15),
            Type = UserCodesTypes.Password,
        };

        var codeHash = _codeHasher.HashPassword(code, codeValue);
        code.CodeHash = codeHash;


        await _userVerificationCodeRepository.Add(code);


        await _smtpService.SendPasswordResetVerificationCode(user.Email, user.Username, codeValue);
    }
}
