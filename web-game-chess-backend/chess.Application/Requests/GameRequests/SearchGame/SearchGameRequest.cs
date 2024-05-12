
using chess.Core.Enums;
using MediatR;

namespace chess.Application.Requests.GameRequests.SearchGame;

/// <summary>
///
/// </summary>
public class SearchGameRequest : IRequest<SearchGameDto> {

    /// <summary>
    /// 
    /// </summary>
    public TimingTypes Type { get; set; }

    /// <summary>
    /// 
    /// </summary>
    public int Minutes {  get; set; }

    /// <summary>
    /// 
    /// </summary>
    public int Increment {  get; set; }
}
