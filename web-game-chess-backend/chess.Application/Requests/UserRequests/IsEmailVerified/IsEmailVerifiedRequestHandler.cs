
using chess.Application.Repositories.UserRepositories;
using chess.Application.Services;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.UserRequests.IsEmailVerified;

/// <summary>
/// Check if user exists
/// Check if user is verified and returns bool value
/// </summary>
public class IsEmailVerifiedRequestHandler : IRequestHandler<IsEmailVerifiedRequest, IsEmailVerifiedDto> {

    private readonly IUserRepository _userRepository;
    private readonly IUserContextService _userContextService;

    public IsEmailVerifiedRequestHandler(
        IUserContextService userContextService,
        IUserRepository userRepository
    ) {
        _userContextService = userContextService;
        _userRepository = userRepository;
    }

    public async Task<IsEmailVerifiedDto> Handle(IsEmailVerifiedRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var user = await _userRepository.GetById(userId)
            ?? throw new NotFoundException("User was not found.");

        var isVerifiedDto = new IsEmailVerifiedDto
        {
            IsEmailVerified = user.IsVerified
        };

        return isVerifiedDto;
    }
}