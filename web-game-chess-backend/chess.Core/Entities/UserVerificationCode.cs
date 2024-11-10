﻿
using chess.Core.Enums;

#pragma warning disable CS8618
namespace chess.Core.Entities;

/// <summary>
/// Email verification code entity
/// </summary>
public class UserVerificationCode {

    /// <summary>
    /// Code id
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Hashed code used for verifying user email
    /// </summary>
    public string CodeHash { get; set; }

    /// <summary>
    /// Date when code expires
    /// </summary>
    public required DateTime ExpirationDate { get; set; }

    /// <summary>
    /// Type of verification code
    /// </summary>
    public required UserCodesTypes Type { get; set; }

    /// <summary>
    /// User id
    /// </summary>
    public Guid UserId { get; set; }

    /// <summary>
    /// User
    /// </summary>
    public User User { get; set; }
}