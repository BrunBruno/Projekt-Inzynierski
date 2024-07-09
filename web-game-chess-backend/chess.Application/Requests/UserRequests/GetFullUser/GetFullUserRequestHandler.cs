
using chess.Application.Repositories;
using chess.Application.Services;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.UserRequests.GetFullUser;

public class GetFullUserRequestHandler : IRequestHandler<GetFullUserRequest, GetFullUserDto> {

    private readonly IUserContextService _userContextService;
    private readonly IUserRepository _userRepository;

    public GetFullUserRequestHandler(IUserContextService userContextService, IUserRepository userRepository) {
        _userContextService = userContextService;
        _userRepository = userRepository;
    }

    public async Task<GetFullUserDto> Handle(GetFullUserRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var user = await _userRepository.GetById(userId)
            ?? throw new NotFoundException("User not found.");

        var userDto = new GetFullUserDto() 
        { 
            Email = user.Email,
            Username = user.Username,
            Name = user.Name,
            JoinDate = user.JoinDate,
            ImageUrl = user.ImageUrl,
            Country = user.Country,
            Wins = user.Stats.Wins,
            Loses = user.Stats.Loses,
            Draws = user.Stats.Draws,
            GamesPlayed = user.Stats.GamesPlayed,
            WinsByCheckMate = user.Stats.WinsByCheckMate,
            WinsByTimeout = user.Stats.WinsByTimeout,
            WinsByResignation = user.Stats.WinsByResignation,
            LosesByCheckMate = user.Stats.LosesByCheckMate,
            LosesByTimeout = user.Stats.LosesByTimeout,
            LosesByResignation = user.Stats.LosesByResignation,
        };

        return userDto;
    }
}
