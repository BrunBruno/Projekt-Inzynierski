import { render, waitFor, screen, fireEvent } from "@testing-library/react";
import UsersPage from "./UsersPage";
import { MemoryRouter } from "react-router-dom";
import { GetAllFriendsByStatusDto, GetAllNonFriendsDto } from "../../shared/utils/types/friendshipDtos";
import { Guid } from "guid-typescript";
import { mockElo, mockGameOutcome } from "../../shared/utils/objects/generalMocks";
import { GetOtherUserDto } from "../../shared/utils/types/userDtos";
import { PagedResult } from "../../shared/utils/types/abstractDtosAndModels";
import { GetAllFriendsByStatusModel, GetAllNonFriendsModel } from "../../shared/utils/types/friendshipModels";
import { FriendshipStatus } from "../../shared/utils/objects/entitiesEnums";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import { friendshipController, userController } from "../../shared/utils/services/ApiService";

// models
const getAllUsersModel: GetAllNonFriendsModel = {
  username: "",

  pageNumber: 1,
  pageSize: 10,
};

const getAllFriendsModel: GetAllFriendsByStatusModel = {
  username: "",
  pageNumber: 1,
  pageSize: 10,
  status: FriendshipStatus.accepted,
};

// responses

const responseAllUsers: PagedResult<GetAllNonFriendsDto> = {
  items: [
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
  ],
  totalPages: 1,
  itemsFrom: 1,
  itemsTo: 2,
  totalItemsCount: 2,
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
  ],
  totalPages: 1,
  itemsFrom: 1,
  itemsTo: 2,
  totalItemsCount: 2,
};

const otherUserResponse: GetOtherUserDto = {
  username: "User 1",
  name: null,
  backgroundImage: null,
  profilePicture: null,
  country: "PL",
  joinDate: new Date(),
  bio: null,
  gamesPlayed: 0,
  elo: mockElo,
};

describe("UsersPage Components", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    vi.clearAllMocks();
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  // default render test
  it("should render all users list by default", async () => {
    mock.onGet(friendshipController.getAllNonFriends(getAllUsersModel)).reply(200, responseAllUsers);

    render(
      <MemoryRouter>
        <UsersPage />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByTestId("users-page-all-user-list")).toBeInTheDocument());

    expect(screen.getByText(/User 1/i)).toBeInTheDocument();
  });

  // changing friend list test
  it("should render friends list open user profile modal", async () => {
    mock.onGet(friendshipController.getAllNonFriends(getAllUsersModel)).reply(200, responseAllUsers);
    mock.onGet(friendshipController.getAllFriendsByStatus(getAllFriendsModel)).reply(200, responseFriends);

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
    mock.onGet(friendshipController.getAllNonFriends(getAllUsersModel)).reply(200, responseAllUsers);

    mock.onGet(userController.getOtherUser(responseAllUsers.items[0].userId)).reply(200, otherUserResponse);

    render(
      <MemoryRouter>
        <UsersPage />
      </MemoryRouter>
    );

    const profileButtons = await waitFor(() => screen.getAllByTestId("users-page-user-card-profile-button"));
    expect(profileButtons).toHaveLength(responseAllUsers.items.length);
    fireEvent.click(profileButtons[0]);

    await waitFor(() => expect(screen.getByTestId("users-page-profile-section")).toBeInTheDocument());

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/User 1/i);
  });
});
