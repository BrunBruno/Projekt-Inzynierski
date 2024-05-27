
using AutoMapper;
using chess.Api.Models.GameModels;
using chess.Application.Requests.GameRequests.AbortSearch;
using chess.Application.Requests.GameRequests.AcceptInvitation;
using chess.Application.Requests.GameRequests.CheckIfInGame;
using chess.Application.Requests.GameRequests.CreatePrivateGame;
using chess.Application.Requests.GameRequests.EndGame;
using chess.Application.Requests.GameRequests.GetFinishedGames;
using chess.Application.Requests.GameRequests.MakeMove;
using chess.Application.Requests.GameRequests.SearchGame;

namespace chess.Api.Maps.MappingProfiles;

/// <summary>
/// Game controller models to requests maps
/// </summary>
public class GameMappingProfile : Profile {
    public GameMappingProfile() {

        CreateMap<SearchGameModel, SearchGameRequest>();
        CreateMap<MakeMoveModel, MakeMoveRequest>();
        CreateMap<EndGameModel, EndGameRequest>();
        CreateMap<GetFinishedGamesModel, GetFinishedGamesRequest>();
        CreateMap<CheckIfInGameModel, CheckIfInGameRequest>();
        CreateMap<AbortSearchModel, AbortSearchRequest>();
        CreateMap<CreatePrivateGameModel, CreatePrivateGameRequest>();
        CreateMap<AcceptInvitationModel, AcceptInvitationRequest>();

    }
}
