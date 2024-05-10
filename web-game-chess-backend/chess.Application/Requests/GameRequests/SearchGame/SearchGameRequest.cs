
using chess.Core.Enums;
using MediatR;

namespace chess.Application.Requests.GameRequests.SearchGame;

/// <summary>
/// Creates GameTiming if not exists
/// Creates new player for chonsen timing
/// Returns timingId
/// </summary>
public class SearchGameRequest : IRequest<SearchGameDto> {
    public TimingTypes Type { get; set; }
    public int Minutes {  get; set; }
    public int Increment {  get; set; }
}
