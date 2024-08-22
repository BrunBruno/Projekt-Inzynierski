
using chess.Core.Abstraction;

namespace chess.Application.Requests.GameRequests.CheckIfUpdateRequired;

public class CheckIfUpdateRequiredDto : TimingType {

    public bool IsRequired { get; set; }
}
