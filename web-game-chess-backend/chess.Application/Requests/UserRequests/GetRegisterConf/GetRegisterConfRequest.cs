
using MediatR;

namespace chess.Application.Requests.UserRequests.GetRegisterConf;

/// <summary>
/// Request for getting register configuuration
/// </summary>
public class GetRegisterConfRequest : IRequest<GetRegisterConfDto> {

    /// <summary>
    /// Id of configuration
    /// </summary>
    public int ConfigurationId { get; set; }
}
