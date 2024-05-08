using AutoMapper;
using chess.Api.Models.GameModels;
using chess.Application.Requests.GameRequests.SearchGame;

namespace chess.Api.Maps.MappingProfiles;

/// <summary>
/// Game controller models to requests maps
/// </summary>
public class GameMappingProfiles : Profile {
    public GameMappingProfiles() {

        CreateMap<SearchGameModel, SearchGameRequest>();
        
    }
}
