
using chess.Core.Enums;

namespace chess.Application.Requests.GameRequests.GetGameTiming;

public class GetGameTimingDto {
    public TimingTypes Type { get; set; }
    public int Minutes { get; set; }
    public int Increment { get; set; }
}
