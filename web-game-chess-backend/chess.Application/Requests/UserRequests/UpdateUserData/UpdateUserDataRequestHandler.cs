
using chess.Application.Repositories.UserRepositories;
using chess.Application.Services;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.UserRequests.UpdateUserData;

public class UpdateUserDataRequestHandler : IRequestHandler<UpdateUserDataRequest> {

    private readonly IUserContextService _userContextService;
    private readonly IUserRepository _userRepository;

    public UpdateUserDataRequestHandler(
        IUserContextService userContextService,
        IUserRepository userRepository
    ) {
        _userContextService = userContextService;
        _userRepository = userRepository;
    }

    public async Task Handle(UpdateUserDataRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var user = await _userRepository.GetById(userId)
            ?? throw new NotFoundException("User not found.");

        user.IsPrivate = request.ProfileIsPrivate;


        await _userRepository.Update(user);
    }
}
