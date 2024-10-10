// AboutPage.test.jsx
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import IndexRouter from "../IndexRouter";
import { introductionElements } from "./content-sections/ContentSectionData";
import { act } from "react";

describe("AboutPage Component Component", () => {
  it("renders the Introduction content by default", async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/about/introduction"]}>
          <IndexRouter />
        </MemoryRouter>
      );
    });

    const titleElement = await waitFor(() => screen.getByRole("heading", { level: 1 }));
    expect(titleElement).toHaveTextContent(/Introduction/i);

    introductionElements.forEach((element) => {
      expect(screen.getByText(element.title)).toBeInTheDocument();
    });
  });

  it("should display the correct content when a content button is clicked", async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/about/introduction"]}>
          <IndexRouter />
        </MemoryRouter>
      );
    });

    const headingBefore = await waitFor(() => screen.getByRole("heading", { level: 1 }));
    expect(headingBefore).toBeInTheDocument();
    expect(headingBefore).toHaveTextContent(/Introduction/i);

    const objectivesButton = screen.getByText("Objectives");
    fireEvent.click(objectivesButton);

    const headingAfter = await waitFor(() => screen.getByRole("heading", { level: 1 }));
    expect(headingAfter).toBeInTheDocument();
    expect(headingAfter).toHaveTextContent(/Objectives/i);
  });

  it("should navigate to the home page when the Home Page button is clicked", async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/about/introduction"]}>
          <IndexRouter />
        </MemoryRouter>
      );
    });

    const homePageButton = screen.getByText("Home Page");
    fireEvent.click(homePageButton);

    await waitFor(() => {
      expect(screen.getByTestId("hero-title")).toBeInTheDocument();
    });
  });
});
