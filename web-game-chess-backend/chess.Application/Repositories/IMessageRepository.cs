
using chess.Core.Entities;

namespace chess.Application.Repositories;

public interface IMessageRepository {
    Task Create(Message message);
    Task Delete(Message message);
}
