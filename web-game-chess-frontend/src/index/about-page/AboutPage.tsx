import { useNavigate, useParams } from "react-router-dom";
import classes from "./AboutPage.module.scss";
import { useEffect, useState, MouseEvent } from "react";
import { mainColor } from "../../shared/utils/objects/colorMaps";
import ContentSection from "./content-sections/ContentSection";
import LoadingPage from "../../shared/components/loading-page/LoadingPage";
import IconCreator from "../../shared/components/icon-creator/IconCreator";
import { symbolIcons } from "../../shared/svgs/iconsMap/SymbolIcons";
import { ContentNames, contentOptions, ContentType } from "./AboutPageData";

function AboutPage() {
  ///

  const navigate = useNavigate();

  // content get from url
  const { contentName } = useParams<{ contentName: ContentNames }>();

  // content to display based on selection
  const [selectedContent, setSelectedContent] = useState<ContentType | null>(null);

  // to set select content base on obtained params
  useEffect(() => {
    if (!contentName) {
      navigate(`/about/introduction`, { replace: true });
      return;
    }

    try {
      setSelectedContent(contentOptions[contentName.toLocaleLowerCase() as Lowercase<ContentNames>]);
    } catch (err) {
      navigate(`/about/introduction`, { replace: true });
    }
  }, [contentName]);

  // to change content
  const onSetSelectedContent = (content: ContentType, event: MouseEvent<HTMLLIElement>): void => {
    setSelectedContent(null);

    const target = event.target as HTMLDivElement;
    target.classList.add(classes.active);

    // refresh about page
    setTimeout(() => {
      if (selectedContent) {
        if (content.title === selectedContent.title) {
          setSelectedContent(content);
        } else {
          navigate(`/about/${content.title.toLowerCase()}`, { replace: true });
        }

        setTimeout(() => {
          target.classList.remove(classes.active);
        }, 300);
      }
    }, 300);
  };

  return (
    <main className={classes["about-main"]}>
      <div className={classes.grid}>
        {/* navigation column */}
        <div className={classes.grid__column}>
          <div className={classes.grid__column__nav}>
            {/* content action */}
            <ul className={classes["content-list"]}>
              {Object.entries(contentOptions).map(([key, content]: [string, ContentType]) => (
                <li
                  key={key}
                  className={classes["content-button"]}
                  onClick={(event) => {
                    onSetSelectedContent(content, event);
                  }}
                >
                  <div className={classes["arrow-icon"]}>
                    <IconCreator
                      icons={symbolIcons}
                      iconName={"roundArrow"}
                      color={mainColor.c0}
                      iconClass={classes["arrow-svg-left"]}
                    />
                  </div>

                  <span>{content.title}</span>
                </li>
              ))}
            </ul>

            {/* return actions */}
            <ul className={classes["content-list"]}>
              <li
                className={classes["content-button"]}
                onClick={() => {
                  navigate("/");
                }}
              >
                <div className={classes["arrow-icon"]}>
                  <IconCreator
                    icons={symbolIcons}
                    iconName={"roundArrow"}
                    color={mainColor.c0}
                    iconClass={classes["arrow-svg-right"]}
                  />
                </div>

                <span>Home Page</span>
              </li>
            </ul>
          </div>
        </div>

        {/* content column */}
        <div className={classes.grid__column}>
          <div className={classes.grid__column__content}>
            {/* generate section */}
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
