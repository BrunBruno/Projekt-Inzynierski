
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


        //await _engineGameRepository.Update(game);


        var move = new EngineGameMove()
        {
            Id = Guid.NewGuid(),
            DoneMove = request.Move,
            Position = game.Position,
            OldCoordinates = "",
            NewCoordinates = "",
            Turn = game.Turn,
            GameId = game.Id,
        };


        //await _engineGameMoveRepository.Create(move);

        var outputs = new List<string>();

        _engineService.SendCommand("uci");
        outputs.Add(_engineService.ReadOutput());

        _engineService.SendCommand("position startpos moves e2e4");
        _engineService.SendCommand("go depth 1");
        outputs.Add(_engineService.ReadOutput());



        _engineService.Close();

        var returnDto = new MakeEngineGameMoveDto() { 
            NewPosition = game.Position,
            Turn = game.Turn,
            Outputs = outputs,
        };

        return returnDto;
    }
}
