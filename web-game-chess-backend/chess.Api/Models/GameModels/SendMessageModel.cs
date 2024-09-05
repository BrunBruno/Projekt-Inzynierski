
namespace chess.Api.Models.GameModels;

public class SendMessageModel {
    public Guid GameId { get; set; }
    public required string Message { get; set; }
}
