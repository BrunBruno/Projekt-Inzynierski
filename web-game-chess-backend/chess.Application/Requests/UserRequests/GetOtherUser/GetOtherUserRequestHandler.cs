
using chess.Application.Repositories.UserRepositories;
using chess.Core.Dtos;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.UserRequests.GetOtherUser;

/// <summary>
/// Check if user with provided id exists
/// Returns user dto
/// </summary>
public class GetOtherUserRequestHandler : IRequestHandler<GetOtherUserRequest, GetOtherUserDto> {

    private readonly IUserRepository _userRepository;

    public GetOtherUserRequestHandler(IUserRepository userRepository) {
        _userRepository = userRepository;
    }

    public async Task<GetOtherUserDto> Handle(GetOtherUserRequest request, CancellationToken cancellationToken) {

        var user = await _userRepository.GetById(request.UserId)
            ?? throw new NotFoundException("User not found.");

        var userDto = new GetOtherUserDto()
        {
            Username = user.Username,
            Name = user.Name,
            JoinDate = user.JoinDate,
            Country = user.Country,
            Bio = user.Bio,
            GamesPlayed = user.Stats.OnlineGamesPlayed,

            ProfilePicture = user.Image != null ? new ImageDto(){
                Data = user.Image.Data,
                ContentType = user.Image.ContentType,
            } : null,

            BackgroundImage = user.Background != null ? new ImageDto()
            {
                Data = user.Background.Data,
                ContentType = user.Background.ContentType,
            } : null,

            Elo = new EloDto()
            {
                Bullet = user.Elo.Bullet,
                Blitz = user.Elo.Blitz,
                Rapid = user.Elo.Rapid,
                Classic = user.Elo.Classic,
                Daily = user.Elo.Daily,
            }
        };


        return userDto;
    }
}
