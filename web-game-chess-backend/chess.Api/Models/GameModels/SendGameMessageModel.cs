
namespace chess.Api.Models.GameModels; 

public class SendGameMessageModel {
    public Guid GameId { get; set; }
    public required string Message { get; set; }
}
