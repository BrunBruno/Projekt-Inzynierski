
using chess.Application.Repositories;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Shared.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace chess.Application.Requests.UserRequests.RegenerateCode;

public class RegenerateCodeRequestHandler : IRequestHandler<RegenerateCodeRequest> {

    private readonly IEmailVerificationCodeRepository _emailVerificationCodeRepository;
    private readonly IUserContextService _userContextService;
    private readonly IPasswordHasher<EmailVerificationCode> _codeHasher;
    private readonly ISmtpService _smtpService;
    private readonly IUserRepository _userRepository;

    public RegenerateCodeRequestHandler(
        IEmailVerificationCodeRepository emailVerificationCodeRepository,
        IUserContextService userContextService,
        IPasswordHasher<EmailVerificationCode> codeHasher,
        ISmtpService smtpService,
        IUserRepository userRepository
    ) {
        _emailVerificationCodeRepository = emailVerificationCodeRepository;
        _userContextService = userContextService;
        _codeHasher = codeHasher;
        _smtpService = smtpService;
        _userRepository = userRepository;
    }

    public async Task Handle(RegenerateCodeRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var user = await _userRepository.GetById(userId)
            ?? throw new NotFoundException("User not found.");

        await _emailVerificationCodeRepository.RemoveByUserId(userId);

        var codeValue = new Random().Next(100000, 999999).ToString();

        var code = new EmailVerificationCode()
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            ExpirationDate = DateTime.UtcNow.AddMinutes(15),
        };

        var codeHash = _codeHasher.HashPassword(code, codeValue);

        code.CodeHash = codeHash;

        await _emailVerificationCodeRepository.Add(code);

        await _smtpService.SendVerificationCode(user.Email, user.Username, codeValue);
    }
}