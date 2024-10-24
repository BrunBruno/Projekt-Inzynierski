﻿
using chess.Core.Enums;

namespace chess.Core.Entities;
#pragma warning disable CS8618

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
    public DateTime ExpirationDate { get; set; }

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