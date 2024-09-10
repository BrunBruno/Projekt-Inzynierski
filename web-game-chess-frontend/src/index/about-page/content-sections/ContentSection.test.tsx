import { render, screen } from "@testing-library/react";
import { ContentElements } from "./ContentSectionData";
import ContentSection from "./ContentSection";

describe("ContentSection Component", () => {
  const mockElements: ContentElements[] = [
    {
      title: "First Section",
      texts: ["First text", "Second text"],
      points: ["First point", "Second point"],
    },
    {
      title: "Second Section",
      texts: ["Another text"],
      points: ["Another point"],
    },
  ];

  test("renders the section title", () => {
    render(<ContentSection title="Example title" elements={[]} />);
    expect(screen.getByText("Example title")).toBeInTheDocument();
  });

  test("renders the elements with text and points", () => {
    render(<ContentSection title="Example title" elements={mockElements} />);

    expect(screen.getByRole("heading", { name: /1\. First Section/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /2\. Second Section/i })).toBeInTheDocument();

    expect(screen.getByText("First text")).toBeInTheDocument();
    expect(screen.getByText("Second text")).toBeInTheDocument();
    expect(screen.getByText("Another text")).toBeInTheDocument();

    expect(screen.getByText("First point")).toBeInTheDocument();
    expect(screen.getByText("Second point")).toBeInTheDocument();
    expect(screen.getByText("Another point")).toBeInTheDocument();
  });

  test("handles empty elements array", () => {
    render(<ContentSection title="Empty Elements Test" elements={[]} />);

    expect(screen.queryByText("1.")).toBeNull();
  });
});
