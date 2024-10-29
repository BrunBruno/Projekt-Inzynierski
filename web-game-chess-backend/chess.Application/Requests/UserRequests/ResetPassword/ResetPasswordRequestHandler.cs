using chess.Application.Repositories.UserRepositories;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace chess.Application.Requests.UserRequests.ResetPassword;

/// <summary>
/// Checks if user for provided email exists
/// Validates user inputs
/// Updates user password
/// </summary>
public class ResetPasswordRequestHandler : IRequestHandler<ResetPasswordRequest> {

    private readonly IUserVerificationCodeRepository _codeRepository;
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher<UserVerificationCode> _codeHasher;
    private readonly IPasswordHasher<User> _passwordHasher;

    public ResetPasswordRequestHandler(
        IUserVerificationCodeRepository codeRepository,
        IUserRepository userRepository,
        IPasswordHasher<UserVerificationCode> codeHasher,
        IPasswordHasher<User> passwordHasher
    ) {
        _codeRepository = codeRepository;
        _userRepository = userRepository;
        _codeHasher = codeHasher;
        _passwordHasher = passwordHasher;
    }

    public async Task Handle(ResetPasswordRequest request, CancellationToken cancellationToken) {

        var user = await _userRepository.GetByEmail(request.Email)
            ?? throw new NotFoundException("User not found.");

        if (!request.NewPassword.Equals(request.ConfirmPassword))
            throw new BadRequestException("Passwords don't match.");


        var verificationCode = await _codeRepository.GetByUserId(user.Id)
            ?? throw new NotFoundException("Code not found.");

        if (verificationCode.Type != UserCodesTypes.Password)
            throw new BadRequestException("Incorrect code type.");


        var result = _codeHasher.VerifyHashedPassword(verificationCode, verificationCode.CodeHash, request.Code);


        if (result == PasswordVerificationResult.Failed)
            throw new BadRequestException("Code incorrect.");

        if (verificationCode.ExpirationDate < DateTime.UtcNow)
            throw new BadRequestException("Code has expired.");


        var hashedPassword = _passwordHasher.HashPassword(user, request.NewPassword);
        user.PasswordHash = hashedPassword;


        await _userRepository.Update(user);
    }
}
