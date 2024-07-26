
using chess.Application.Repositories;
using chess.Application.Services;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.UserRequests.UpdateProfile;

/// <summary>
/// Checks if user exists
/// Updates provided data of user
/// </summary>
public class UpdateProfileRequestHandler : IRequestHandler<UpdateProfileRequest> {

    private readonly IUserContextService _userContextService;
    private readonly IUserRepository _userRepository;

    public UpdateProfileRequestHandler(IUserContextService userContextService, IUserRepository userRepository) {
        _userContextService = userContextService;
        _userRepository = userRepository;
    }

    public async Task Handle(UpdateProfileRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var user = await _userRepository.GetById(userId)
            ?? throw new NotFoundException("User not found.");

        user.Name = request.Name;
        user.Bio = request.Bio;
        user.ImageUrl = request.ImageUrl;

        await _userRepository.Update(user);
    }
}
