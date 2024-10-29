using chess.Application.Repositories.UserRepositories;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.UserRequests.GetByEmail;

/// <summary>
/// Check if provided email is correct
/// Check if user exists
/// Returns user data
/// </summary>
public class GetByEmailRequestHandler : IRequestHandler<GetByEmailRequest, GetByEmailDto> {

    public IUserRepository _userRepository;

    public GetByEmailRequestHandler(IUserRepository userRepository) {
        _userRepository = userRepository;
    }

    public async Task<GetByEmailDto> Handle(GetByEmailRequest request, CancellationToken cancellationToken) {

        if (request.Email is null)
            throw new BadRequestException("Invalid email.");

        var user = await _userRepository.GetByEmail(request.Email.ToLower()) 
            ?? throw new NotFoundException("User not found.");

        var emailExistsDto = new GetByEmailDto()
        {
            Email = user.Email,
            Username = user.Username,
        };


        return emailExistsDto;
    }
}
