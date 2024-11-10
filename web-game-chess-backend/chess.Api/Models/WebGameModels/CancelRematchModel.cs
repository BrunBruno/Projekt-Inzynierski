
namespace chess.Api.Models.WebGameModels;

public class CancelRematchModel {
    public Guid CurrentGameId { get; set; }
    public Guid NewGameId { get; set; }
}
