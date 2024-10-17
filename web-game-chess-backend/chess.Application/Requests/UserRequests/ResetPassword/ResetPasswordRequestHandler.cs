
using chess.Application.Repositories;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace chess.Application.Requests.UserRequests.ResetPassword;

public class ResetPasswordRequestHandler : IRequestHandler<ResetPasswordRequest> {

    private readonly IUserVerificationCodeRepository _codeRepository;
    private readonly IUserContextService _userContext;
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher<UserVerificationCode> _codeHasher;
    private readonly IPasswordHasher<User> _passwordHasher;

    public ResetPasswordRequestHandler(
        IUserVerificationCodeRepository codeRepository,
        IUserContextService userContext,
        IUserRepository userRepository,
        IPasswordHasher<UserVerificationCode> codeHasher,
        IPasswordHasher<User> passwordHasher
    ) {
        _codeRepository = codeRepository;
        _userContext = userContext;
        _userRepository = userRepository;
        _codeHasher = codeHasher;
        _passwordHasher = passwordHasher;
    }

    public async Task Handle(ResetPasswordRequest request, CancellationToken cancellationToken) {

        var userId = _userContext.GetUserId();

        if (!request.NewPassword.Equals(request.ConfirmPassword))
            throw new BadRequestException("Passwords don't match.");


        var verificationCode = await _codeRepository.GetByUserId(userId)
            ?? throw new NotFoundException("Code not found.");

        if (verificationCode.Type != UserCodesTypes.Password)
            throw new BadRequestException("Incorrect code type.");


        var result = _codeHasher.VerifyHashedPassword(verificationCode, verificationCode.CodeHash, request.Code);


        if (result == PasswordVerificationResult.Failed)
            throw new BadRequestException("Code incorrect.");

        if (verificationCode.ExpirationDate < DateTime.UtcNow)
            throw new BadRequestException("Code has expired.");

        var user = await _userRepository.GetById(userId)
            ?? throw new NotFoundException("User not found.");


        var hashedPassword = _passwordHasher.HashPassword(user, request.NewPassword);
        user.PasswordHash = hashedPassword;


        await _userRepository.Update(user);
    }
}
