﻿
using chess.Application.Pagination;
using chess.Application.Repositories.UserRepositories;
using chess.Application.Services;
using chess.Core.Dtos;
using chess.Core.Enums;
using MediatR;

namespace chess.Application.Requests.UserRequests.GetUsersRanking;

public class GetUsersRankingRequestHandler : IRequestHandler<GetUsersRankingRequest, PagedResult<GetUsersRankingDto>> {

    private readonly IUserContextService _userContextService;
    private readonly IUserRepository _userRepository;

    public GetUsersRankingRequestHandler(
        IUserContextService userContextService,
        IUserRepository userRepository
    ) {
        _userContextService = userContextService;
        _userRepository = userRepository;
    }

    public async Task<PagedResult<GetUsersRankingDto>> Handle(GetUsersRankingRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var users = await _userRepository.GetAllOrderByRating(request.Type);


        var result = users.Select((user, index) => new GetUsersRankingDto() { 
            Position = index + 1,
            Username = user.Username,
            Elo = request.Type == TimingTypes.Bullet ? user.Elo.Bullet : 
                  request.Type == TimingTypes.Blitz ? user.Elo.Blitz :
                  request.Type == TimingTypes.Rapid ? user.Elo.Rapid :
                  request.Type == TimingTypes.Classic ? user.Elo.Classic :
                  request.Type == TimingTypes.Daily ? user.Elo.Daily : 0,
            GamesPlayed = user.Stats.GamesPlayed,
            Ratio = user.Stats.GamesPlayed > 0 ?
                $"{100 * user.Stats.Wins / user.Stats.GamesPlayed}%:" +
                $"{100 * user.Stats.Draws / user.Stats.GamesPlayed}%:" +
                $"{100 * user.Stats.Loses / user.Stats.GamesPlayed}%" : "-",
            IsUser = userId == user.Id,

            Profile = user.Image != null ? new ImageDto() { 
                ContentType = user.Image.ContentType, 
                Data = user.Image.Data 
            } : null,
        }).ToList();


        var pagedResult = new PagedResult<GetUsersRankingDto>(result, result.Count, request.PageSize, request.PageNumber);

        return pagedResult;
    }
}