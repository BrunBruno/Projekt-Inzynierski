import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import IndexRouter from "../IndexRouter";
import RegisterPage from "./RegisterPage";
import { RegistrationInterface } from "../../shared/utils/objects/interfacesEnums";
import { GetRegisterConfDto, GetUserDto, IsEmailVerifiedDto, LogInUserDto } from "../../shared/utils/types/userDtos";
import { JwtService } from "../../shared/utils/services/MockJwtService";
import { Guid } from "guid-typescript";
import MainRouter from "../../main/MainRouter";
import { mockUserForToken } from "../../shared/utils/objects/generalMocks";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { userController } from "../../shared/utils/services/ApiService";
import { DataConfiguration } from "../../shared/utils/objects/entitiesEnums";
import { GetRegisterConfModel } from "../../shared/utils/types/userModels";

// models

const getPasswordRegisterConfModel: GetRegisterConfModel = {
  configurationId: DataConfiguration.userPassword,
};

const getUserRegisterConfModel: GetRegisterConfModel = {
  configurationId: DataConfiguration.userName,
};

// responses
const jwtService = new JwtService();

const mockToken: LogInUserDto = {
  token: jwtService.getJwtToken(mockUserForToken),
};

const responseIsVerified: IsEmailVerifiedDto = {
  isEmailVerified: true,
};

const responseIsNotVerified: IsEmailVerifiedDto = {
  isEmailVerified: false,
};

const responseUser: GetUserDto = {
  username: "Username",
  name: "User",
  profilePicture: null,
  backgroundImage: null,
  country: "PL",
  userId: Guid.create(),
  email: "user@test.com",
};

const responseConfiguration: GetRegisterConfDto = {
  minLength: null,
  maxLength: null,
  requireUppercase: false,
  requireLowercase: false,
  requireDigit: false,
  requireSpecialChar: false,
};

vi.mock("../shared/utils/services/GameHubService", () => ({
  startConnectionWithToken: vi.fn().mockResolvedValueOnce(undefined),
  AddSelfNotification: vi.fn().mockResolvedValueOnce(undefined),
}));

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
  it("should render without crashing and displays initial content", async () => {
    mock.onGet(userController.getRegisterConf(getPasswordRegisterConfModel)).reply(200, responseConfiguration);
    mock.onGet(userController.getRegisterConf(getUserRegisterConfModel)).reply(200, responseConfiguration);

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    expect(await waitFor(() => screen.getByTestId("sign-in-form-modal"))).toBeInTheDocument();
    expect(await waitFor(() => screen.getByText("Login Now"))).toBeInTheDocument();
  });

  // navigation to home page test
  it("should go to hame page on Home Page button click", async () => {
    mock.onGet(userController.getRegisterConf(getPasswordRegisterConfModel)).reply(200, responseConfiguration);
    mock.onGet(userController.getRegisterConf(getUserRegisterConfModel)).reply(200, responseConfiguration);

    render(
      <MemoryRouter initialEntries={["/registration"]}>
        <IndexRouter />
      </MemoryRouter>
    );

    const homePageButtons = screen.getAllByText("Home Page");
    expect(homePageButtons).toHaveLength(2);

    fireEvent.click(homePageButtons[0]);

    expect(await waitFor(() => screen.getByTestId("main-index-page"))).toBeInTheDocument();
  });

  // sign in test
  it("should sign-in user and render main page", async () => {
    mock.onGet(userController.getRegisterConf(getPasswordRegisterConfModel)).reply(200, responseConfiguration);
    mock.onGet(userController.getRegisterConf(getUserRegisterConfModel)).reply(200, responseConfiguration);

    mock.onPost(userController.logInUser()).reply(200, mockToken);
    mock.onGet(userController.isVerified()).reply(200, responseIsVerified);
    mock.onGet(userController.getUser()).reply(200, responseUser);

    render(
      <MemoryRouter initialEntries={["/registration"]}>
        <Routes>
          <Route path="/*" element={<IndexRouter />} />
          <Route path="/main/*" element={<MainRouter />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("sign-in-form-modal")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText(/Login Now/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText("E-mail / Username"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "Password123" } });

    fireEvent.submit(screen.getByTestId("sign-in-form-modal"));

    await waitFor(() => {
      expect(screen.getByTestId("main-main-page")).toBeInTheDocument();
    });
  });

  // sign up test
  it("should sign-up user and set modal to verify email modal", async () => {
    mock.onGet(userController.getRegisterConf(getPasswordRegisterConfModel)).reply(200, responseConfiguration);
    mock.onGet(userController.getRegisterConf(getUserRegisterConfModel)).reply(200, responseConfiguration);

    mock.onPost(userController.registerUser()).reply(200);
    mock.onPost(userController.logInUser()).reply(200, mockToken);
    mock.onGet(userController.isVerified()).reply(200, responseIsNotVerified);

    render(
      <MemoryRouter
        initialEntries={[{ pathname: "/registration", state: { regOption: RegistrationInterface.signUp } }]}
      >
        <RegisterPage />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByTestId("sign-up-form-modal")).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText(/Create Account/i)).toBeInTheDocument());

    fireEvent.change(screen.getByPlaceholderText("E-mail"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("UserName"), { target: { value: "TestUser" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "Password123" } });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), { target: { value: "Password123" } });

    fireEvent.submit(screen.getByTestId("sign-up-form-modal"));

    const verifyEmailModal = await waitFor(() => screen.getByTestId("verify-email-form-modal"));
    expect(verifyEmailModal).toBeInTheDocument();
  });
});
