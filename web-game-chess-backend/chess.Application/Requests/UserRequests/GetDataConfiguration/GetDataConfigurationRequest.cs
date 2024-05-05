
using MediatR;

namespace chess.Application.Requests.UserRequests.GetDataConfiguration;

/// <summary>
/// Request for getting register configuuration
/// </summary>
public class GetDataConfigurationRequest : IRequest<GetDataConfigurationDto> {

    /// <summary>
    /// Id of configuration
    /// </summary>
    public int ConfigurationId { get; set; }
}
