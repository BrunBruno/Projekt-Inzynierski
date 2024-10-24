import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import IndexRouter from "../IndexRouter";
import { MemoryRouter } from "react-router-dom";
import { act } from "react";

// testing hero routes
describe("HeroSection Component", () => {
  it("should render about page on click", async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/"]}>
          <IndexRouter />
        </MemoryRouter>
      );
    });

    const button = screen.getByTestId("hero-button-about");
    fireEvent.click(button);

    const heading = await waitFor(() => screen.getByRole("heading", { level: 1 }));
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Introduction");
  });

  it("should render register page for signing in on click", async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/"]}>
          <IndexRouter />
        </MemoryRouter>
      );
    });

    const button = screen.getByTestId("hero-button-sign-in");
    fireEvent.click(button);

    const heading = await waitFor(() => screen.getByText("Login Now"));
    expect(heading).toBeInTheDocument();
  });

  it("should  render register page for signing up on click", async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/"]}>
          <IndexRouter />
        </MemoryRouter>
      );
    });

    const button = screen.getByTestId("hero-button-sign-up");
    fireEvent.click(button);

    const heading = await waitFor(() => screen.getByText("Create Account"));
    expect(heading).toBeInTheDocument();
  });
});

// testing home routes
describe("HomeSection Component", () => {
  it("should render register page for signing in on click", async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/"]}>
          <IndexRouter />
        </MemoryRouter>
      );
    });

    const button = screen.getByTestId("home-pawn-button-sign-in");
    fireEvent.click(button);

    const heading = await waitFor(() => screen.getByText("Login Now"));
    expect(heading).toBeInTheDocument();
  });

  it("should  render register page for signing up on click", async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/"]}>
          <IndexRouter />
        </MemoryRouter>
      );
    });

    const button = screen.getByTestId("home-pawn-button-sign-up");
    fireEvent.click(button);

    const heading = await waitFor(() => screen.getByText("Create Account"));
    expect(heading).toBeInTheDocument();
  });
});
