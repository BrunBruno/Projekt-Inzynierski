﻿
using chess.Core.Dtos;
using chess.Core.Enums;

namespace chess.Application.Requests.GameRequests.GetPlayer; 

/// <summary>
/// Dto represent player of current game
/// </summary>
public class GetPlayerDto : PlayerDto {

    /// <summary>
    /// Player id
    /// </summary>
    public Guid PlayerId { get; set; }

    /// <summary>
    /// Color representing side of the board 
    /// </summary>
    public required Colors Color { get; set; }
}
