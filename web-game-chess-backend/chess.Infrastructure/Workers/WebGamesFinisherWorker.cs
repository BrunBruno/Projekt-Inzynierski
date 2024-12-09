
using chess.Application.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace chess.Infrastructure.Workers;

public class WebGamesFinisherWorker : BackgroundService {

    private readonly IServiceProvider _serviceProvider;

    public WebGamesFinisherWorker(IServiceProvider serviceProvider) { 
        _serviceProvider = serviceProvider;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken) {
        while (!stoppingToken.IsCancellationRequested) {
            await FinishGames();
            await Task.Delay(TimeSpan.FromSeconds(60), stoppingToken);
        }
    }

    private async Task FinishGames() {
        using var scope = _serviceProvider.CreateScope();
        var workerService = scope.ServiceProvider.GetRequiredService<IWebGamesFinisherService>();
        await workerService.FinishGames();
    }
}
