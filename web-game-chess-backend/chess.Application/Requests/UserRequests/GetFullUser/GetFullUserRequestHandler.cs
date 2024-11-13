
using chess.Application.Repositories.UserRepositories;
using chess.Application.Services;
using chess.Core.Dtos;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.UserRequests.GetFullUser;

/// <summary>
/// Checks if user exists
/// Gets all data about user and returns user dto
/// </summary>
public class GetFullUserRequestHandler : IRequestHandler<GetFullUserRequest, GetFullUserDto> {

    private readonly IUserContextService _userContextService;
    private readonly IUserRepository _userRepository;

    public GetFullUserRequestHandler(
        IUserContextService userContextService,
        IUserRepository userRepository
    ) {
        _userContextService = userContextService;
        _userRepository = userRepository;
    }

    public async Task<GetFullUserDto> Handle(GetFullUserRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var user = await _userRepository.GetById(userId)
            ?? throw new NotFoundException("User not found.");

        var userDto = new GetFullUserDto() 
        { 
            IsPrivate = user.IsPrivate,
            Email = user.Email,
            Username = user.Username,
            Name = user.Name,
            JoinDate = user.JoinDate,
            Country = user.Country,
            Bio = user.Bio,

            ProfilePicture = user.Image != null ? new ImageDto() 
            {
                Data = user.Image.Data,
                ContentType = user.Image.ContentType,
            } : null,
      
            OutcomeTotal = new GameOutcomeDto()
            {
                Total = user.Stats.GamesPlayed,
                Wins = user.Stats.Wins,
                Loses = user.Stats.Loses,
                Draws = user.Stats.Draws,
            },

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
