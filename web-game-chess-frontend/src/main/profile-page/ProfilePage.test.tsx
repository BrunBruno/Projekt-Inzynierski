import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProfilePage from "./ProfilePage";
import { PagedResult } from "../../shared/utils/types/abstractDtosAndModels";
import { GetFriendProfileDto, GetGamesOfFriendshipDto } from "../../shared/utils/types/friendshipDtos";
import { Guid } from "guid-typescript";
import { friendshipController } from "../../shared/utils/services/ApiService";
import { mockElo, mockGameOutcome } from "../../shared/utils/objects/generalMocks";
import { GetGamesOfFriendshipModel } from "../../shared/utils/types/friendshipModels";

const friendId = Guid.create();
const friendIdStr = friendId.toString();

// models

const getGamesModel: GetGamesOfFriendshipModel = {
  friendshipId: friendId,
  pageNumber: 1,
  pageSize: 100,
};

// responses

const responseProfile: GetFriendProfileDto = {
  username: "FriendUsername",
  name: null,
  backgroundImage: null,
  profilePicture: null,
  country: "",
  bio: null,
  joinDate: new Date(),
  friendsSince: new Date(),
  elo: mockElo,
  outcomeTotal: mockGameOutcome,
  outcomeTogether: mockGameOutcome,
};

const responseGames: PagedResult<GetGamesOfFriendshipDto> = {
  items: [],
  totalPages: 0,
  itemsFrom: 0,
  itemsTo: 0,
  totalItemsCount: 0,
};

describe("ProfilePage Component", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  // default page render tests
  it("should renders friends profile without crashing", async () => {
    mock.onGet(friendshipController.getFriendProfile(friendId)).reply(200, responseProfile);
    mock.onGet(friendshipController.getGamesOfFriendship(getGamesModel)).reply(200, responseGames);

    render(
      <MemoryRouter initialEntries={[{ pathname: `/profile/${friendIdStr}` }]}>
        <Routes>
          <Route path="/profile/:friendshipIdStr" element={<ProfilePage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("main-profile-page")).toBeInTheDocument();
    });

    const titleElement = await waitFor(() => screen.getByTestId("profile-page-friend-section"));
    expect(titleElement).toHaveTextContent(/FriendUsername/i);
  });
});
