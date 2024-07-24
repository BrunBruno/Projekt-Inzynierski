
using chess.Core.Entities;

namespace chess.Application.Repositories;

/// <summary>
/// Message repository
/// </summary>
public interface IMessageRepository {

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
