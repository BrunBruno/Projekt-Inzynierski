﻿
using chess.Core.Models;
using MediatR;

namespace chess.Application.Requests.WebGameRequests.SearchWebGame;

/// <summary>
/// Request for add entities for start searching for a game
/// Creates new player if not exists
/// Creates new timing if not exists
/// </summary>
public class SearchWebGameRequest : TimingTypeModel, IRequest<SearchWebGameDto> {
}
