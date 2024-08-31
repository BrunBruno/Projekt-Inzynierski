
using chess.Core.Entities;

namespace chess.Application.Repositories;

/// <summary>
/// Data configuration interface
/// </summary>
public interface IDataConfigurationRepository {

    /// <summary>
    /// Gets configuration by id
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    Task<DataConfiguration?> GetById(int id);
}
