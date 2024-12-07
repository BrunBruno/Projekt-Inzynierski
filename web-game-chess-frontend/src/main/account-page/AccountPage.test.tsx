// import { fireEvent, render, screen, waitFor } from "@testing-library/react";
// import AccountPage from "./AccountPage";
// import { MemoryRouter } from "react-router-dom";
// import { GetAllFriendsByStatusDto } from "../../shared/utils/types/friendshipDtos";
// import { Guid } from "guid-typescript";
// import { GetFullUserDto } from "../../shared/utils/types/userDtos";
// import { GetTypeHistoryDto } from "../../shared/utils/types/webGameDtos";
// import { createMockServer } from "../../shared/utils/services/MockServerService";
// import { mockElo, mockGameOutcome } from "../../shared/utils/objects/generalMocks";
// import { AppearanceOfBoard, AppearanceOfGamePage, AppearanceOfPieces } from "../../shared/utils/objects/entitiesEnums";

// /** mocks */

// const mockFriends: GetAllFriendsByStatusDto[] = [
//   {
//     username: "User 1",
//     name: "User 1",
//     profilePicture: null,
//     backgroundImage: null,
//     country: "PL",
//     friendshipId: Guid.create(),
//     elo: mockElo,
//     isRequestor: false,
//     outcomeTotal: mockGameOutcome,
//     outcomeTogether: mockGameOutcome,
//   },
//   {
//     username: "User 2",
//     name: "User 2",
//     profilePicture: null,
//     backgroundImage: null,
//     country: "PL",
//     friendshipId: Guid.create(),
//     elo: mockElo,
//     isRequestor: true,
//     outcomeTotal: mockGameOutcome,
//     outcomeTogether: mockGameOutcome,
//   },
// ];

// const mockFullUser: GetFullUserDto = {
//   isPrivate: false,
//   username: "User",
//   name: "User",
//   profilePicture: null,
//   backgroundImage: null,
//   country: "PL",
//   email: "user@test.com",
//   joinDate: new Date(),
//   bio: null,
//   onlineOutcomeTotal: mockGameOutcome,
//   offlineOutcomeTotal: mockGameOutcome,
//   timingTypeGamesPlayed: { bullet: 10, blitz: 10, rapid: 10, classic: 10, daily: 10 },
//   winsByCheckMate: 2,
//   winsByTimeout: 5,
//   winsByResignation: 1,
//   losesByCheckMate: 8,
//   losesByTimeout: 5,
//   losesByResignation: 3,
//   settings: {
//     appearanceOfPieces: AppearanceOfPieces.Standard,
//     appearanceOfBoard: AppearanceOfBoard.Default,
//     appearanceOfGamePage: AppearanceOfGamePage.Simple,
//   },
// };

// const mockTypeHistory: GetTypeHistoryDto[] = [
//   {
//     whitePlayer: "White User",
//     blackPlayer: "Black User",
//     moves: 50,
//     isWinner: true,
//     prevElo: 900,
//     createdAt: new Date(),
//   },
//   {
//     whitePlayer: "White User",
//     blackPlayer: "Black User",
//     moves: 40,
//     isWinner: false,
//     prevElo: 1100,
//     createdAt: new Date(),
//   },
// ];

// // set up server
// const server = createMockServer({
//   getFullUserDto: mockFullUser,
//   getEloDto: mockElo,
//   getTypeHistoryDtoList: mockTypeHistory,
//   getAllFriendsByStatusDtoList: mockFriends,
// });

// beforeAll(() => server.listen());
// afterEach(() => server.resetHandlers());
// afterAll(() => server.close());

// describe("UserSection Component", () => {
//   it("should renders FriendsSection by default without crashing", async () => {
//     render(
//       <MemoryRouter>
//         <AccountPage />
//       </MemoryRouter>
//     );

//     expect(await waitFor(() => screen.getByTestId("account-page-friends-section"))).toBeInTheDocument();
//   });

//   it("should renders correct content on content selection", async () => {
//     render(
//       <MemoryRouter>
//         <AccountPage />
//       </MemoryRouter>
//     );

//     const setHistoryButton = await waitFor(() => screen.getByTestId("set-history-blitz-button"));
//     fireEvent.click(setHistoryButton);

//     const historySection = await waitFor(() => screen.getByTestId("account-page-history-section"));
//     expect(historySection).toBeInTheDocument();

//     const historyHeading = await waitFor(() => screen.getByRole("heading", { level: 2 }));
//     expect(historyHeading).toHaveTextContent(/blitz/i);

//     const setFriendsButton = screen.getByTestId("set-friends-button");
//     fireEvent.click(setFriendsButton);

//     const friendSection = await waitFor(() => screen.getByTestId("account-page-friends-section"));
//     expect(friendSection).toBeInTheDocument();
//   });
// });
