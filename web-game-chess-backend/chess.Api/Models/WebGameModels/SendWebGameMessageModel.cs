
namespace chess.Api.Models.WebGameModels; 

public class SendWebGameMessageModel {
    public Guid GameId { get; set; }
    public required string Message { get; set; }
}
