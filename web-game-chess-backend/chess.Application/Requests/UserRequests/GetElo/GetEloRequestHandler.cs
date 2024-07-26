
using chess.Application.Repositories;
using chess.Application.Services;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.UserRequests.GetElo;

/// <summary>
/// Checks if user exists
/// Gets and returns user elo dto
/// </summary>
public class GetEloRequestHandler : IRequestHandler<GetEloRequest, GetEloDto> {

    private readonly IUserContextService _userContextService;
    private readonly IUserRepository _userRepository;

    public GetEloRequestHandler(IUserContextService userContextService, IUserRepository userRepository) {
        _userContextService = userContextService;
        _userRepository = userRepository;
    }

    public async Task<GetEloDto> Handle(GetEloRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var user = await _userRepository.GetById(userId) 
            ?? throw new NotFoundException("User not found.");

        var eloDto = new GetEloDto()
        {
            Bullet = user.Elo.Bullet,
            Blitz = user.Elo.Blitz,
            Rapid = user.Elo.Rapid,
            Classic = user.Elo.Classic,
            Daily = user.Elo.Daily,
        };

        return eloDto;
    }
}
