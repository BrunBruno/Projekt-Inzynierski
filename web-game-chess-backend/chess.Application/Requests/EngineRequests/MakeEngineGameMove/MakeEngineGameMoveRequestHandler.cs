
using chess.Application.Repositories.EngineGameRepositories;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.EngineRequests.MakeEngineGameMove;

public class MakeEngineGameMoveRequestHandler : IRequestHandler<MakeEngineGameMoveRequest, MakeEngineGameMoveDto> {

    private readonly IEngineGameRepository _engineGameRepository;
    private readonly IEngineGameMoveRepository _engineGameMoveRepository;
    private readonly IEngineService _engineService;

    public MakeEngineGameMoveRequestHandler(
        IEngineGameRepository engineGameRepository,
        IEngineGameMoveRepository engineGameMoveRepository,
        IEngineService engineService
    ) {
        _engineGameRepository = engineGameRepository;
        _engineGameMoveRepository = engineGameMoveRepository;
        _engineService = engineService;
    }

    public async Task<MakeEngineGameMoveDto> Handle(MakeEngineGameMoveRequest request, CancellationToken cancellationToken) {


        var game = await _engineGameRepository.GetById(request.GameId)
            ?? throw new NotFoundException("Game not found.");

        if (game.HasEnded)
            throw new BadRequestException("Can not make move in finished game");

        game.Position = request.Position;
        game.Round = (game.Turn / 2) + 1;
        game.Turn += 1;

        var playerMove = new EngineGameMove()
        {
            Id = Guid.NewGuid(),
            DoneMove = request.Move,
            Position = game.Position,
            OldCoordinates = "",
            NewCoordinates = "",
            Turn = game.Turn,
            GameId = game.Id,
        };


       await _engineGameMoveRepository.Create(playerMove);


        var activeColor = (game.Turn % 2 == 0) ? "w" : "b";
        var castlingAvailability = "KQkq";               
        var enPassant = "-";                            
        var halfmoveClock = "0";                        
        var fullmoveNumber = ((game.Turn / 2) + 1).ToString();

        var fullFen = $"{game.Position} {activeColor} {castlingAvailability} {enPassant} {halfmoveClock} {fullmoveNumber}";

        var outputs = new List<string>();

        _engineService.SendCommand($"position fen {fullFen}");
        _engineService.SendCommand("go depth 1");

        var bestMoveOutput = _engineService.ReadOutput();

        var bestMoveLine = bestMoveOutput.FirstOrDefault(line => line.StartsWith("bestmove"))
            ?? throw new InvalidOperationException("No valid move from Stockfish.");


        var bestMove = bestMoveLine.Split(' ')[1];
        Console.WriteLine(bestMoveLine);

        _engineService.SendCommand($"position fen {fullFen} moves {bestMove}");
        _engineService.SendCommand("d"); 

        var newPositionOutput = _engineService.ReadOutput();
        var newPositionLine = newPositionOutput.FirstOrDefault(line => line.Contains("Fen:"));
        var newFenPosition = newPositionLine?.Split("Fen:")[1].Trim() 
            ?? throw new InvalidOperationException("Failed to retrieve new position.");

        var newPosition = newFenPosition.Split(' ')[0];

     

        game.Position = newPosition;
        game.Round = (game.Turn / 2) + 1;
        game.Turn += 1;

        var engineMove = new EngineGameMove()
        {
            Id = Guid.NewGuid(),
            DoneMove = bestMove,
            Position = game.Position,
            OldCoordinates = "",
            NewCoordinates = "",
            Turn = game.Turn,
            GameId = game.Id,
        };


       await _engineGameMoveRepository.Create(engineMove);



        _engineService.Close();


        await _engineGameRepository.Update(game);


        var returnDto = new MakeEngineGameMoveDto() { 
            NewPosition = game.Position,
            Turn = game.Turn,
            Outputs = outputs,
        };

        return returnDto;
    }
}
