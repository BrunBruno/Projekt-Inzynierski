
using AutoMapper;
using chess.Api.Models.WebGameModels;
using chess.Application.Requests.WebGameRequests.AbortWebGameSearch;
using chess.Application.Requests.WebGameRequests.AcceptInvitation;
using chess.Application.Requests.WebGameRequests.CheckIfInWebGame;
using chess.Application.Requests.WebGameRequests.CreatePrivateGameByEmail;
using chess.Application.Requests.WebGameRequests.CreatePrivateGame;
using chess.Application.Requests.WebGameRequests.CreateWebGameRematch;
using chess.Application.Requests.WebGameRequests.DeclineInvitation;
using chess.Application.Requests.WebGameRequests.EndWebGame;
using chess.Application.Requests.WebGameRequests.GetAllInvitations;
using chess.Application.Requests.WebGameRequests.GetAllFinishedGames;
using chess.Application.Requests.WebGameRequests.GetTypeHistory;
using chess.Application.Requests.WebGameRequests.MakeWebGameMove;
using chess.Application.Requests.WebGameRequests.SearchGame;
using chess.Application.Requests.WebGameRequests.SendPlayerMessage;
using chess.Application.Requests.WebGameRequests.CreateGameWithLink;
using chess.Application.Requests.WebGameRequests.GetAllActiveGames;
using chess.Application.Requests.WebGameRequests.SendWebGameMessage;
using chess.Application.Requests.WebGameRequests.GetTotalGamesStats;
using chess.Application.Requests.WebGameRequests.CancelWebGameRematch;

namespace chess.Api.Maps.MappingProfiles;

/// <summary>
/// Web game controller and web game hub models to requests maps
/// </summary>
public class WebGameMappingProfile : Profile {
	
	public WebGameMappingProfile() {

		CreateMap<SearchWebGameModel, SearchGameRequest>();
		CreateMap<MakeWebGameMoveModel, MakeWebGameMoveRequest>();
		CreateMap<EndWebGameModel, EndWebGameRequest>();
		CreateMap<GetAllFinishedWebGamesModel, GetAllFinishedGamesRequest>();
		CreateMap<CheckIfInWebGameModel, CheckIfInWebGameRequest>();
		CreateMap<AbortWebGameSearchModel, AbortWebGameSearchRequest>();
		CreateMap<CreatePrivateWebGameModel, CreatePrivateGameRequest>();
		CreateMap<AcceptInvitationModel, AcceptInvitationRequest>();
		CreateMap<SendPlayerMessageModel, SendPlayerMessageRequest>();
		CreateMap<CreateRematchWebGameModel, CreateWebGameRematchRequest>();
		CreateMap<GetTypeHistoryModel, GetTypeHistoryRequest>();
		CreateMap<CreateWebGameByEmailModel, CreatePrivateGameByEmailRequest>();
		CreateMap<DeclineWebGameInvitationModel, DeclineInvitationRequest>();
		CreateMap<GetAllInvitationsModel, GetAllInvitationsRequest>();
		CreateMap<CreateWebGameWithLinkModel, CreateGameWithLinkRequest>();
		CreateMap<GetAllActiveWebGamesModel, GetAllActiveGamesRequest>();
		CreateMap<SendWebGameMessageModel, SendWebGameMessageRequest>();
		CreateMap<GetTotalGamesStatsModel, GetTotalGamesStatsRequest>();
		CreateMap<CancelRematchModel, CancelWebGameRematchRequest>();
	}
}
