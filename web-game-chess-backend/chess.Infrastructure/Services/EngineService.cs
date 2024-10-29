
using chess.Application.Services;
using System.Diagnostics;

namespace chess.Infrastructure.Services;

public class EngineService : IEngineService {


    private static readonly string executablePath = "";
    private bool _calculating = false;

    private readonly Stopwatch _watch = new();
    private readonly Process _stockfishProcess;

    public EngineService() {

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
    }

    public void SendCommand(string command) {
        _stockfishProcess.StandardInput.WriteLine(command);
        _stockfishProcess.StandardInput.Flush();
    }

    public string ReadOutput() {
        return _stockfishProcess.StandardOutput.ReadLine();
    }

    public void Close() {
        SendCommand("quit");
        _stockfishProcess.Close();
    }

    public void StartCalculation() {
        if (!_calculating) {
            _watch.Restart();
            _calculating = true;

            //SendCommand($"position fen {request.FEN}");

            SendCommand($"go movetime 3000");
        } else {
            throw new ApplicationException();
        }

    }
}
