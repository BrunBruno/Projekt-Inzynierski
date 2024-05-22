
using chess.Core.Entities;
using chess.Core.Enums;

namespace chess.Application.Repositories;

public interface IFriendshipRepository {

    Task<List<Friendship>> GetAllForUserByStatus(Guid userId, FriendshipStatus status);
    Task<List<Guid>> GetAllFriendIds(Guid userId);
    Task<Friendship?> GetById(Guid friendshipId);
    Task Create(Friendship friendship);
    Task Update(Friendship friendship);

}
