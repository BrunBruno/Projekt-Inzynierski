﻿
using chess.Core.Abstraction;
using chess.Core.Dtos;

namespace chess.Application.Requests.UserRequests.GetFullUser;

/// <summary>
/// Dto of user
/// </summary>
public class GetFullUserDto : UserDto {

    /// <summary>
    /// Email
    /// </summary>
    public required string Email { get; set; }

    /// <summary>
    /// Account creation date
    /// </summary>
    public DateTime JoinDate { get; set; }

    /// <summary>
    /// Profile description/biography
    /// </summary>
    public string? Bio { get; set; }

    /// <summary>
    /// Win, draws and loses
    /// </summary>
    public required WinDrawLose WdlTotal { get; set; }

    /// <summary>
    /// Wins by some win option
    /// </summary>
    public int WinsByCheckMate { get; set; }
    public int WinsByTimeout { get; set; }
    public int WinsByResignation { get; set; }

    /// <summary>
    /// Loses by some win option
    /// </summary>
    public int LosesByCheckMate { get; set; }
    public int LosesByTimeout { get; set; }
    public int LosesByResignation { get; set; }
}
