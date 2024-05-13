
using chess.Core.Enums;

namespace chess.Application.Requests.GameRequests.GetPlayer; 

public class GetPlayerDto {
    public required string Name { get; set; }
    public int Elo { get; set; }
    public Colors? Color { get; set; }
}
