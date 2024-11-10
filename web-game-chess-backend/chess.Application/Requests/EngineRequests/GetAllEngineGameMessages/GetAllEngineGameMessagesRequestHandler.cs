
using chess.Application.Repositories.EngineGameRepositories;
using chess.Application.Services;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.EngineRequests.GetAllEngineGameMessages;

public class GetAllEngineGameMessagesRequestHandler : IRequestHandler<GetAllEngineGameMessagesRequest, List<GetAllEngineGameMessagesDto>> {

    private readonly IUserContextService _userContextService;
    private readonly IEngineGameRepository _engineGameRepository;
    private readonly IEngineGameMessageRepository _engineGameMessageRepository;

    public GetAllEngineGameMessagesRequestHandler(
        IUserContextService userContextService,
        IEngineGameRepository engineGameRepository,
        IEngineGameMessageRepository engineGameMessageRepository
    ) {
        _userContextService = userContextService;
        _engineGameRepository = engineGameRepository;
        _engineGameMessageRepository = engineGameMessageRepository;
    }

    public async Task<List<GetAllEngineGameMessagesDto>> Handle(GetAllEngineGameMessagesRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var game = await _engineGameRepository.GetById(request.GameId)
            ?? throw new NotFoundException("Game not found.");

        if (game.Player.UserId != userId)
            throw new UnauthorizedException("Not user game.");


        var messages = await _engineGameMessageRepository.GetAllForGame(request.GameId);

        var messagesDto = messages.Select(message => new GetAllEngineGameMessagesDto()
        {
            Message = message.Content,
            SenderName = "Chess BRN",
            SentAt = message.SentAt,
            Type = message.Type,
        }).ToList();

        return messagesDto;
    }
}
