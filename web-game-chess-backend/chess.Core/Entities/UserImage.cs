﻿
namespace chess.Core.Entities;
#pragma warning disable CS8618

public class UserImage {

    /// <summary>
    /// Id
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// File in bytes
    /// </summary>
    public required byte[] Data { get; set; }

    /// <summary>
    /// Content type
    /// </summary>
    public required string ContentType { get; set; }

    /// <summary>
    /// User id
    /// </summary>
    public Guid UserId { get; set; }

    /// <summary>
    /// User
    /// </summary>
    public User User { get; set; }
}
