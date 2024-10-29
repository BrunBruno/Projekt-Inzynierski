
using chess.Core.Models;
using MediatR;

namespace chess.Application.Requests.EngineRequests.StartEngineGame;

public class StartEngineGameRequest : TimingTypeModel, IRequest<StartEngineGameDto> {
}
