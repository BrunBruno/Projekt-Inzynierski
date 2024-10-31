
using AutoMapper;
using chess.Api.Models.WebGameModels;
using chess.Application.Requests.WebGameRequests.AbortWebGameSearch;
using chess.Application.Requests.WebGameRequests.AcceptInvitation;
using chess.Application.Requests.WebGameRequests.CheckIfInGame;
using chess.Application.Requests.WebGameRequests.CreateGameByEmail;
using chess.Application.Requests.WebGameRequests.CreatePrivateGame;
using chess.Application.Requests.WebGameRequests.CreateRematchGame;
using chess.Application.Requests.WebGameRequests.DeclineInvitation;
using chess.Application.Requests.WebGameRequests.EndWebGame;
using chess.Application.Requests.WebGameRequests.GetAllInvitations;
using chess.Application.Requests.WebGameRequests.GetAllFinishedGames;
using chess.Application.Requests.WebGameRequests.GetTypeHistory;
using chess.Application.Requests.WebGameRequests.MakeWebGameMove;
using chess.Application.Requests.WebGameRequests.SearchGame;
using chess.Application.Requests.WebGameRequests.SendMessage;
using chess.Application.Requests.WebGameRequests.CreateGameWithLink;
using chess.Application.Requests.WebGameRequests.GetAllActiveGames;
using chess.Application.Requests.WebGameRequests.SendWebGameMessage;

namespace chess.Api.Maps.MappingProfiles;

/// <summary>
/// Game controller models to requests maps
/// </summary>
public class WebGameMappingProfile : Profile {
	
    public WebGameMappingProfile() {

        CreateMap<SearchWebGameModel, SearchGameRequest>();
        CreateMap<MakeWebGameMoveModel, MakeWebGameMoveRequest>();
        CreateMap<EndWebGameModel, EndWebGameRequest>();
        CreateMap<GetAllFinishedWebGamesModel, GetAllFinishedGamesRequest>();
        CreateMap<CheckIfInGameModel, CheckIfInGameRequest>();
        CreateMap<AbortWebGameSearchModel, AbortWebGameSearchRequest>();
        CreateMap<CreatePrivateWebGameModel, CreatePrivateGameRequest>();
        CreateMap<AcceptInvitationModel, AcceptInvitationRequest>();
        CreateMap<SendMessageModel, SendMessageRequest>();
        CreateMap<CreateRematchWebGameModel, CreateRematchGameRequest>();
        CreateMap<GetTypeHistoryModel, GetTypeHistoryRequest>();
        CreateMap<CreateWebGameByEmailModel, CreateGameByEmailRequest>();
        CreateMap<DeclineWebGameInvitationModel, DeclineInvitationRequest>();
        CreateMap<GetAllInvitationsModel, GetAllInvitationsRequest>();
        CreateMap<CreateWebGameWithLinkModel, CreateGameWithLinkRequest>();
        CreateMap<GetAllActiveWebGamesModel, GetAllActiveGamesRequest>();
        CreateMap<SendWebGameMessageModel, SendWebGameMessageRequest>();
    }
}
