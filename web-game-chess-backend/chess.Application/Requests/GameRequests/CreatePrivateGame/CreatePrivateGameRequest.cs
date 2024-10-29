
using chess.Core.Models;
using MediatR;

namespace chess.Application.Requests.GameRequests.CreatePrivateGame;

/// <summary>
/// Request to create new private game with selected friend
/// </summary>
public class CreatePrivateGameRequest : TimingTypeModel, IRequest<CreatePrivateGameDto> {

    /// <summary>
    /// Id of friendship between user and selected friend
    /// </summary>
    public Guid FriendshipId { get; set; }
}
