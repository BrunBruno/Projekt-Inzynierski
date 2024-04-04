import classes from './HomePage.module.scss';
import HeroSection from './hero-section/HeroSection';

const HomePage = () => {
  return (
    <main className={classes['home-main']}>
      <HeroSection />
    </main>
  );
};

export default HomePage;
