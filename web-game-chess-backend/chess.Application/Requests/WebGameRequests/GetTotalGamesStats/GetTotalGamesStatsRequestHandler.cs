
using chess.Application.Repositories.UserRepositories;
using chess.Application.Repositories.WebGameRepositories;
using MediatR;

namespace chess.Application.Requests.WebGameRequests.GetTotalGamesStats;

/// <summary>
/// Gets games played and user joined today
/// Returns stats
/// </summary>
public class GetTotalGamesStatsRequestHandler : IRequestHandler<GetTotalGamesStatsRequest, GetTotalGamesStatsDto> {

    private readonly IWebGameRepository _webGameRepository;
    private readonly IUserRepository _userRepository;

    public GetTotalGamesStatsRequestHandler(
        IWebGameRepository webGameRepository,
        IUserRepository userRepository
    ) {
        _webGameRepository = webGameRepository;
        _userRepository = userRepository;
    }

    public async Task<GetTotalGamesStatsDto> Handle(GetTotalGamesStatsRequest request, CancellationToken cancellationToken) {

        var gamesToday = await _webGameRepository.GetAllPlayedToday();

        var usersToday = await _userRepository.GetAllJoinedToday();

        var dto = new GetTotalGamesStatsDto() 
        { 
            GamesPlayed = gamesToday.Count,
            UsersJoined = usersToday.Count,
        };

        return dto;
    }
}
