
namespace chess.Application.Services;

public interface IEngineService {
    void SendCommand(string command);
    List<string> ReadOutput();
    void Close();
}
