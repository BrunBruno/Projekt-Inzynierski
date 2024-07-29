
using chess.Application.Repositories;
using chess.Application.Services;
using chess.Core.Dtos;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.FriendshipRequests.GetFriendProfile;

/// <summary>
/// Checks if freindships exists
/// Checks if found friendship belongs to current user
/// Checks if freindship is accepted
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
            throw new UnauthorizedException("This is not user freindship");

        if (friendship.Status != Core.Enums.FriendshipStatus.Accepted)
            throw new BadRequestException("This friendship is not accepted.");

        var friendId = userId == friendship.RequestorId ? friendship.ReceiverId : friendship.RequestorId;

        var friend = await _userRepository.GetById(friendId)
            ?? throw new NotFoundException("Friend not found");


        var profileDto = new GetFriendProfileDto()
        {
            Username = friend.Username,
            Name = friend.Name,
            ImageUrl = friend.ImageUrl,
            Country = friend.Country,
            JoinDate = friend.JoinDate,
            Bio = friend.Bio,
            FriendsSince = friendship.RequestRespondedAt,

            RequestorWins = friendship.RequestorWins,
            RequestorDraws = friendship.RequestorDraws,
            RequestorLoses = friendship.RequestorLoses,
            GamesPlayed = friend.Stats.GamesPlayed,
            GamesPlayedTogether = friendship.GamesPlayed,

            Elo = new EloDto()
            {
                Bullet = friend.Elo.Bullet,
                Blitz = friend.Elo.Blitz,
                Rapid = friend.Elo.Rapid,
                Classic = friend.Elo.Classic,
                Daily = friend.Elo.Daily,
            },
        };

        return profileDto;
    }
}
