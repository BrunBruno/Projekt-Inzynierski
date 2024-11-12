
using chess.Application.Repositories.UserRepositories;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace chess.Application.Requests.UserRequests.RegenerateCode;

/// <summary>
/// Checks if user exists
/// Removes previous code
/// Creates new verification code
/// Send new code by email
/// </summary>
public class RegenerateCodeRequestHandler : IRequestHandler<RegenerateCodeRequest> {

    private readonly IUserVerificationCodeRepository _userVerificationCodeRepository;
    private readonly IUserContextService _userContextService;
    private readonly IPasswordHasher<UserVerificationCode> _codeHasher;
    private readonly ISmtpService _smtpService;
    private readonly IUserRepository _userRepository;

    public RegenerateCodeRequestHandler(
        IUserVerificationCodeRepository userVerificationCodeRepository,
        IUserContextService userContextService,
        IPasswordHasher<UserVerificationCode> codeHasher,
        ISmtpService smtpService,
        IUserRepository userRepository
    ) {
        _userVerificationCodeRepository = userVerificationCodeRepository;
        _userContextService = userContextService;
        _codeHasher = codeHasher;
        _smtpService = smtpService;
        _userRepository = userRepository;
    }

    public async Task Handle(RegenerateCodeRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var user = await _userRepository.GetById(userId)
            ?? throw new NotFoundException("User not found.");


        await _userVerificationCodeRepository.RemoveByUserId(userId);


        var codeValue = new Random().Next(100000, 999999).ToString();

        var code = new UserVerificationCode()
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            ExpirationDate = DateTime.UtcNow.AddMinutes(15),
            Type = UserCodesTypes.Email,
        };

        var codeHash = _codeHasher.HashPassword(code, codeValue);
        code.CodeHash = codeHash;


        await _userVerificationCodeRepository.Add(code);


        await _smtpService.SendEmailVerificationCode(user.Email, user.Username, codeValue);
    }
}