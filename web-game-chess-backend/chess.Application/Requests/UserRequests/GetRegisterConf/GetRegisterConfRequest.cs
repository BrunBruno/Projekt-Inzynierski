
using MediatR;

namespace chess.Application.Requests.UserRequests.GetRegisterConf;

/// <summary>
/// Request for getting register configuration
/// </summary>
public class GetRegisterConfRequest : IRequest<GetRegisterConfDto> {

    /// <summary>
    /// Id of configuration
    /// </summary>
    public int ConfigurationId { get; set; }
}
