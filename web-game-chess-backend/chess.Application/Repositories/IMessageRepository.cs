﻿
using chess.Core.Entities;

namespace chess.Application.Repositories;

/// <summary>
/// Message repository
/// </summary>
public interface IMessageRepository {

    /// <summary>
    /// Gets all messages for players of the game
    /// </summary>
    /// <param name="whitePlayerId"></param>
    /// <param name="blackPlayerrId"></param>
    /// <returns></returns>
    Task<List<Message>> GetAllByPlayers(Guid whitePlayerId, Guid blackPlayerrId);

    /// <summary>
    /// Creates new message
    /// </summary>
    /// <param name="message"></param>
    /// <returns></returns>
    Task Create(Message message);

    /// <summary>
    /// Removes message
    /// </summary>
    /// <param name="message"></param>
    /// <returns></returns>
    Task Delete(Message message);
}
