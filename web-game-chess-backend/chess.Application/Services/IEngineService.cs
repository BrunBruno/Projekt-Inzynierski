
namespace chess.Application.Services;

/// <summary>
/// Service for communicating with chess engine
/// </summary>
public interface IEngineService {

    /// <summary>
    /// For inserting commands
    /// </summary>
    /// <param name="command"></param>
    void SendCommand(string command);

    /// <summary>
    /// For reading all output
    /// </summary>
    /// <returns></returns>
    List<string> ReadOutput();

    /// <summary>
    /// End engine work
    /// </summary>
    void Close();
}
