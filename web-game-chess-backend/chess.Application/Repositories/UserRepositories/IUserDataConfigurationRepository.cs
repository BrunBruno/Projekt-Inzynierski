
using chess.Core.Entities;

namespace chess.Application.Repositories.UserRepositories;

/// <summary>
/// Data configuration interface
/// </summary>
public interface IUserDataConfigurationRepository {

    /// <summary>
    /// Gets configuration by id
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    Task<UserDataConfiguration?> GetById(int id);
}
