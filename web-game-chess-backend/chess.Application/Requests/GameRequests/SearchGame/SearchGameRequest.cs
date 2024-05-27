
using chess.Core.Enums;
using MediatR;

namespace chess.Application.Requests.GameRequests.SearchGame;

/// <summary>
/// Request for add entities for start searching for a game
/// Creates new player if not exists
/// Creates new timing if not exists
/// </summary>
public class SearchGameRequest : IRequest<SearchGameDto> {

    /// <summary>
    /// Type of timing
    /// </summary>
    public TimingTypes Type { get; set; }

    /// <summary>
    /// Duration for all moves for one player
    /// </summary>
    public int Minutes {  get; set; }

    /// <summary>
    /// Increment for every done move
    /// </summary>
    public int Increment {  get; set; }
}
