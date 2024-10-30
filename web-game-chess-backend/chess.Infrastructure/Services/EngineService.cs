﻿
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
            throw new ApplicationException("Failed to start Stockfish process.");
        }
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
}
