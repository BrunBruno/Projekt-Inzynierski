import classes from "./LoadingPage.module.scss";

type LoadingPageProps = {};

function LoadingPage({}: LoadingPageProps) {
  return (
    <div className={classes.loading}>
      <div className={classes.loading__inner} />
      <div className={classes.loading__outer} />
    </div>
  );
}

export default LoadingPage;
