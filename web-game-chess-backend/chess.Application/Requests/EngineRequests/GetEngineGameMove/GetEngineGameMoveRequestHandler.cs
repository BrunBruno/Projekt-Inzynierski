
using chess.Application.Repositories.EngineGameRepositories;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.EngineRequests.GetEngineGameMove;

/// <summary>
/// 
/// </summary>
public class GetEngineGameMoveRequestHandler : IRequestHandler<GetEngineGameMoveRequest> {

    private readonly IEngineService _engineService;
    private readonly IEngineGameRepository _engineGameRepository;
    private readonly IEngineGameMoveRepository _engineGameMoveRepository;
    private readonly IUserContextService _userContextService;

    public GetEngineGameMoveRequestHandler(
        IEngineService engineService,
        IEngineGameRepository engineGameRepository,
        IEngineGameMoveRepository engineGameMoveRepository,
        IUserContextService userContextService
    ) {
        _engineService = engineService;
        _engineGameRepository = engineGameRepository;
        _engineGameMoveRepository = engineGameMoveRepository;
        _userContextService = userContextService;
    }

    public async Task Handle(GetEngineGameMoveRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var game = await _engineGameRepository.GetById(request.GameId)
            ?? throw new NotFoundException("Game not found.");

        if (game.Player.UserId != userId)
            throw new UnauthorizedException("This is not user game.");


        var fullFen = MakeFen(game);


        _engineService.SendCommand($"position fen {fullFen}");
        _engineService.SendCommand("go depth 1");

        var bestMoveOutput = _engineService.ReadOutput();

        var bestMoveLine = bestMoveOutput.FirstOrDefault(line => line.StartsWith("bestmove"))
            ?? throw new InvalidOperationException("Stockfish error.");


        var bestMove = bestMoveLine.Split(' ')[1];
        Console.WriteLine(bestMoveLine);

        _engineService.SendCommand($"position fen {fullFen} moves {bestMove}");
        _engineService.SendCommand("d");

        var newPositionOutput = _engineService.ReadOutput();
        var newPositionLine = newPositionOutput.FirstOrDefault(line => line.Contains("Fen:"))
            ?? throw new InvalidOperationException("Stockfish error.");

        var newFenPosition = newPositionLine.Split("Fen:")[1].Trim()
            ?? throw new InvalidOperationException("Stockfish error.");

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


        _engineService.Close();


        await _engineGameMoveRepository.Create(engineMove);
        await _engineGameRepository.Update(game);
    }

    private static string MakeFen(EngineGame game) {
        // active color
        var activeColor = (game.Turn % 2 == 0) ? "w" : "b";

        // castling avalibility
        string whiteKingsideCastle = game.CurrentState.CanWhiteKingCastle == true && game.CurrentState.CanWhiteShortRookCastle == true ? "K" : "";
        string whiteQueensideCastle = game.CurrentState.CanWhiteKingCastle == true && game.CurrentState.CanWhiteLongRookCastle == true ? "Q" : "";
        string blackKingsideCastle = game.CurrentState.CanBlackKingCastle == true && game.CurrentState.CanBlackShortRookCastle == true ? "k" : "";
        string blackQueensideCastle = game.CurrentState.CanBlackKingCastle == true && game.CurrentState.CanBlackLongRookCastle == true ? "q" : "";

        var castlingAvailability = $"{whiteKingsideCastle}{whiteQueensideCastle}{blackKingsideCastle}{blackQueensideCastle}";
        castlingAvailability = castlingAvailability == "" ? "-" : castlingAvailability;

        // en passant
        var enPassantParts = game.CurrentState.EnPassant?.Split(",");
        var enPassant = enPassantParts == null ? "-" : $"{(char)('a' + (int.Parse(enPassantParts[0]) - 1))}{enPassantParts[1]}";

        // half move cloec
        var halfmoveClock = "0";

        // full move clock
        var fullmoveNumber = ((game.Turn / 2) + 1).ToString();

        var fenPosition = $"{game.Position} {activeColor} {castlingAvailability} {enPassant} {halfmoveClock} {fullmoveNumber}";

        return fenPosition;
    }
}
