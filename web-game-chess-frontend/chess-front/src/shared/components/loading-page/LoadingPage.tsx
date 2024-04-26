import classes from './LoadingPage.module.scss';

function LoadingPage() {
  return (
    <div className={classes.loading}>
      <div className={classes.loading__inner} />
      <div className={classes.loading__outer} />
    </div>
  );
}

export default LoadingPage;
