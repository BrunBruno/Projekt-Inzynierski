import classes from './HeroSection.module.scss';

const HeroSection = () => {
  return (
    <section id="home" className={classes.hero}>
      <div className={classes.hero__content}>
        <div className={classes.hero__content__intro}>
          <h1>CHESS</h1>
          <span>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Distinctio
            ipsa quis doloribus. Assumenda eum quisquam, ab optio nemo voluptas
            aperiam incidunt rem, harum eos reprehenderit, eaque fugit! Illum,
            exercitationem minima.
          </span>
        </div>
        <div className={classes.hero__content__extra}></div>
      </div>
    </section>
  );
};

export default HeroSection;
