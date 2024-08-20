import { Fragment } from "react";
import AboutPageIcons from "../AboutPageIcons";
import classes from "./Content.module.scss";
import { ContentElements } from "./ContentSections";

type ContentSectionProps = {
  // title of section
  title: string;
  // elements
  elements: ContentElements[];
};

function ContentSection({ title, elements }: ContentSectionProps) {
  ///

  return (
    <div className={classes.content}>
      <h1>{title}</h1>
      {elements.map((element, index) => (
        <Fragment key={`fragment-${index}`}>
          <h2 key={`title-${element.title}-${index}`}>
            <span>{index + 1}.</span> <span>{element.title}</span>
          </h2>

          {element.texts && element.texts.map((text, i) => <p key={`text-${index}-${i}`}>{text}</p>)}

          {element.points && (
            <ul key={`list-${index}`}>
              {element.points.map((point, i) => (
                <li key={`point-${index}-${i}`}>{point}</li>
              ))}
            </ul>
          )}

          <AboutPageIcons key={`icon-${index}`} iconName="pawnLine" />
        </Fragment>
      ))}
    </div>
  );
}

export default ContentSection;
