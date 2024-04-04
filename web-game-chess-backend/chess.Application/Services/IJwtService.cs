
using chess.Core.Entities;

namespace chess.Application.Services;

public interface IJwtService {
    string GetJwtToken(User user);
}
