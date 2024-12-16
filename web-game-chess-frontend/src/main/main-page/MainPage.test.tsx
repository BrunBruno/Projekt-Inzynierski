import { MemoryRouter } from "react-router-dom";
import { render, waitFor, screen, fireEvent } from "@testing-library/react";
import { GetEloDto, GetFullUserDto, GetUserDto, IsEmailVerifiedDto } from "../../shared/utils/types/userDtos";
import { Guid } from "guid-typescript";
import { mockElo, mockGameOutcome, mockUserForToken } from "../../shared/utils/objects/generalMocks";
import {
  CreatePrivateGameDto,
  GetAllActiveGamesDto,
  GetAllFinishedGamesDto,
  GetTotalGamesStatsDto,
  SearchWebGameDto,
} from "../../shared/utils/types/webGameDtos";
import { GetAllFriendsByStatusDto } from "../../shared/utils/types/friendshipDtos";
import {
  AppearanceOfBoard,
  AppearanceOfGamePage,
  AppearanceOfPieces,
  FriendshipStatus,
} from "../../shared/utils/objects/entitiesEnums";
import MainPage from "./MainPage";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import {
  engineGameController,
  friendshipController,
  userController,
  webGameController,
} from "../../shared/utils/services/ApiService";
import { PagedResult } from "../../shared/utils/types/abstractDtosAndModels";
import { GetAllActiveGamesModel, GetAllFinishedGamesModel } from "../../shared/utils/types/webGameModels";
import MainRouter from "../MainRouter";
import { GetAllFriendsByStatusModel } from "../../shared/utils/types/friendshipModels";
import { JwtService } from "../../shared/utils/services/MockJwtService";
import { StartEngineGameDto } from "../../shared/utils/types/engineGameDtos";

// models

const getAllActiveGamesModel: GetAllActiveGamesModel = {
  pageNumber: 1,
  pageSize: 3, // default setting in def view
};

const getAllFinishedGamesModel: GetAllFinishedGamesModel = {
  pageNumber: 1,
  pageSize: 3, // default setting in def view
};

const getAllFriendsModel: GetAllFriendsByStatusModel = {
  username: "",
  status: FriendshipStatus.accepted,
  pageSize: 10,
  pageNumber: 1,
};

// responses

const responseIsVerified: IsEmailVerifiedDto = {
  isEmailVerified: true,
};

const responseUser: GetUserDto = {
  username: "User",
  name: null,
  profilePicture: null,
  backgroundImage: null,
  country: "PL",
  userId: Guid.create(),
  email: "user@test.com",
};

const responseElo: GetEloDto = mockElo;

const responseSearchGame: SearchWebGameDto = {
  playerId: Guid.create(),
  timingId: Guid.create(),
};

const responseFriends: PagedResult<GetAllFriendsByStatusDto> = {
  items: [
    {
      username: "Friend 1",
      name: null,
      profilePicture: null,
      backgroundImage: null,
      country: "PL",
      friendshipId: Guid.create(),
      elo: mockElo,
      isRequestor: false,
      outcomeTotal: mockGameOutcome,
      outcomeTogether: mockGameOutcome,
    },
    {
      username: "Friend 2",
      name: null,
      profilePicture: null,
      backgroundImage: null,
      country: "PL",
      friendshipId: Guid.create(),
      elo: mockElo,
      isRequestor: true,
      outcomeTotal: mockGameOutcome,
      outcomeTogether: mockGameOutcome,
    },
  ],
  totalPages: 1,
  itemsFrom: 1,
  itemsTo: 2,
  totalItemsCount: 2,
};

const responsePrivateGame: CreatePrivateGameDto = {
  friendId: Guid.create(),
  gameId: Guid.create(),
  inviter: "User",
};

const responseFullUser: GetFullUserDto = {
  isPrivate: false,
  username: "User",
  name: "User",
  profilePicture: null,
  backgroundImage: null,
  country: "PL",
  email: "user@test.com",
  joinDate: new Date(),
  bio: null,
  onlineOutcomeTotal: mockGameOutcome,
  offlineOutcomeTotal: mockGameOutcome,
  timingTypeGamesPlayed: { bullet: 10, blitz: 10, rapid: 10, classic: 10, daily: 10 },
  winsByCheckMate: 2,
  winsByTimeout: 5,
  winsByResignation: 1,
  losesByCheckMate: 8,
  losesByTimeout: 5,
  losesByResignation: 3,
  settings: {
    appearanceOfPieces: AppearanceOfPieces.Standard,
    appearanceOfBoard: AppearanceOfBoard.Default,
    appearanceOfGamePage: AppearanceOfGamePage.Simple,
    allowCheats: false,
  },
};

const responseGameStats: GetTotalGamesStatsDto = {
  gamesPlayed: 0,
  usersJoined: 0,
};

const responseActiveGames: PagedResult<GetAllActiveGamesDto> = {
  items: [],
  itemsFrom: 0,
  itemsTo: 0,
  totalPages: 0,
  totalItemsCount: 0,
};

const responseFinishedGames: PagedResult<GetAllFinishedGamesDto> = {
  items: [],
  itemsFrom: 0,
  itemsTo: 0,
  totalPages: 0,
  totalItemsCount: 0,
};

const responseStartEngineGame: StartEngineGameDto = {
  gameId: Guid.create(),
};

vi.mock("../shared/utils/services/GameHubService", () => ({
  startConnectionWithToken: vi.fn().mockResolvedValueOnce(undefined),
  AddSelfNotification: vi.fn().mockResolvedValueOnce(undefined),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: vi.fn(() => ({ gameIdStr: responsePrivateGame.gameId.toString() })),
  };
});

describe("MainPage Components", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    vi.clearAllMocks();
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  // default render test
  it("should render default view by default", async () => {
    mock.onGet(userController.getFullUser()).reply(200, responseFullUser);
    mock.onGet(userController.getElo()).reply(200, responseElo);
    mock.onGet(webGameController.getTotalGamesStats()).reply(200, responseGameStats);
    mock.onGet(webGameController.getAllActiveGames(getAllActiveGamesModel)).reply(200, responseActiveGames);
    mock.onGet(webGameController.getAllFinishedGames(getAllFinishedGamesModel)).reply(200, responseFinishedGames);

    render(
      <MemoryRouter>
        <MainPage />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByTestId("main-page-default-view")).toBeInTheDocument());

    expect(mock.history.get).toHaveLength(5);
  });

  // starting game and canceling search test
  it("should open vs players view on click and set searching page after timing selection", async () => {
    mock.onGet(userController.isVerified()).reply(200, responseIsVerified);

    mock.onGet(userController.getFullUser()).reply(200, responseFullUser);
    mock.onGet(userController.getElo()).reply(200, responseElo);
    mock.onGet(webGameController.getTotalGamesStats()).reply(200, responseGameStats);
    mock.onGet(webGameController.getAllActiveGames(getAllActiveGamesModel)).reply(200, responseActiveGames);
    mock.onGet(webGameController.getAllFinishedGames(getAllFinishedGamesModel)).reply(200, responseFinishedGames);

    mock.onPost(webGameController.startSearch()).reply(200, responseSearchGame);

    render(
      <MemoryRouter>
        <MainPage />
      </MemoryRouter>
    );

    const vsPlayerButton = await waitFor(() => screen.getByTestId("main-page-game-hub-vs-player-button"));
    fireEvent.click(vsPlayerButton);

    await waitFor(() => expect(screen.getByTestId("main-page-time-selection-section")).toBeInTheDocument());

    // selecting timing
    const timeSelectionButton = screen.getByTestId("main-page-time-control-0-0");
    expect(timeSelectionButton).toHaveTextContent(/1min/i);
    fireEvent.click(timeSelectionButton);

    // check if in searching mode
    const searchingSection = await waitFor(() => screen.getByTestId("searching-page"));
    expect(searchingSection).toHaveTextContent(/Searching for Game/i);
  });

  // starting engine game test
  it("should open vs computer view on click and start game after bot selection", async () => {
    // authorization process
    const jwtService = new JwtService();
    localStorage.setItem("token", jwtService.getJwtToken(mockUserForToken));
    mock.onGet(userController.isVerified()).reply(200, responseIsVerified);
    mock.onGet(userController.getUser()).reply(200, responseUser);

    // initial calls
    mock.onGet(userController.getFullUser()).reply(200, responseFullUser);
    mock.onGet(userController.getElo()).reply(200, responseElo);
    mock.onGet(webGameController.getTotalGamesStats()).reply(200, responseGameStats);
    mock.onGet(webGameController.getAllActiveGames(getAllActiveGamesModel)).reply(200, responseActiveGames);
    mock.onGet(webGameController.getAllFinishedGames(getAllFinishedGamesModel)).reply(200, responseFinishedGames);

    // action calls
    mock.onPost(engineGameController.startEngineGame()).reply(200, responseStartEngineGame);

    render(
      <MemoryRouter initialEntries={["/"]}>
        <MainRouter />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByTestId("main-page-default-view")).toBeInTheDocument());

    const vsComputerButton = await waitFor(() => screen.getByTestId("main-page-game-hub-vs-computer-button"));
    fireEvent.click(vsComputerButton);

    await waitFor(() => expect(screen.getByTestId("main-page-bot-selection-section")).toBeInTheDocument());
    // selecting bot
    const botSelectionButton = screen.getByTestId("main-page-engine-level-4");
    expect(botSelectionButton).toHaveTextContent(/5/i);
    fireEvent.click(botSelectionButton);

    // check if in engine game page
    const searchingPage = await waitFor(() => screen.getByTestId("game-loading-page"));
    expect(searchingPage).toBeInTheDocument();
  });

  // inviting friend to game test
  it("should open vs friend view and navigate to awaiting page after friend selection", async () => {
    mock.onGet(userController.isVerified()).reply(200, responseIsVerified);

    mock.onGet(userController.getFullUser()).reply(200, responseFullUser);
    mock.onGet(userController.getElo()).reply(200, responseElo);
    mock.onGet(webGameController.getTotalGamesStats()).reply(200, responseGameStats);
    mock.onGet(webGameController.getAllActiveGames(getAllActiveGamesModel)).reply(200, responseActiveGames);
    mock.onGet(webGameController.getAllFinishedGames(getAllFinishedGamesModel)).reply(200, responseFinishedGames);

    mock.onGet(friendshipController.getAllFriendsByStatus(getAllFriendsModel)).reply(200, responseFriends);
    mock.onPost(webGameController.createPrivateGame()).reply(200, responsePrivateGame);
    mock.onDelete(webGameController.cancelPrivateGame(responsePrivateGame.gameId)).reply(200);

    render(
      <MemoryRouter>
        <MainPage />
      </MemoryRouter>
    );

    // going to vs friends section
    const vsFriendButton = await waitFor(() => screen.getByTestId("main-page-game-hub-vs-friend-button"));
    fireEvent.click(vsFriendButton);

    const vsFriendSection = await waitFor(() => screen.getByTestId("main-page-friend-selection-section"));
    expect(vsFriendSection).toHaveTextContent(/Invite to play/i);

    const friendsList = await waitFor(() => screen.getByTestId("main-page-vs-friend-section-friend-list"));
    expect(friendsList).toBeInTheDocument();

    // click on invite
    const inviteButtons = await waitFor(() => screen.getAllByTestId("vs-friend-invite-to-game-card"));
    expect(inviteButtons).toHaveLength(responseFriends.items.length);
    fireEvent.click(inviteButtons[0]);

    // selection timing
    const selectTimingButton = await waitFor(() => screen.getByTestId("main-page-time-control-0-0"));
    expect(selectTimingButton).toHaveTextContent(/1min/i);
    fireEvent.click(selectTimingButton);

    const searchingSection = await waitFor(() => screen.getByTestId("searching-page"));
    expect(searchingSection).toHaveTextContent(/Waiting for opponent/i);

    // canceling search
    const cancelButton = screen.getByTestId("searching-page-cancel-button");
    fireEvent.click(cancelButton);
    await waitFor(() => expect(screen.getByTestId("main-page-friend-selection-section")).toBeInTheDocument());
  });
});
