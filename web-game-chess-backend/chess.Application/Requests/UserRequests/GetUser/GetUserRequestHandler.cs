using chess.Application.Repositories.UserRepositories;
using chess.Application.Services;
using chess.Core.Dtos;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.UserRequests.GetUser;

/// <summary>
/// Check if user exists
/// Creates and returns user dto
/// </summary>
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
            Username = user.Username,
            Name = user.Name,
            Country = user.Country,

            ProfilePicture = user.Image != null ?  new ImageDto() 
            {
                Data = user.Image.Data,
                ContentType = user.Image.ContentType,
            } : null,
        };

        return userDto;
    }
}
