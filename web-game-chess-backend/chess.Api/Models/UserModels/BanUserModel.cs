namespace chess.Api.Models.UserModels;

public class BanUserModel {
    public string UserEmail { get; set; }
    public string Reason { get; set; }
    public bool IsForEver { get; set; }
    public TimeSpan? Duration { get; set; }
}
