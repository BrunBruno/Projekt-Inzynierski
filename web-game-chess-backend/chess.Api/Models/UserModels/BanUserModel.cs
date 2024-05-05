namespace chess.Api.Models.UserModels;

/// <summary>
/// POST ban model
/// </summary>
public class BanUserModel {
    public required string UserEmail { get; set; }
    public required string Reason { get; set; }
    public bool IsForEver { get; set; }
    public TimeSpan? Duration { get; set; }
}
