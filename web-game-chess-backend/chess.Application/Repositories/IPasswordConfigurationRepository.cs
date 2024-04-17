
using chess.Core.Entities;

namespace chess.Application.Repositories;

public interface IPasswordConfigurationRepository {
    Task<PasswordConfiguration?> GetById(int id);
}
