import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, waitFor, screen } from "@testing-library/react";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import EngineGamePage from "./EngineGamePage";
import { Guid } from "guid-typescript";
import { GetAllEngineGameMessagesDto, GetEngineGameDto } from "../../shared/utils/types/engineGameDtos";
import {
  AppearanceOfBoard,
  AppearanceOfGamePage,
  AppearanceOfPieces,
  PieceColor,
} from "../../shared/utils/objects/entitiesEnums";
import { engineGameController } from "../../shared/utils/services/ApiService";

const gameId = Guid.create();
const gameIdStr = gameId.toString();

// models

// responses

const responseEngineGame: GetEngineGameDto = {
  position: "",
  turn: 0,
  engineLevel: 1,
  hasEnded: false,
  enPassant: null,
  allowCheats: false,
  halfmoveClock: 0,
  canWhiteKingCastle: false,
  canWhiteShortRookCastle: false,
  canWhiteLongRookCastle: false,
  canBlackKingCastle: false,
  canBlackShortRookCastle: false,
  canBlackLongRookCastle: false,
  player: {
    name: "",
    profilePicture: null,
    elo: 0,
    color: PieceColor.white,
  },
  moves: [],
  gameSettings: {
    appearanceOfPieces: AppearanceOfPieces.Standard,
    appearanceOfBoard: AppearanceOfBoard.Default,
    appearanceOfGamePage: AppearanceOfGamePage.Simple,
    allowCheats: false,
  },
};

const responseMessages: GetAllEngineGameMessagesDto[] = [];

describe("EngineGame Components", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  // default render test
  it("should render engine game without crashing", async () => {
    // initial calls
    mock.onGet(engineGameController.getEngineGame(gameId)).reply(200, responseEngineGame);
    mock.onGet(engineGameController.getAllEngineGameMessages(gameId)).reply(200, responseMessages);

    render(
      <MemoryRouter initialEntries={[{ pathname: `/enginegame/${gameIdStr}` }]}>
        <Routes>
          <Route path="/enginegame/:gameIdStr" element={<EngineGamePage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByTestId("main-engine-game-page")).toBeInTheDocument());
  });
});
