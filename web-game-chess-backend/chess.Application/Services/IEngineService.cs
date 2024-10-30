
namespace chess.Application.Services;

public interface IEngineService {
    void SendCommand(string command);
    string ReadOutput();
    void Close();
}
