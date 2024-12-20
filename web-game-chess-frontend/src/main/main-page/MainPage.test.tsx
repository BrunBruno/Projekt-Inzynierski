import { MemoryRouter } from "react-router-dom";
import { render, waitFor, screen, fireEvent } from "@testing-library/react";
import MainRouter from "../MainRouter";
import { GetUserDto, IsEmailVerifiedDto } from "../../shared/utils/types/userDtos";
import { Guid } from "guid-typescript";
import { JwtService } from "../../shared/utils/services/MockJwtService";
import { mockElo, mockUserForToken, mockGameOutcome } from "../../shared/utils/objects/generalMocks";
import { CreatePrivateGameDto, GetGameTimingDto, SearchWebGameDto } from "../../shared/utils/types/webGameDtos";
import { GetAllFriendsByStatusDto } from "../../shared/utils/types/friendshipDtos";
import { TimingType } from "../../shared/utils/objects/entitiesEnums";
import MainPage from "./MainPage";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";

// mocks
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

const responseSearchGame: SearchWebGameDto = {
  playerId: Guid.create(),
  timingId: Guid.create(),
};

const responseFriends: GetAllFriendsByStatusDto[] = [
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
];

const responsePrivateGame: CreatePrivateGameDto = {
  friendId: Guid.create(),
  gameId: Guid.create(),
  inviter: "User",
};

const responseGameTiming: GetGameTimingDto = {
  type: TimingType.bullet,
  minutes: 1,
  increment: 0,
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
    const jwtService = new JwtService();
    localStorage.setItem("token", jwtService.getJwtToken(mockUserForToken));

    render(
      <MemoryRouter>
        <MainPage />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByTestId("main-page-default-view")).toBeInTheDocument());
  });

  // starting game and canceling search test
  it("should open vs players view on click and set searching page after timing selection", async () => {
    render(
      <MemoryRouter>
        <MainPage />
      </MemoryRouter>
    );

    const vsPlayerButton = await waitFor(() => screen.getByTestId("main-page-game-hub-vs-player-button"));
    fireEvent.click(vsPlayerButton);

    await waitFor(() => expect(screen.getByTestId("main-page-vs-player-section")).toBeInTheDocument());

    const timeSelectionButton = screen.getByTestId("main-page-vs-player-time-control-0-0");
    expect(timeSelectionButton).toHaveTextContent(/1min/i);

    fireEvent.click(timeSelectionButton);

    const searchingPage = await waitFor(() => screen.getByTestId("searching-page-vs-player-search"));
    expect(searchingPage).toHaveTextContent(/Searching for Game/i);
  });

  // inviting friend to game test
  it("should open vs friend view and navigate to awaiting page after friend selection", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <MainRouter />
      </MemoryRouter>
    );

    // going to vs friends section
    const vsFriendButton = await waitFor(() => screen.getByTestId("main-page-game-hub-vs-friend-button"));
    fireEvent.click(vsFriendButton);

    const vsFriendSection = await waitFor(() => screen.getByTestId("main-page-vs-friend-section"));
    expect(vsFriendSection).toHaveTextContent(/Invite to play/i);

    const friendsList = await waitFor(() => screen.getByTestId("main-page-vs-friend-section-friend-list"));
    expect(friendsList).toBeInTheDocument();

    // click on invite
    const inviteButtons = await waitFor(() => screen.getAllByTestId("vs-friend-invite-to-game-button"));
    expect(inviteButtons).toHaveLength(responseFriends.length);
    fireEvent.click(inviteButtons[0]);

    // selection timing
    const selectTimingButton = await waitFor(() => screen.getByTestId("time-control-option-0-0"));
    expect(selectTimingButton).toHaveTextContent(/1min/i);
    fireEvent.click(selectTimingButton);

    const awaitingPage = await waitFor(() => screen.getByTestId("main-awaiting-page-searching"));
    expect(awaitingPage).toHaveTextContent(/Waiting for opponent/i);

    // canceling search
    const cancelButton = screen.getByTestId("main-awaiting-page-cancel-button");
    fireEvent.click(cancelButton);
    await waitFor(() => expect(screen.getByTestId("main-page-vs-friend-section")).toBeInTheDocument());
  });
});
