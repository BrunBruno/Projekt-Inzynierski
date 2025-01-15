
using chess.Application.Services;
using System.Diagnostics;

namespace chess.Infrastructure.Services;

public class EngineService : IEngineService {

    private static readonly string executablePath = "ceng.exe";
    private readonly Process _stockfishProcess;

    public EngineService() {

        try {
            _stockfishProcess = new Process()
            {
                StartInfo = new ProcessStartInfo()
                {
                    FileName = executablePath,
                    RedirectStandardInput = true,
                    RedirectStandardOutput = true,
                    UseShellExecute = false,
                    CreateNoWindow = true,
                },
            };

            _stockfishProcess.Start();

        } catch (Exception ex) {
            Console.WriteLine(ex.Message);
            throw new ApplicationException("Fail");
        }
    }

    ///<inheritdoc/>
    public void SendCommand(string command) {
        _stockfishProcess.StandardInput.WriteLine(command);
        _stockfishProcess.StandardInput.Flush();
    }

    ///<inheritdoc/>
    public List<string> ReadOutput() {
        var engineOutputs = new List<string>();
        var stopwatch = Stopwatch.StartNew();

        string line;
        while ((line = _stockfishProcess.StandardOutput.ReadLine()!) != null) {
            engineOutputs.Add(line);

            if (line.StartsWith("bestmove") || line.StartsWith("Fen:"))
                break;

            if (stopwatch.ElapsedMilliseconds > 1000) {
                break;
            }
        }

        stopwatch.Stop();

        return engineOutputs;
    }

    ///<inheritdoc/>
    public void Close() {
        SendCommand("quit");
        _stockfishProcess.Close();
    }
}
