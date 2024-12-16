import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { MemoryRouter } from "react-router-dom";
import RankingPage from "./RankingPage";
import { PagedResult } from "../../shared/utils/types/abstractDtosAndModels";
import { GetUserRankingDto } from "../../shared/utils/types/userDtos";
import { friendshipController, userController } from "../../shared/utils/services/ApiService";
import { GetUsersRankingModel } from "../../shared/utils/types/userModels";
import { TimingType } from "../../shared/utils/objects/entitiesEnums";
import { GetFriendshipRankingDto } from "../../shared/utils/types/friendshipDtos";
import { GetFriendshipRankingModel } from "../../shared/utils/types/friendshipModels";

// models

const getUserRankingModel: GetUsersRankingModel = {
  pageNumber: 1,
  pageSize: 10,
  type: TimingType.bullet,
};

const getFriendshipRankingModel: GetFriendshipRankingModel = {
  pageNumber: 1,
  pageSize: 10,
  type: TimingType.bullet,
};

// responses

const responseUserRanking: PagedResult<GetUserRankingDto> = {
  items: Array.from({ length: 10 }).map((_, i) => {
    const item: GetUserRankingDto = {
      position: i + 1,
      username: `user-${i}`,
      elo: 1000 - i,
      gamesPlayed: 300,
      typeGamesPlayed: 50,
      gamesRatio: "",
      isUser: false,
      profile: null,
    };

    return item;
  }),
  totalPages: 1,
  itemsFrom: 1,
  itemsTo: 10,
  totalItemsCount: 10,
};

const responseFriendRanking: PagedResult<GetFriendshipRankingDto> = {
  items: Array.from({ length: 10 }).map((_, i) => {
    const item: GetFriendshipRankingDto = {
      position: i + 1,
      username: `friend-${i}`,
      elo: 1000 - i,
      gamesPlayed: 300,
      typeGamesPlayed: 50,
      gamesRatio: "",
      isUser: false,
      profile: null,
    };

    return item;
  }),
  totalPages: 1,
  itemsFrom: 1,
  itemsTo: 10,
  totalItemsCount: 10,
};

describe("RegisterPage Components", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    vi.clearAllMocks();
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  // default render test
  it("should render without crashing and displays ranking table", async () => {
    mock.onGet(userController.getUsersRanking(getUserRankingModel)).reply(200, responseUserRanking);

    render(
      <MemoryRouter>
        <RankingPage />
      </MemoryRouter>
    );

    expect(await waitFor(() => screen.getByTestId("main-ranking-page"))).toBeInTheDocument();

    const records = await waitFor(() => screen.getAllByTestId("ranking-page-record"));
    expect(records).toHaveLength(10);

    // check last record 1000 - 9
    expect(records[9]).toHaveTextContent(/991/i);
  });

  // switching tables test
  it("should render correct table based on user selection", async () => {
    mock.onGet(userController.getUsersRanking(getUserRankingModel)).reply(200, responseUserRanking);
    mock.onGet(friendshipController.getFriendshipRanking(getFriendshipRankingModel)).reply(200, responseFriendRanking);

    render(
      <MemoryRouter>
        <RankingPage />
      </MemoryRouter>
    );

    const userRecords = await waitFor(() => screen.getAllByTestId("ranking-page-record"));
    expect(userRecords).toHaveLength(10);
    expect(userRecords[1]).toHaveTextContent(/user-1/i);

    const setFriendsRankingButton = screen.getByTestId("ranking-page-friends-table-button");
    fireEvent.click(setFriendsRankingButton);

    const friendRecords = await waitFor(() => {
      const records = screen.getAllByTestId("ranking-page-record");
      if (records[0].textContent?.includes("friend")) {
        return records;
      }

      throw new Error("Friends table not loaded yet.");
    });

    expect(friendRecords).toHaveLength(10);
    expect(friendRecords[1]).toHaveTextContent(/friend-1/i);
  });
});
