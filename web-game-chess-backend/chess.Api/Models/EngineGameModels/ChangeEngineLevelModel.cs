
namespace chess.Api.Models.EngineGameModels; 

public class ChangeEngineLevelModel {
    public Guid GameId { get; set; }
       public int Level { get; set; }
}
