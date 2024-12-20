﻿
using MediatR;

namespace chess.Application.Requests.WebGameRequests.SendDrawMessage;

/// <summary>
/// Request for creating draw proposal
/// </summary>
public class SendDrawMessageRequest : IRequest {

    /// <summary>
    /// Game id
    /// </summary>
    public Guid GameId { get; set; }
}
