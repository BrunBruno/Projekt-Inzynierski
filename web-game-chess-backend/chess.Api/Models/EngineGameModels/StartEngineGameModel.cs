
using chess.Core.Enums;
using chess.Core.Models;

namespace chess.Api.Models.EngineGameModels;

public class StartEngineGameModel : TimingTypeModel {

    public new TimingTypes? Type { get; set; }
    public new int? Minutes { get; set; }
    public new int? Increment { get; set; }
    public bool AllowUndo { get; set; }
    public int EngineLevel { get; set; }
}
