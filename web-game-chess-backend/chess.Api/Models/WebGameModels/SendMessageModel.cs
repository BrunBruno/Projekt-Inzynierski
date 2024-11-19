
namespace chess.Api.Models.WebGameModels;

public class SendPlayerMessageModel {
    public Guid GameId { get; set; }
    public required string Message { get; set; }
}
