
using chess.Core.Abstraction;

namespace chess.Application.Requests.GameRequests.CheckIfUpdateRequired;

/// <summary>
/// Game timing for obtained game dto
/// Is update on private game required statement
/// </summary>
public class CheckIfUpdateRequiredDto : TimingType {

    /// <summary>
    /// Is update required flag
    /// </summary>
    public bool IsRequired { get; set; }
}
