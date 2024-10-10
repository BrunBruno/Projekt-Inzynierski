import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import IndexRouter from "../IndexRouter";
import RegisterPage from "./RegisterPage";
import { RegistrationInterface } from "../../shared/utils/objects/interfacesEnums";
import classes from "./RegisterPage.module.scss";
import { act } from "react";

describe("RegisterPage Component", () => {
  it("should render without crashing and displays initial content", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <RegisterPage />
        </MemoryRouter>
      );
    });

    expect(await waitFor(() => screen.getByText("Login Now"))).toBeInTheDocument();
  });

  it("should display the sign-in modal when the state indicates signIn", async () => {
    await act(async () => {
      render(
        <MemoryRouter
          initialEntries={[{ pathname: "/registration", state: { regOption: RegistrationInterface.signUp } }]}
        >
          <RegisterPage />
        </MemoryRouter>
      );
    });

    expect(await waitFor(() => screen.getByText("Create Account"))).toBeInTheDocument();
  });

  it("should go to hame page on Home Page button click", async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/registration"]}>
          <IndexRouter />
        </MemoryRouter>
      );
    });

    const buttons = screen.getAllByText("Home Page");
    expect(buttons).toHaveLength(2);

    fireEvent.click(buttons[0]);

    await waitFor(() => {
      expect(screen.getByTestId("hero-title")).toBeInTheDocument();
    });
  });

  it("handles window resize and updates class correctly", async () => {
    global.innerWidth = 1200;

    await act(async () => {
      render(
        <MemoryRouter initialEntries={[{ pathname: "/registration" }]}>
          <RegisterPage />
        </MemoryRouter>
      );
    });

    global.innerWidth = 400;
    fireEvent.resize(window);

    const formContainer = screen.getByTestId("register-form-container");

    await waitFor(() => {
      expect(formContainer).toHaveClass(classes["static-form"]);
    });
  });
});
