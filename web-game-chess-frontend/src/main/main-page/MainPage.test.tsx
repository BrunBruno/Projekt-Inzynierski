import { MemoryRouter } from "react-router-dom";
import MainPage from "./MainPage";
import { render, waitFor, screen, fireEvent } from "@testing-library/react";
import { createMockServer } from "../../shared/utils/services/MockServerService";
import MainRouter from "../MainRouter";
import { GetUserDto, IsEmailVerifiedDto } from "../../shared/utils/types/userDtos";
import { Guid } from "guid-typescript";
import { JwtService } from "../../shared/utils/services/MockJwtService";
import { mockUserForToken } from "../../shared/utils/objects/generalMocks";

const mockIsVerified: IsEmailVerifiedDto = {
  isEmailVerified: true,
};
const mockUser: GetUserDto = {
  username: "User",
  name: null,
  imageUrl: null,
  country: "PL",
  userId: Guid.create(),
  email: "user@test.com",
};

// set up server
const server = createMockServer({
  isEmailVerifiedDto: mockIsVerified,
  getUserDto: mockUser,
});

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

vi.mock("../shared/utils/services/GameHubService", () => ({
  startConnectionWithToken: vi.fn().mockResolvedValueOnce(undefined),
  AddSelfNotification: vi.fn().mockResolvedValueOnce(undefined),
}));
//*/

describe("MainPage Components", () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

  // starting game test
  it("should open vs players view on click and navigate to awaiting page after timing selection", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <MainRouter />
      </MemoryRouter>
    );

    const vsPlayerButton = await waitFor(() => screen.getByTestId("main-page-game-hub-vs-player-button"));
    fireEvent.click(vsPlayerButton);

    await waitFor(() => expect(screen.getByTestId("main-page-vs-player-section")).toBeInTheDocument());

    const timeSelectionButton = screen.getByTestId("main-page-vs-player-time-control-0-0");
    expect(timeSelectionButton).toHaveTextContent(/1 min/i);

    fireEvent.click(timeSelectionButton);

    await waitFor(() => expect(screen.getByTestId("main-awaiting-page")).toBeInTheDocument());
  });
});
