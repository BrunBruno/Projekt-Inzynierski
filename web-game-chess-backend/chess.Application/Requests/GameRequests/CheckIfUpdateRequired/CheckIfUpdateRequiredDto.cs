
using chess.Core.Models;

namespace chess.Application.Requests.GameRequests.CheckIfUpdateRequired;

/// <summary>
/// Game timing for obtained game dto
/// Is update on private game required statement
/// </summary>
public class CheckIfUpdateRequiredDto : TimingTypeModel {

    /// <summary>
    /// Is update required flag
    /// </summary>
    public bool IsRequired { get; set; }
}
