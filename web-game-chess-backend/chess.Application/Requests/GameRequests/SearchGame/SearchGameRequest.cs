
using chess.Core.Enums;
using MediatR;

namespace chess.Application.Requests.GameRequests.SearchGame;

/// <summary>
///
/// </summary>
public class SearchGameRequest : IRequest<SearchGameDto> {
    public TimingTypes Type { get; set; }
    public int Minutes {  get; set; }
    public int Increment {  get; set; }
}
