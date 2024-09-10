
using AutoMapper;
using chess.Api.Models.GameModels;
using chess.Application.Requests.GameRequests.AbortSearch;
using chess.Application.Requests.GameRequests.AcceptInvitation;
using chess.Application.Requests.GameRequests.CheckIfInGame;
using chess.Application.Requests.GameRequests.CreateGameByEmail;
using chess.Application.Requests.GameRequests.CreatePrivateGame;
using chess.Application.Requests.GameRequests.CreateRematchGame;
using chess.Application.Requests.GameRequests.DeclineInvitation;
using chess.Application.Requests.GameRequests.EndGame;
using chess.Application.Requests.GameRequests.GetAllInvitations;
using chess.Application.Requests.GameRequests.GetAllFinishedGames;
using chess.Application.Requests.GameRequests.GetTypeHistory;
using chess.Application.Requests.GameRequests.MakeMove;
using chess.Application.Requests.GameRequests.SearchGame;
using chess.Application.Requests.GameRequests.SendMessage;
using chess.Application.Requests.GameRequests.CreateGameWithLink;
using chess.Application.Requests.GameRequests.UpdatePrivateGame;
using chess.Application.Requests.GameRequests.SendDrawMessage;

namespace chess.Api.Maps.MappingProfiles;

/// <summary>
/// Game controller models to requests maps
/// </summary>
public class GameMappingProfile : Profile {
    public GameMappingProfile() {

        CreateMap<SearchGameModel, SearchGameRequest>();
        CreateMap<MakeMoveModel, MakeMoveRequest>();
        CreateMap<EndGameModel, EndGameRequest>();
        CreateMap<GetAllFinishedGamesModel, GetAllFinishedGamesRequest>();
        CreateMap<CheckIfInGameModel, CheckIfInGameRequest>();
        CreateMap<AbortSearchModel, AbortSearchRequest>();
        CreateMap<CreatePrivateGameModel, CreatePrivateGameRequest>();
        CreateMap<AcceptInvitationModel, AcceptInvitationRequest>();
        CreateMap<SendMessageModel, SendMessageRequest>();
        CreateMap<CreateRematchGameModel, CreateRematchGameRequest>();
        CreateMap<GetTypeHistoryModel, GetTypeHistoryRequest>();
        CreateMap<CreateGameByEmailModel, CreateGameByEmailRequest>();
        CreateMap<DeclineInvitationModel, DeclineInvitationRequest>();
        CreateMap<GetAllInvitationsModel, GetAllInvitationsRequest>();
        CreateMap<CreateGameWithLinkModel, CreateGameWithLinkRequest>();
    }
}
