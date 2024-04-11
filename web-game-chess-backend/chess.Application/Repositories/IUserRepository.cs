
using chess.Core.Entities;

namespace chess.Application.Repositories;

public interface IUserRepository {

    Task<User?> GetById(Guid id);

    Task<User?> GetByEmail(string email);

    Task Add(User user);

    Task Update(User user);

    Task Delete(User user);

}
