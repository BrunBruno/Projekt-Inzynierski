
using chess.Application.Repositories;
using chess.Core.Enums;
using MediatR;

namespace chess.Application.Requests.UserRequests.GetPasswordConfiguration;

public class GetPasswordConfigurationRequestHandler : IRequestHandler<GetPasswordConfigurationRequest, GetPasswordConfigurationDto> {

    private readonly IPasswordConfigurationRepository _passwordConfigurationRepository;

    public GetPasswordConfigurationRequestHandler(IPasswordConfigurationRepository passwordConfigurationRepository) { 
        _passwordConfigurationRepository = passwordConfigurationRepository;
    }

    public async Task<GetPasswordConfigurationDto> Handle(GetPasswordConfigurationRequest request, CancellationToken cancellationToken) {

        var configurationId = (int)PasswordConfigurations.User;

        var passwordConfiguration = await _passwordConfigurationRepository.GetById(configurationId);

        var passwordConfigurationDto = new GetPasswordConfigurationDto()
        {
            MinLength = passwordConfiguration!.MinLength,
            MaxLength = passwordConfiguration!.MaxLength,
            RequireLowercase = passwordConfiguration!.RequireLowercase,
            RequireUppercase = passwordConfiguration!.RequireUppercase,
            RequireDigit = passwordConfiguration!.RequireDigit,
            RequireSpecialChar = passwordConfiguration!.RequireSpecialChar,
        };

        return passwordConfigurationDto;
    }
}
