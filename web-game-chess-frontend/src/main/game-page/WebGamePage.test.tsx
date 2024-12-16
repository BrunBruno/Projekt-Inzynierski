import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, waitFor, screen } from "@testing-library/react";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import { Guid } from "guid-typescript";
import {
  AppearanceOfBoard,
  AppearanceOfGamePage,
  AppearanceOfPieces,
  PieceColor,
  TimingType,
} from "../../shared/utils/objects/entitiesEnums";
import {
  FetchTimeDto,
  GetAllWebGameMessagesDto,
  GetGameTimingDto,
  GetWebGameDto,
  GetWebGamePlayerDto,
} from "../../shared/utils/types/webGameDtos";
import { webGameController } from "../../shared/utils/services/ApiService";
import WebGamePage from "./WebGamePage";

const gameId = Guid.create();
const gameIdStr = gameId.toString();

// models

// responses

const responseWebGame: GetWebGameDto = {
  position: "",
  turn: 0,
  hasEnded: false,
  enPassant: null,
  halfmoveClock: 0,
  canWhiteKingCastle: false,
  canWhiteShortRookCastle: false,
  canWhiteLongRookCastle: false,
  canBlackKingCastle: false,
  canBlackShortRookCastle: false,
  canBlackLongRookCastle: false,
  moves: [],
  gameSettings: {
    appearanceOfPieces: AppearanceOfPieces.Standard,
    appearanceOfBoard: AppearanceOfBoard.Default,
    appearanceOfGamePage: AppearanceOfGamePage.Simple,
    allowCheats: false,
  },
  createdAt: new Date(),
  duration: 0,
  increment: 0,
  timingType: TimingType.classic,
  whitePlayer: {
    name: "WhiteUser",
    profilePicture: null,
    elo: 1000,
    color: PieceColor.white,
  },
  blackPlayer: {
    name: "BlackUser",
    profilePicture: null,
    elo: 1000,
    color: PieceColor.black,
  },
};

const responseTiming: GetGameTimingDto = {
  type: TimingType.classic,
  minutes: 24 * 60 * 60,
  increment: 0,
};

const responsePlayer: GetWebGamePlayerDto = {
  name: "WhiteUser",
  profilePicture: null,
  elo: 1000,
  color: PieceColor.white,
};

const responsePlayerTimes: FetchTimeDto = {
  turn: 0,
  whiteTimeLeft: 24 * 60 * 60,
  blackTimeLeft: 24 * 60 * 60,
};

const responseMessages: GetAllWebGameMessagesDto[] = [];

describe("WebGame Components", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  // default render test
  it("should render web game without crashing", async () => {
    // initial calls
    mock.onGet(webGameController.getGame(gameId)).reply(200, responseWebGame);
    mock.onGet(webGameController.getAllMessages(gameId)).reply(200, responseMessages);
    mock.onGet(webGameController.fetchTime(gameId)).reply(200, responsePlayerTimes);
    mock.onGet(webGameController.getGameTiming(gameId)).reply(200, responseTiming);
    mock.onGet(webGameController.getPlayer(gameId)).reply(200, responsePlayer);

    render(
      <MemoryRouter initialEntries={[{ pathname: `/game/${gameIdStr}` }]}>
        <Routes>
          <Route path="/game/:gameIdStr" element={<WebGamePage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByTestId("main-web-game-page")).toBeInTheDocument());
  });
});
