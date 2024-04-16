
using chess.Application.Repositories;
using chess.Core.Entities;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.UserRequests.BanUser;

public class BanUserRequestHandler : IRequestHandler<BanUserRequest> {

    private readonly IUserRepository _userRepository;
    private readonly IBannedUserRepository _bannedUserRepository;

    public BanUserRequestHandler(IUserRepository userRepository, IBannedUserRepository bannedUserRepository) {
        _userRepository = userRepository;
        _bannedUserRepository = bannedUserRepository;
    }

    public async Task Handle(BanUserRequest request, CancellationToken cancellationToken) {

        var userToBan = await _userRepository.GetByEmail(request.UserEmail)
            ?? throw new NotFoundException("User not found.");

        if (!request.IsForEver && request.Duration is null)
            throw new BadRequestException("Duration not set.");

        if (request.IsForEver && request.Duration is not null)
            throw new BadRequestException("Forever and duration set simultaneous.");

        var bannedUser = new BannedUser()
        {
            Id = Guid.NewGuid(),
            Reason = request.Reason,
            IsForEver = request.IsForEver,
            Duration = request.Duration,
            UserId = userToBan.Id,
        };

        await _bannedUserRepository.Create(bannedUser);
    }
}
