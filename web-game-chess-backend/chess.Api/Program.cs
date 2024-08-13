
using chess.Api.Authorization;
using chess.Api.Binders;
using chess.Api.Hubs;
using chess.Api.Maps;
using chess.Application;
using chess.Infrastructure;
using chess.Shared;



var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddShared();
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddControllers();
builder.Services.AddCustomAuthorization();
builder.Services.AddCustomContollers();
builder.Services.AddMappingProfiles();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSignalR();

builder.Services.AddSwaggerGen(options => {
    options.AddSignalRSwaggerGen();
});



var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment()) {
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapHub<GameHub>("/game-hub");

app.UseCors("FrontEndClient");

// app.UseHttpsRedirection();


app.UseShared();


app.UseAuthorization();

app.MapControllers();

app.Run();

public partial class Program { }
