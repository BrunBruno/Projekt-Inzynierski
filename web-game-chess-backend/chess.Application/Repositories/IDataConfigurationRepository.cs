
using chess.Core.Entities;

namespace chess.Application.Repositories;

/// <summary>
/// Data configuration nterface
/// </summary>
public interface IDataConfigurationRepository {

    /// <summary>
    /// Gets configuration by id
    /// </summary>
    /// <param name="id"> conf id</param>
    /// <returns> Data configuration </returns>
    Task<DataConfiguration?> GetById(int id);
}
