using chess.Application.Repositories.FriendshipRepositories;
using chess.Application.Repositories.UserRepositories;
using chess.Application.Services;
using chess.Core.Abstraction;
using chess.Core.Dtos;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.FriendshipRequests.GetFriendProfile;

/// <summary>
/// Checks if friendships exists
/// Checks if found friendship belongs to current user
/// Checks if friendship is accepted
/// Creates and returns user profile dto
/// </summary>
public class GetFriendProfileRequestHandler : IRequestHandler<GetFriendProfileRequest, GetFriendProfileDto> {

    private readonly IUserContextService _userContextService;
    private readonly IFriendshipRepository _friendshipRepository;
    private readonly IUserRepository _userRepository;

    public GetFriendProfileRequestHandler(
        IUserContextService userContextService,
        IFriendshipRepository friendshipRepository,
        IUserRepository userRepository
    ) {
        _userContextService = userContextService;
        _friendshipRepository = friendshipRepository;
        _userRepository = userRepository;
    }

    public async Task<GetFriendProfileDto> Handle(GetFriendProfileRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var friendship = await _friendshipRepository.GetById(request.FriendshipId)
            ?? throw new NotFoundException("Friendship not found.");

        if (friendship.RequestorId != userId && friendship.ReceiverId != userId)
            throw new UnauthorizedException("This is not user friendship");

        if (friendship.Status != Core.Enums.FriendshipStatus.Accepted)
            throw new BadRequestException("This friendship is not accepted.");

        var friendId = userId == friendship.RequestorId ? friendship.ReceiverId : friendship.RequestorId;

        var friend = await _userRepository.GetById(friendId)
            ?? throw new NotFoundException("Friend not found");


        var profileDto = new GetFriendProfileDto()
        {
            Username = friend.Username,
            Name = friend.Name,
            Country = friend.Country,
            JoinDate = friend.JoinDate,
            Bio = friend.Bio,
            FriendsSince = friendship.RequestRespondedAt,

            ProfilePicture = friend.Image != null ? new ImageDto() {
                Data = friend.Image.Data,
                ContentType = friend.Image.ContentType,
            } : null,

            Elo = new EloDto() {
                Bullet = friend.Elo.Bullet,
                Blitz = friend.Elo.Blitz,
                Rapid = friend.Elo.Rapid,
                Classic = friend.Elo.Classic,
                Daily = friend.Elo.Daily,
            },

            OutcomeTotal = new GameOutcomeDto() {
                Total = friend.Stats.GamesPlayed,
                Wins = friend.Stats.Wins,
                Loses = friend.Stats.Loses,
                Draws = friend.Stats.Draws,
            },

            OutcomeTogether = new GameOutcomeDto() {
                Total = friendship.GamesPlayed,
                Wins = friendship.RequestorId == userId ? friendship.RequestorWins : friendship.RequestorLoses,
                Loses = friendship.RequestorId == userId ? friendship.RequestorLoses : friendship.RequestorWins,
                Draws = friendship.RequestorDraws,
            },
        };

        return profileDto;
    }
}
