import { render, screen } from "@testing-library/react";
import ContentSection from "./ContentSection";
import { ContentElements } from "./ContentSectionData";

const elements: ContentElements[] = [
  {
    title: "title",
    texts: ["text 1", "text 2"],
  },
];

describe("ContentSection", () => {
  it("should render title when title is provided", () => {
    const title = "example";

    render(<ContentSection title={title} elements={elements} />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(+title);
  });
});
