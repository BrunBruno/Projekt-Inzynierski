import { render, waitFor, screen, fireEvent } from "@testing-library/react";
import UsersPage from "./UsersPage";
import { MemoryRouter } from "react-router-dom";
import { createMockServer } from "../../shared/utils/services/MockServerService";
import { GetAllFriendsByStatusDto, GetAllNonFriendsDto } from "../../shared/utils/types/friendshipDtos";
import { Guid } from "guid-typescript";
import { mockElo, mockGameOutcome } from "../../shared/utils/objects/generalMocks";
import { GetOtherUserDto } from "../../shared/utils/types/userDtos";

const mockAllUsers: GetAllNonFriendsDto[] = [
  {
    username: "User 1",
    name: null,
    profilePicture: null,
    backgroundImage: null,
    country: "PL",
    userId: Guid.create(),
    elo: mockElo,
    outcomeTotal: mockGameOutcome,
  },
  {
    username: "User 2",
    name: null,
    profilePicture: null,
    backgroundImage: null,
    country: "PL",
    userId: Guid.create(),
    elo: mockElo,
    outcomeTotal: mockGameOutcome,
  },
];

const mockFriends: GetAllFriendsByStatusDto[] = [
  {
    username: "Friend 1",
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
  {
    username: "Friend 2",
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
];

const mockFriend: GetOtherUserDto = {
  username: "User 1",
  name: null,
  profilePicture: null,
  backgroundImage: null,
  country: "PL",
  joinDate: new Date(),
  bio: null,
  gamesPlayed: 10,
  elo: mockElo,
};

// set up server
const server = createMockServer({
  getAllNonFriendsDtoList: mockAllUsers,
  getAllFriendsByStatusDtoList: mockFriends,
  getOtherUserDto: mockFriend,
});

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("UsersPage Components", () => {
  // default render test
  it("should render all users list by default", async () => {
    render(
      <MemoryRouter>
        <UsersPage />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByTestId("users-page-all-user-list")).toBeInTheDocument());

    expect(screen.getByText(/User 1/i)).toBeInTheDocument();
  });

  // changing friend list test
  it("should render friends list on button click", async () => {
    render(
      <MemoryRouter>
        <UsersPage />
      </MemoryRouter>
    );

    const friendsButton = await waitFor(() => screen.getByTestId("users-page-select-list-button-accepted"));
    fireEvent.click(friendsButton);

    await waitFor(() => expect(screen.getByTestId("users-page-friends-list")).toBeInTheDocument());

    expect(screen.getByText(/Friend 1/i)).toBeInTheDocument();
  });

  // opening user profile test
  it("should open user profile modal on button click", async () => {
    render(
      <MemoryRouter>
        <UsersPage />
      </MemoryRouter>
    );

    const profileButtons = await waitFor(() => screen.getAllByTestId("users-page-user-card-profile-button"));
    expect(profileButtons).toHaveLength(mockAllUsers.length);
    fireEvent.click(profileButtons[0]);

    await waitFor(() => expect(screen.getByTestId("users-page-profile-section")).toBeInTheDocument());

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/User 1/i);
  });
});
