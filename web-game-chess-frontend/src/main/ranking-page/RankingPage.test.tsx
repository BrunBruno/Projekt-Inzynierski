import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { MemoryRouter } from "react-router-dom";
import RankingPage from "./RankingPage";
import { PagedResult } from "../../shared/utils/types/abstractDtosAndModels";
import { GetUserRankingDto } from "../../shared/utils/types/userDtos";
import { userController } from "../../shared/utils/services/ApiService";
import { GetUsersRankingModel } from "../../shared/utils/types/userModels";
import { TimingType } from "../../shared/utils/objects/entitiesEnums";

// models

const getUserRankingModel: GetUsersRankingModel = {
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
});
