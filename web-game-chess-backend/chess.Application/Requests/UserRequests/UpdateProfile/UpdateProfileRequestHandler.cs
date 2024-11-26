
using chess.Application.Repositories.UserRepositories;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.UserRequests.UpdateProfile;

/// <summary>
/// Checks if user exists
/// Updates provided data of user
/// Creates user image if provided
/// </summary>
public class UpdateProfileRequestHandler : IRequestHandler<UpdateProfileRequest> {

    private readonly IUserContextService _userContextService;
    private readonly IUserRepository _userRepository;

    public UpdateProfileRequestHandler(
        IUserContextService userContextService,
        IUserRepository userRepository
    ) {
        _userContextService = userContextService;
        _userRepository = userRepository;
    }

    public async Task Handle(UpdateProfileRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var user = await _userRepository.GetById(userId)
            ?? throw new NotFoundException("User not found.");

        user.Name = request.Name;
        user.Bio = request.Bio;

        if (request.ImageFile is not null) {
            using var memoryStream = new MemoryStream();

            await request.ImageFile.CopyToAsync(memoryStream, cancellationToken);

            var profilePicture = new UserProfileImage
            {
                Data = memoryStream.ToArray(),
                ContentType = request.ImageFile.ContentType,
                UserId = user.Id,
            };

            user.Image = profilePicture;
        } else if (request.ClearImage) {
            user.Image = null;
        }

        if (request.BackgroundFile is not null) {
            using var memoryStream = new MemoryStream();

            await request.BackgroundFile.CopyToAsync(memoryStream, cancellationToken);

            var backgroundImage = new UserBackgroundImage
            {
                Data = memoryStream.ToArray(),
                ContentType = request.BackgroundFile.ContentType,
                UserId = user.Id,
            };

            user.Background = backgroundImage;
        } else if (request.ClearBackground) {
            user.Background = null;
        }


        await _userRepository.Update(user);
    }
}
