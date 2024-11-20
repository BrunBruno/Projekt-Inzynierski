
namespace chess.Api.Models.WebGameModels;

public class CancelWebGameRematchModel {
    public Guid CurrentGameId { get; set; }
    public Guid NewGameId { get; set; }
}
