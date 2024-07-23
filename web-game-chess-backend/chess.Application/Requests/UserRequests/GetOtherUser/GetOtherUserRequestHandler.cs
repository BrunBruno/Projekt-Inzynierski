
using chess.Application.Repositories;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.UserRequests.GetOtherUser;

public class GetOtherUserRequestHandler : IRequestHandler<GetOtherUserRequest, GetOtherUserDto> {

    private readonly IUserRepository _userRepository;

    public GetOtherUserRequestHandler(IUserRepository userRepository) {
        _userRepository = userRepository;
    }

    public async Task<GetOtherUserDto> Handle(GetOtherUserRequest request, CancellationToken cancellationToken) {

        var user = await _userRepository.GetById(request.UserId)
            ?? throw new NotFoundException("User not found");

        var userDto = new GetOtherUserDto()
        {
            Username = user.Username,
            Name = user.Name,
            JoinDate = user.JoinDate,
            ImageUrl = user.ImageUrl,
            Country = user.Country,
            Bio = user.Bio,
            GamesPlayed = user.Stats.GamesPlayed,
        };

        return userDto;

    }
}
