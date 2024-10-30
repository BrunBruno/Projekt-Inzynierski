
using AutoMapper;
using chess.Api.Models.EngineGameModels;
using chess.Application.Requests.EngineRequests.MakeEngineGameMove;
using chess.Application.Requests.EngineRequests.StartEngineGame;

namespace chess.Api.Maps.MappingProfiles;

public class EngineGameMappingProfile : Profile {
	
    public EngineGameMappingProfile() {

        CreateMap<StartEngineGameModel, StartEngineGameRequest>();
        CreateMap<MakeEngineGameMoveModel, MakeEngineGameMoveRequest>();
    }
}
