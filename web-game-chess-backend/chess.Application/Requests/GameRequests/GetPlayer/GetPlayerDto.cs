
using chess.Core.Dtos;
using chess.Core.Enums;

namespace chess.Application.Requests.GameRequests.GetPlayer; 

/// <summary>
/// Dto represent player of current game
/// </summary>
public class GetPlayerDto : PlayerDto {

    /// <summary>
    /// Color representing side of the board 
    /// </summary>
    public required PieceColor Color { get; set; }
}
