﻿
using chess.Application.Repositories;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Shared.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace chess.Application.Requests.UserRequests.VerifyEmail;

public class VerifyEmailRequestHandler : IRequestHandler<VerifyEmailRequest> {

    private readonly IEmailVerificationCodeRepository _codeRepository;
    private readonly IUserContextService _userContext;
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher<EmailVerificationCode> _codeHasher;

    public VerifyEmailRequestHandler(
        IEmailVerificationCodeRepository codeRepository,
        IUserContextService userContext,
        IUserRepository userRepository,
        IPasswordHasher<EmailVerificationCode> codeHasher
    ) {
        _codeRepository = codeRepository;
        _userContext = userContext;
        _userRepository = userRepository;
        _codeHasher = codeHasher;
    }

    public async Task Handle(VerifyEmailRequest request, CancellationToken cancellationToken) {

        var userId = _userContext.GetUserId();

        var verificationCode = await _codeRepository.GetByUserId(userId)
            ?? throw new NotFoundException("Code not found.");

        var result = _codeHasher.VerifyHashedPassword(verificationCode, verificationCode.CodeHash, request.Code);

        if (result == PasswordVerificationResult.Failed)
            throw new BadRequestException("Code incorrect.");

        if (verificationCode.ExpirationDate < DateTime.UtcNow)
            throw new BadRequestException("Code has expired.");
       
        var user = await _userRepository.GetById(userId)
            ?? throw new NotFoundException("User not found.");

        user.IsVerified = true;


        await _userRepository.Update(user);
    }
}