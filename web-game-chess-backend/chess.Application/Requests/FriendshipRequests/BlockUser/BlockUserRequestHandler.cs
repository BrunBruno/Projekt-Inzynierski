
using chess.Application.Repositories.FriendshipRepositories;
using chess.Application.Repositories.UserRepositories;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.FriendshipRequests.BlockUser;

/// <summary>
/// Checks if user is not blocking itself
/// Gets user to block
/// Checks if users have relationship 
/// Checks if user is not already blocked
/// Updates friendship if exists 
/// Creates new friendship with rejected status is not exists
/// </summary>
public class BlockUserRequestHandler : IRequestHandler<BlockUserRequest> {

    private readonly IUserContextService _userContextService;
    private readonly IUserRepository _userRepository;
    private readonly IFriendshipRepository _friendshipRepository;

    public BlockUserRequestHandler(
        IUserContextService userContextService,
        IUserRepository userRepository,
        IFriendshipRepository friendshipRepository
    ) {
        _userContextService = userContextService;
        _userRepository = userRepository;
        _friendshipRepository = friendshipRepository;
    }

    public async Task Handle(BlockUserRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        if (userId == request.UserId)
            throw new BadRequestException("Can not block yourself.");

        var userToBlock = await _userRepository.GetById(request.UserId)
            ?? throw new NotFoundException("User not found.");


        var existingFriendship = await _friendshipRepository.GetByUsersIds(userId, userToBlock.Id);

        if(existingFriendship is not null){

            if(existingFriendship.Status == FriendshipStatus.Rejected)
                throw new BadRequestException("User is blocked or has blocked you.");

            existingFriendship.Status = FriendshipStatus.Rejected;


            await _friendshipRepository.Update(existingFriendship);

        } else {
            
            var friendship = new Friendship()
            {
                Id = Guid.NewGuid(),
                Status = FriendshipStatus.Rejected,
                RequestCreatedAt = DateTime.UtcNow,
                RequestorId = userId,
                ReceiverId = request.UserId,
            };


            await _friendshipRepository.Create(friendship);

        }
    }
}
