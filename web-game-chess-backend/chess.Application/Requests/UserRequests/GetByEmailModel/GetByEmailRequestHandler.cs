
using chess.Application.Repositories;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.UserRequests.CheckIfEmailExists;

public class GetByEmailRequestHandler : IRequestHandler<GetByEmailRequest, GetByEmailDto> {

    public IUserRepository _userRepository;

    public GetByEmailRequestHandler(IUserRepository userRepository) {
        _userRepository = userRepository;
    }

    public async Task<GetByEmailDto> Handle(GetByEmailRequest request, CancellationToken cancellationToken) {

        if (request.Email is null)
            throw new BadRequestException("Invalid email.");

        var user = await _userRepository.GetByEmail(request.Email) 
            ?? throw new NotFoundException("User not found.");

        var emailExistsDto = new GetByEmailDto()
        {
            Email = user.Email,
            Username = user.Username,
        };


        return emailExistsDto;
    }
}
