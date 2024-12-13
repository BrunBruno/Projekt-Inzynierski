
using chess.Application.Services;
using chess.Infrastructure.Contexts;
using Microsoft.AspNetCore.Authorization.Policy;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace chess.Api.Tests;

public class TestWebApplicationFactory<TStartup> : WebApplicationFactory<TStartup> where TStartup: class {

    protected override void ConfigureWebHost(IWebHostBuilder builder) {

        builder.ConfigureServices(services => {
            var dbContextOptions = services.SingleOrDefault(service =>
                service.ServiceType == typeof(DbContextOptions<ChessAppDbContext>)
            ) ?? throw new InvalidOperationException();

            services.AddSingleton<IPolicyEvaluator, FakePolicyEvaluator>();
            services.AddMvc(option => option.Filters.Add(new FakeUserFilter()));


            var smtpService = services.First(s => s.ServiceType == typeof(ISmtpService));
            services.Remove(smtpService);
            services.AddScoped<ISmtpService, TestSmtpService>();

            services.Remove(dbContextOptions);

            var dbName = $"ChessDb{Guid.NewGuid()}";

            services.AddDbContext<ChessAppDbContext>(a => a.UseInMemoryDatabase(databaseName: dbName));
        });
    }
}
