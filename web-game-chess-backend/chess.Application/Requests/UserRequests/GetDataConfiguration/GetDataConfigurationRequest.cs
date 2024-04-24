
using MediatR;

namespace chess.Application.Requests.UserRequests.GetDataConfiguration;

public class GetDataConfigurationRequest : IRequest<GetDataConfigurationDto> {
    public int ConfigurationId { get; set; }
}
