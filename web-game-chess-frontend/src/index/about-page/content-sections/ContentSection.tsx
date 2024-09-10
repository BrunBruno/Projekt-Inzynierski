import { Fragment } from "react";
import classes from "./ContentSection.module.scss";
import { ContentElements } from "./ContentSectionData";
import IconCreator from "../../../shared/components/icon-creator/IconCreator";
import { aboutPageIcons } from "../AboutPageIcons";

type ContentSectionProps = {
  // title of section
  title: string;
  // elements
  elements: ContentElements[];
};

function ContentSection({ title, elements }: ContentSectionProps) {
  ///

  return (
    <section className={classes.content}>
      <h1 className={classes["section-title"]}>{title}</h1>

      {/* map elements */}
      {elements.map((element, index) => (
        <Fragment key={`fragment-${index}`}>
          {/* paragraph */}
          <h2 key={`title-${element.title}-${index}`} className={classes["paragraph-title"]}>
            <span>{index + 1}.</span> <span>{element.title}</span>
          </h2>

          {/* texts blocks */}
          {element.texts &&
            element.texts.map((text, i) => (
              <p key={`text-${index}-${i}`} className={classes["text"]}>
                {text}
              </p>
            ))}

          {/* bullet points */}
          {element.points && (
            <ul key={`list-${index}`} className={classes["bullet-points"]}>
              {element.points.map((point, i) => (
                <li key={`point-${index}-${i}`} className={classes["point"]}>
                  {point}
                </li>
              ))}
            </ul>
          )}

          <IconCreator icons={aboutPageIcons} iconName="pawnLine" iconClass={classes["pawn-line"]} />
        </Fragment>
      ))}
      {/* --- */}
    </section>
  );
}

export default ContentSection;
