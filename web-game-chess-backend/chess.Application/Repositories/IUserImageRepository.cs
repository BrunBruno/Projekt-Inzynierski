﻿
using chess.Core.Entities;

namespace chess.Application.Repositories;

/// <summary>
/// User image repository
/// </summary>
public interface IUserImageRepository {

    /// <summary>
    /// Get user profile picture
    /// </summary>
    /// <param name="userId"></param>
    /// <returns></returns>
    Task<UserImage?> GetByUserId(Guid userId);

    /// <summary>
    /// Creates profile picture
    /// </summary>
    /// <param name="userImage"></param>
    /// <returns></returns>
    Task Create(UserImage userImage);
}
