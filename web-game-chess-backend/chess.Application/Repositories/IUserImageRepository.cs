
using chess.Core.Entities;

namespace chess.Application.Repositories;

public interface IUserImageRepository {

    /// <summary>
    /// 
    /// </summary>
    /// <param name="userId"></param>
    /// <returns></returns>
    Task<UserImage?> GetByUserId(Guid userId);

    /// <summary>
    /// 
    /// </summary>
    /// <param name="userImage"></param>
    /// <returns></returns>
    Task Create(UserImage userImage);
}
