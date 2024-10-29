
namespace chess.Api.Models.WebGameModels;

public class SendMessageModel {
    public Guid GameId { get; set; }
    public required string Message { get; set; }
}
