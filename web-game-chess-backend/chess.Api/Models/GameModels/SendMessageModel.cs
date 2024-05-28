
namespace chess.Api.Models.GameModels;

public class SendMessageModel {
    public Guid GameId { get; set; }
    public Guid PlayerId { get; set; }
    public required string Message { get; set; }
}
