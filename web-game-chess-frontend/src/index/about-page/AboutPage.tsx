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

  const { contentName } = useParams<{ contentName: string }>();
  const navigate = useNavigate();

  type ContentType = {
    title: string;
    elements: ContentElements[];
  };

  // page inteface options
  const contentOptions: { [key: string]: ContentType } = {
    introduction: { title: "Introduction", elements: introductionElements },
    objectives: { title: "Objectives", elements: objectivesElements },
    terms: { title: "Terms", elements: termsElements },
    privacy: { title: "Privacy", elements: privacyElements },
  };

  // content to display based on se;ection
  const [selectedContent, setSelectedContent] = useState<ContentType | null>(null);

  // to set select content base on obtained params
  useEffect(() => {
    if (contentName) {
      try {
        setSelectedContent(contentOptions[contentName]);
      } catch (err) {
        setSelectedContent(contentOptions["Introduction"]);
      }
    }
  }, [contentName]);
  //*/

  // to change content
  const onSetSelectedContent = (content: ContentType, event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    setSelectedContent(null);

    const target = event.target as HTMLDivElement;
    target.classList.add(classes.active);

    // refresh about page
    setTimeout(() => {
      navigate(`/about/${content.title.toLowerCase()}`);

      setTimeout(() => {
        target.classList.remove(classes.active);
      }, 300);
    }, 300);
  };
  //*/

  return (
    <main className={classes["about-main"]}>
      <div className={classes.grid}>
        {/* navigation column */}
        <div className={classes.grid__column}>
          <div className={classes.grid__column__nav}>
            {/* content action */}
            <ul className={classes["content-list"]}>
              {Object.entries(contentOptions).map(([key, content]) => (
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
            {/* --- */}

            {/* return actions */}
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
            {/* --- */}
          </div>
        </div>
        {/* --- */}

        {/* content column */}
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
        {/* --- */}
      </div>
    </main>
  );
}

export default AboutPage;
