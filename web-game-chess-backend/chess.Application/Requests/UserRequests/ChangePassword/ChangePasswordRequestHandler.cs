
using chess.Application.Repositories.UserRepositories;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Shared.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace chess.Application.Requests.UserRequests.ChangePassword;

public class ChangePasswordRequestHandler : IRequestHandler<ChangePasswordRequest> {

    private readonly IUserContextService _userContextService;
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher<User> _passwordHasher;

    public ChangePasswordRequestHandler(
        IUserContextService userContextService,
        IUserRepository userRepository,
        IPasswordHasher<User> passwordHasher
    ) {
        _userContextService = userContextService;
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
    }

    public async Task Handle(ChangePasswordRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var user = await _userRepository.GetById(userId)
            ?? throw new NotFoundException("User not found");

        if (!request.NewPassword.Equals(request.ConfirmPassword))
            throw new BadRequestException("Passwords don't match");


        var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.OldPassword);

        if (result == PasswordVerificationResult.Failed)
            throw new BadRequestException("Old password incorrect");


        var hashedPassword = _passwordHasher.HashPassword(user, request.NewPassword);
        user.PasswordHash = hashedPassword;


        await _userRepository.Update(user);
    }
}
