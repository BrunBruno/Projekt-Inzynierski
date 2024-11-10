
using AutoMapper;
using chess.Api.Models.FriendshipModels;
using chess.Application.Requests.FriendshipRequests.BlockUser;
using chess.Application.Requests.FriendshipRequests.GetAllFriendsByStatus;
using chess.Application.Requests.FriendshipRequests.GetAllNonFriends;
using chess.Application.Requests.FriendshipRequests.InviteFriend;
using chess.Application.Requests.FriendshipRequests.RespondToFriendRequest;

namespace chess.Api.Maps.MappingProfiles;

/// <summary>
/// Friendship controller models to requests maps
/// </summary>
public class FriendshipMappingProfile : Profile {
	
	public FriendshipMappingProfile() {

		CreateMap<InviteFriendModel, InviteFriendRequest>();
		CreateMap<RespondToFriendRequestModel, RespondToFriendRequestRequest>();
		CreateMap<GetAllFriendsByStatusModel, GetAllFriendsByStatusRequest>();
		CreateMap<GetAllNonFriendsModel, GetAllNonFriendsRequest>();
		CreateMap<BlockUserModel, BlockUserRequest>();

	}
}
