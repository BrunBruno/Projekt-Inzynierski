import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AccountPage from "./AccountPage";
import { MemoryRouter } from "react-router-dom";
import { GetAllFriendsByStatusDto } from "../../shared/utils/types/friendshipDtos";
import { Guid } from "guid-typescript";
import { EloDto, WinDrawLose } from "../../shared/utils/types/abstractDtosAndModels";
import { GetFullUserDto } from "../../shared/utils/types/userDtos";
import { GetTypeHistoryDto } from "../../shared/utils/types/gameDtos";
import { createMockFriendshipControllerServer } from "../../shared/utils/services/MockFriendshipControllerService";
import { createGameControllerMockServer } from "../../shared/utils/services/MockGameControllerService";
import { createMockUserControllerServer } from "../../shared/utils/services/MockUserControllerService";

/** mocks */
const mockElo: EloDto = {
  bullet: 1000,
  blitz: 1000,
  rapid: 1000,
  classic: 1000,
  daily: 1000,
};

const mockWdl: WinDrawLose = {
  total: 10,
  wins: 5,
  draws: 1,
  loses: 4,
};

const mockFriends: GetAllFriendsByStatusDto[] = [
  {
    username: "User 1",
    name: "User 1",
    imageUrl: null,
    country: "PL",
    friendshipId: Guid.create(),
    elo: mockElo,
    isRequestor: false,
    wdlTotal: mockWdl,
    wdlTogether: mockWdl,
  },
  {
    username: "User 2",
    name: "User 2",
    imageUrl: null,
    country: "PL",
    friendshipId: Guid.create(),
    elo: mockElo,
    isRequestor: true,
    wdlTotal: mockWdl,
    wdlTogether: mockWdl,
  },
];

const mockFullUser: GetFullUserDto = {
  username: "User",
  name: "User",
  imageUrl: null,
  country: "PL",
  email: "user@test.com",
  joinDate: new Date(),
  bio: null,
  wdlTotal: mockWdl,
  winsByCheckMate: 2,
  winsByTimeout: 5,
  winsByResignation: 1,
  losesByCheckMate: 8,
  losesByTimeout: 5,
  losesByResignation: 3,
};

const mockTypeHistory: GetTypeHistoryDto[] = [
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
];
//*/

// set up server
const userControllerServer = createMockUserControllerServer({
  getFullUserDto: mockFullUser,
  getEloDto: mockElo,
});
const gameControllerServer = createGameControllerMockServer({
  getTypeHistoryDtoList: mockTypeHistory,
});
const friendshipControllerServer = createMockFriendshipControllerServer({
  getAllFriendsByStatusDtoList: mockFriends,
});

beforeAll(() => {
  friendshipControllerServer.listen();
  userControllerServer.listen();
  gameControllerServer.listen();
});
afterEach(() => {
  friendshipControllerServer.resetHandlers();
  userControllerServer.resetHandlers();
  gameControllerServer.resetHandlers();
});
afterAll(() => {
  friendshipControllerServer.close();
  userControllerServer.close();
  gameControllerServer.close();
});
//*/

describe("UserSection Component", () => {
  it("should renders FriendsSection by default without crashing", async () => {
    render(
      <MemoryRouter>
        <AccountPage />
      </MemoryRouter>
    );

    expect(await waitFor(() => screen.getByTestId("account-page-friends-section"))).toBeInTheDocument();
  });

  it("should renders correct content on content selection", async () => {
    render(
      <MemoryRouter>
        <AccountPage />
      </MemoryRouter>
    );

    const setHistoryButton = await waitFor(() => screen.getByTestId("set-history-blitz-button"));
    fireEvent.click(setHistoryButton);

    const historySection = await waitFor(() => screen.getByTestId("account-page-history-section"));
    expect(historySection).toBeInTheDocument();

    const historyHeading = await waitFor(() => screen.getByRole("heading", { level: 2 }));
    expect(historyHeading).toHaveTextContent(/blitz/i);

    const setFriendsButton = screen.getByTestId("set-friends-button");
    fireEvent.click(setFriendsButton);

    const friendSection = await waitFor(() => screen.getByTestId("account-page-friends-section"));
    expect(friendSection).toBeInTheDocument();
  });
});
