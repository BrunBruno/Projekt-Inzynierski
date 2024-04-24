
using chess.Core.Entities;

namespace chess.Application.Repositories;

public interface IDataConfigurationRepository {
    Task<DataConfiguration?> GetById(int id);
}
