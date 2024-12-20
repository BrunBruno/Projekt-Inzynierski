import { useEffect, useRef, useState } from "react";
import classes from "./LoadingPage.module.scss";

type LoadingPageProps = {
  // optional text to display
  text?: string;
};

function LoadingPage({ text = "" }: LoadingPageProps): JSX.Element {
  ///

  // loading container ref - to set content sizes
  const loadingRef = useRef<HTMLDivElement>(null);

  // size of spinning circles
  const [size, setSize] = useState<number>(0);

  // set size of loading circles
  useEffect(() => {
    if (loadingRef.current) {
      const { offsetWidth } = loadingRef.current;
      const borderWidth = offsetWidth / 10 / 5;

      setSize(borderWidth);
    }
  }, []);

  return (
    <div ref={loadingRef} className={classes.loading}>
      <div className={classes.loading__container}>
        <div className={classes.loading__container__inner} style={{ borderWidth: size + "px" }}>
          <div className={classes.loading__container__inner__outer} style={{ borderWidth: size + "px" }} />
        </div>

        <div className={classes.loading__container__text}>{text}</div>
      </div>
    </div>
  );
}

export default LoadingPage;
