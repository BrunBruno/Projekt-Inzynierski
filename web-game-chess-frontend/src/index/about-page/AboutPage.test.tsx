// AboutPage.test.jsx
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import IndexRouter from "../IndexRouter";
import { introductionElements } from "./content-sections/ContentSectionData";

describe("AboutPage Component Component", () => {
  // default page render test
  it("renders the Introduction content by default", async () => {
    render(
      <MemoryRouter initialEntries={["/about/introduction"]}>
        <IndexRouter />
      </MemoryRouter>
    );

    const titleElement = await waitFor(() => screen.getByRole("heading", { level: 1 }));
    expect(titleElement).toHaveTextContent(/Introduction/i);

    introductionElements.forEach((element) => {
      expect(screen.getByText(element.title)).toBeInTheDocument();
    });
  });

  // choosing content test
  it("should display the correct content when a content button is clicked", async () => {
    render(
      <MemoryRouter initialEntries={["/about/introduction"]}>
        <IndexRouter />
      </MemoryRouter>
    );

    const headingBefore = await waitFor(() => screen.getByRole("heading", { level: 1 }));
    expect(headingBefore).toBeInTheDocument();
    expect(headingBefore).toHaveTextContent(/Introduction/i);

    const objectivesButton = screen.getByText("Objectives");
    fireEvent.click(objectivesButton);

    const headingAfter = await waitFor(() => screen.getByRole("heading", { level: 1 }));
    expect(headingAfter).toBeInTheDocument();
    expect(headingAfter).toHaveTextContent(/Objectives/i);
  });

  // navigate to home page test
  it("should navigate to the home page when the Home Page button is clicked", async () => {
    render(
      <MemoryRouter initialEntries={["/about/introduction"]}>
        <IndexRouter />
      </MemoryRouter>
    );

    const homePageButton = screen.getByText("Home Page");
    fireEvent.click(homePageButton);

    expect(await waitFor(() => screen.getByTestId("main-index-page"))).toBeInTheDocument();
  });
});
