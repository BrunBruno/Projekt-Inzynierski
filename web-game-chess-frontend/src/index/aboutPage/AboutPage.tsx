import { useNavigate, useParams } from "react-router-dom";
import classes from "./AboutPage.module.scss";
import { useEffect, useState } from "react";
import RoundArrowSvg from "../../shared/svgs/RoundArrowSvg";
import { mainColor } from "../../shared/utils/enums/colorMaps";
import {
  ContentElements,
  introductionElements,
  objectivesElements,
  privacyElements,
  termsElements,
} from "./content-sections/ContentSections";
import ContentSection from "./content-sections/ContentsSection";
import LoadingPage from "../../shared/components/loading-page/LoadingPage";

function AboutPage() {
  ///

  const { content } = useParams();
  const navigate = useNavigate();

  type ContentType = { title: string; elements: ContentElements[] };

  const pageOptions: { [key: string]: ContentType } = {
    introduction: { title: "Introduction", elements: introductionElements },
    objectives: { title: "Objectives", elements: objectivesElements },
    terms: { title: "Terms", elements: termsElements },
    privacy: { title: "Privacy", elements: privacyElements },
  };

  const [selectedContent, setSelectedContent] = useState<ContentType | null>(null);
  useEffect(() => {
    if (content) setSelectedContent(pageOptions[content]);
  }, [content]);

  // to change content
  const onSetSelectedContent = (content: ContentType, event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    setSelectedContent(null);

    const target = event.target as HTMLDivElement;
    target.classList.add(classes.active);

    setTimeout(() => {
      navigate(`/about/${content.title.toLowerCase()}`);

      setTimeout(() => {
        target.classList.remove(classes.active);
      }, 300);
    }, 300);
  };

  return (
    <main className={classes["about-main"]}>
      <div className={classes.background} />
      <div className={classes.grid}>
        <div className={classes.grid__column}>
          <div className={classes.grid__column__nav}>
            <ul>
              {Object.entries(pageOptions).map(([key, content]) => (
                <li
                  key={key}
                  className={classes["content-button"]}
                  onClick={(event) => {
                    onSetSelectedContent(content, event);
                  }}
                >
                  <div className={classes["arrow-icon"]}>
                    <RoundArrowSvg color={mainColor.c0} secColor={mainColor.c5} iconClass={classes["arror-svg-left"]} />
                  </div>
                  <span>{content.title}</span>
                </li>
              ))}
            </ul>
            <ul>
              <li
                className={classes["content-button"]}
                onClick={() => {
                  navigate("/");
                }}
              >
                <div className={classes["arrow-icon"]}>
                  <RoundArrowSvg color={mainColor.c0} secColor={mainColor.c5} iconClass={classes["arror-svg-right"]} />
                </div>
                <span>Home Page</span>
              </li>
            </ul>
          </div>
        </div>
        <div className={classes.grid__column}>
          <div className={classes.grid__column__content}>
            {selectedContent ? (
              <ContentSection title={selectedContent.title} elements={selectedContent.elements} />
            ) : window.innerWidth > 800 ? (
              <LoadingPage />
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default AboutPage;
