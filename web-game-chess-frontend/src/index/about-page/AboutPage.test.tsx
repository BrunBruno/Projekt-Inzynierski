import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import AboutPage from "./AboutPage";
import { introductionElements, objectivesElements } from "./content-sections/ContentSectionData";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
  useParams: () => ({ contentName: "introduction" }),
}));

describe("AboutPage Component", () => {
  test("renders the AboutPage with initial content based on URL param", () => {
    render(
      <MemoryRouter initialEntries={["/about/introduction"]}>
        <Routes>
          <Route path="/about/:contentName" element={<AboutPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Introduction")).toBeInTheDocument();
    introductionElements.forEach((element) => {
      expect(screen.getByText(element.title)).toBeInTheDocument();
    });
  });

  test("navigates to the correct content when an option is clicked", () => {
    const navigateMock = jest.fn();
    jest.mock("react-router-dom", () => ({
      ...jest.requireActual("react-router-dom"),
      useNavigate: () => navigateMock,
      useParams: () => ({ contentName: "introduction" }),
    }));

    render(
      <MemoryRouter initialEntries={["/about/introduction"]}>
        <Routes>
          <Route path="/about/:contentName" element={<AboutPage />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Objectives"));

    expect(navigateMock).toHaveBeenCalledWith("/about/objectives");

    expect(screen.getByText("Objectives")).toBeInTheDocument();
    objectivesElements.forEach((element) => {
      expect(screen.getByText(element.title)).toBeInTheDocument();
    });
  });

  test("renders the LoadingPage component when no content is selected and width > 800", () => {
    global.innerWidth = 1000;
    global.dispatchEvent(new Event("resize"));

    render(
      <MemoryRouter initialEntries={["/about/"]}>
        <Routes>
          <Route path="/about/:contentName" element={<AboutPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("handles invalid contentName gracefully", () => {
    jest.mock("react-router-dom", () => ({
      ...jest.requireActual("react-router-dom"),
      useParams: () => ({ contentName: "nonexistent" }),
    }));

    render(
      <MemoryRouter initialEntries={["/about/nonexistent"]}>
        <Routes>
          <Route path="/about/:contentName" element={<AboutPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Introduction")).toBeInTheDocument();
  });

  test("navigates back to the home page when Home Page button is clicked", () => {
    const navigateMock = jest.fn();
    jest.mock("react-router-dom", () => ({
      ...jest.requireActual("react-router-dom"),
      useNavigate: () => navigateMock,
      useParams: () => ({ contentName: "introduction" }),
    }));

    render(
      <MemoryRouter initialEntries={["/about/introduction"]}>
        <Routes>
          <Route path="/about/:contentName" element={<AboutPage />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Home Page"));

    expect(navigateMock).toHaveBeenCalledWith("/");
  });
});
