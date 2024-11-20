
using AutoMapper;
using chess.Api.Models.EngineGameModels;
using chess.Application.Requests.EngineRequests.ChangeEngineLevel;
using chess.Application.Requests.EngineRequests.EndEngineGame;
using chess.Application.Requests.EngineRequests.GetAllEngineGames;
using chess.Application.Requests.EngineRequests.MakeEngineGameMove;
using chess.Application.Requests.EngineRequests.StartEngineGame;
using chess.Application.Requests.EngineRequests.UndoMove;

namespace chess.Api.Maps.MappingProfiles;

/// <summary>
/// Engine game controller models to requests maps
/// </summary>
public class EngineGameMappingProfile : Profile {
	
	public EngineGameMappingProfile() {

		CreateMap<StartEngineGameModel, StartEngineGameRequest>();
		CreateMap<MakeEngineGameMoveModel, MakeEngineGameMoveRequest>();
		CreateMap<EndEngineGameModel, EndEngineGameRequest>();
		CreateMap<ChangeEngineLevelModel, ChangeEngineLevelRequest>();
		CreateMap<UndoMoveModel, UndoMoveRequest>();
		CreateMap<GetAllEngineGamesModel, GetAllEngineGamesRequest>();
	}
}
