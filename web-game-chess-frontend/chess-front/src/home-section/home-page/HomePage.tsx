import classes from './HomePage.module.scss';
import HeaderSection from './header-section/HeaderSection';
import HeroSection from './hero-section/HeroSection';

function HomePage() {
  return (
    <main className={classes['home-main']}>
      <HeaderSection />
      <HeroSection />
    </main>
  );
}

export default HomePage;
