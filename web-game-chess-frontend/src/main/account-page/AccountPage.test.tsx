import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AccountPage from "./AccountPage";
import { MemoryRouter } from "react-router-dom";
import { GetAllFriendsByStatusDto } from "../../shared/utils/types/friendshipDtos";
import { Guid } from "guid-typescript";
import { GetFullUserDto, GetRegisterConfDto } from "../../shared/utils/types/userDtos";
import { GetTypeHistoryDto } from "../../shared/utils/types/webGameDtos";
import { mockElo, mockGameOutcome } from "../../shared/utils/objects/generalMocks";
import {
  AppearanceOfBoard,
  AppearanceOfGamePage,
  AppearanceOfPieces,
  DataConfiguration,
  FriendshipStatus,
  TimingType,
} from "../../shared/utils/objects/entitiesEnums";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import { friendshipController, userController, webGameController } from "../../shared/utils/services/ApiService";
import { GetTypeHistoryModel } from "../../shared/utils/types/webGameModels";
import { GetRegisterConfModel } from "../../shared/utils/types/userModels";
import { PagedResult } from "../../shared/utils/types/abstractDtosAndModels";
import { GetAllFriendsByStatusModel } from "../../shared/utils/types/friendshipModels";

// models

const getPasswordRegisterConfModel: GetRegisterConfModel = {
  configurationId: DataConfiguration.userPassword,
};

const getBlitzTypeModel: GetTypeHistoryModel = {
  pageNumber: 1,
  pageSize: 1000,
  type: TimingType.blitz,
};

const getFriendsModel: GetAllFriendsByStatusModel = {
  username: "",
  status: FriendshipStatus.accepted,
  pageNumber: 1,
  pageSize: 10,
};

// responses

const responseConfiguration: GetRegisterConfDto = {
  minLength: null,
  maxLength: null,
  requireUppercase: false,
  requireLowercase: false,
  requireDigit: false,
  requireSpecialChar: false,
};

const responseFriends: PagedResult<GetAllFriendsByStatusDto> = {
  items: [
    {
      username: "User 1",
      name: "User 1",
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
      username: "User 2",
      name: "User 2",
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

const responseTypeHistory: PagedResult<GetTypeHistoryDto> = {
  items: [
    {
      whitePlayer: "White User",
      blackPlayer: "Black User",
      moves: 50,
      isWinner: true,
      prevElo: 900,
      createdAt: new Date(),
    },
    {
      whitePlayer: "White User",
      blackPlayer: "Black User",
      moves: 40,
      isWinner: false,
      prevElo: 1100,
      createdAt: new Date(),
    },
  ],
  totalPages: 1,
  itemsFrom: 1,
  itemsTo: 2,
  totalItemsCount: 2,
};

describe("UserSection Component", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  it("should renders SettingsSection by default without crashing", async () => {
    mock.onGet(userController.getRegisterConf(getPasswordRegisterConfModel)).reply(200, responseConfiguration);
    mock.onGet(userController.getFullUser()).reply(200, responseFullUser);
    mock.onGet(userController.getElo()).reply(200, mockElo);

    render(
      <MemoryRouter>
        <AccountPage />
      </MemoryRouter>
    );

    // check init calls
    expect(mock.history.get).toHaveLength(3);

    expect(await waitFor(() => screen.getByTestId("account-page-settings-section"))).toBeInTheDocument();
  });

  it("should renders correct content on content selection", async () => {
    // init calls
    mock.onGet(userController.getRegisterConf(getPasswordRegisterConfModel)).reply(200, responseConfiguration);
    mock.onGet(userController.getFullUser()).reply(200, responseFullUser);
    mock.onGet(userController.getElo()).reply(200, mockElo);

    // action calls
    mock.onGet(friendshipController.getAllFriendsByStatus(getFriendsModel)).reply(200, responseFriends);
    mock.onGet(webGameController.getTypeHistory(getBlitzTypeModel)).reply(200, responseTypeHistory);

    render(
      <MemoryRouter>
        <AccountPage />
      </MemoryRouter>
    );

    // check init calls
    expect(mock.history.get).toHaveLength(3);

    // opening history section
    const setHistoryButton = await waitFor(() => screen.getByTestId("set-history-blitz-button"));
    fireEvent.click(setHistoryButton);

    expect(mock.history.get).toHaveLength(4);

    const historySection = await waitFor(() => screen.getByTestId("account-page-history-section"));
    expect(historySection).toBeInTheDocument();

    const historyHeading = await waitFor(() => screen.getByRole("heading", { level: 2 }));
    expect(historyHeading).toHaveTextContent(/blitz/i);

    // opening friends section
    const setFriendsButton = screen.getByTestId("set-friends-button");
    fireEvent.click(setFriendsButton);

    expect(mock.history.get).toHaveLength(5);

    const friendSection = await waitFor(() => screen.getByTestId("account-page-friends-section"));
    expect(friendSection).toBeInTheDocument();

    const friendCards = screen.getAllByTestId("account-page-friend-card");
    expect(friendCards).toHaveLength(2);
  });
});
