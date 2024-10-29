
namespace chess.Api.Models.WebGameModels; 

public class SendGameMessageModel {
    public Guid GameId { get; set; }
    public required string Message { get; set; }
}
