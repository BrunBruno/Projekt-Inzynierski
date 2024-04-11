
using chess.Application.Repositories;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Shared.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace chess.Application.Requests.UserRequests.LogIn; 

public class LogInUserRequestHandler : IRequestHandler<LogInUserRequest, LogInUserDto>  {

    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher<User> _passwordHasher;
    private readonly IJwtService _jwtService;

    public LogInUserRequestHandler(
        IUserRepository userRepository,
        IPasswordHasher<User> passwordHasher,
        IJwtService jwtService
    ) {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _jwtService = jwtService;
    }

    public async Task<LogInUserDto> Handle(LogInUserRequest request, CancellationToken cancellationToken) {

        var user = await _userRepository.GetByEmail(request.Email.ToLower()) 
            ?? throw new BadRequestException("Invalid email or password.");

        var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);

        if (result == PasswordVerificationResult.Failed)
            throw new BadRequestException("Invalid email or password");

        var token = _jwtService.GetJwtToken(user);

        var tokenDto =  new LogInUserDto()
        {
            Token = token
        };

        return tokenDto;
    }
}
