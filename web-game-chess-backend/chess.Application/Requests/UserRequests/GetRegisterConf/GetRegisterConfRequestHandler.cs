
using chess.Application.Repositories;
using chess.Core.Enums;
using MediatR;
using chess.Shared.Exceptions;

namespace chess.Application.Requests.UserRequests.GetRegisterConf;

public class GetRegisterConfRequestHandler : IRequestHandler<GetRegisterConfRequest, GetRegisterConfDto> {

    private readonly IDataConfigurationRepository _dataConfigurationRepository;

    public GetRegisterConfRequestHandler(IDataConfigurationRepository dataConfigurationRepository) {
        _dataConfigurationRepository = dataConfigurationRepository;
    }

    public async Task<GetRegisterConfDto> Handle(GetRegisterConfRequest request, CancellationToken cancellationToken) {

        if (!Enum.IsDefined(typeof(DataConfigurations), request.ConfigurationId))
            throw new BadRequestException("Incorrect configuration id.");

        var dataConfiguration = await _dataConfigurationRepository.GetById(request.ConfigurationId) 
            ?? throw new NotFoundException("Configuration not found.");

        var registerConfDto = new GetRegisterConfDto()
        {
            MinLength = dataConfiguration.MinLength,
            MaxLength = dataConfiguration.MaxLength,
            RequireLowercase = dataConfiguration.RequireLowercase,
            RequireUppercase = dataConfiguration.RequireUppercase,
            RequireDigit = dataConfiguration.RequireDigit,
            RequireSpecialChar = dataConfiguration.RequireSpecialChar,
        };

        return registerConfDto;
    }
}
