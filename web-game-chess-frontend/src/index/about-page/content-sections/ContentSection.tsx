import { Fragment } from "react";
import classes from "./ContentSection.module.scss";
import { ContentElements } from "./ContentSectionData";
import IconCreator from "../../../shared/components/icon-creator/IconCreator";
import { aboutPageIcons } from "../AboutPageIcons";
import { symbolIcons } from "../../../shared/svgs/iconsMap/SymbolIcons";
import { mainColor } from "../../../shared/utils/objects/colorMaps";

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
      <div className={classes.content__elements}>
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
                    <IconCreator
                      icons={symbolIcons}
                      iconName={"roundArrow"}
                      iconClass={classes["bullet-point"]}
                      color={mainColor.c5}
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            )}

            <IconCreator icons={aboutPageIcons} iconName={"pawnLine"} iconClass={classes["pawn-line"]} />
          </Fragment>
        ))}
      </div>
      {/* --- */}
    </section>
  );
}

export default ContentSection;
