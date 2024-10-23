import IconCreator from "../icon-creator/IconCreator";
import classes from "./NotFoundPage.module.scss";
import { notFoundPageIcons } from "./NotFoundPageIcons";

type NotFoundPageProps = {
  // path to go back
  path: string;
};

function NotFoundPage({ path }: NotFoundPageProps) {
  ///

  return (
    <main className={classes["not-found"]}>
      <h1 className={classes["not-found-header"]}>
        <span>Sorry, page not found.</span>
        <a href={path}>Home Page</a>
      </h1>

      <IconCreator icons={notFoundPageIcons} iconName={"bgPawn"} iconClass={classes["bg-pawn-svg"]} />
    </main>
  );
}

export default NotFoundPage;
