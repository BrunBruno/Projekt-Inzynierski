
using chess.Application.Repositories;
using chess.Application.Services;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.UserRequests.GetUser;

public class GetUserRequestHandler : IRequestHandler<GetUserRequest, GetUserDto> {

    private readonly IUserContextService _userContext;
    private readonly IUserRepository _userRepository;

    public GetUserRequestHandler(
        IUserContextService userContext,
        IUserRepository userRepository
    ) {
        _userContext = userContext;
        _userRepository = userRepository;
    }

    public async Task<GetUserDto> Handle(GetUserRequest request, CancellationToken cancellationToken) {

        var userId = _userContext.GetUserId();

        var user = await _userRepository.GetById(userId)
            ?? throw new NotFoundException("User not found.");

        var userDto = new GetUserDto
        {
            UserId = userId,
            Email = user.Email,
            UserName = user.Username,
            FullName = user.Name,
            ImageUrl = user.ImageUrl,
        };

        return userDto;
    }
}
