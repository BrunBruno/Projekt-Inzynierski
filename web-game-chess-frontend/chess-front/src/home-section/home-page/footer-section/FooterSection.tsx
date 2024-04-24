import LogoIconSvg from '../../../shared/svgs/LogoIconSvg';
import classes from './FooterSection.module.scss';
function FooterSection() {
  return (
    <footer className={classes.footer}>
      <div className={classes.footer__intro}>
        <h2 className={classes['footer-title']}>
          <LogoIconSvg iconClass={classes['footer-logo']} />
          <span>BRN CHESS</span>
        </h2>
      </div>
      <div className={classes.footer__grid}>
        <div className={classes.footer__grid__col}>
          <h3>Reach Us</h3>
          <p>+48 000 000 000</p>
          <p>chess8rn@gmail.com</p>
        </div>
        <div className={classes.footer__grid__col}>
          <h3>Socials</h3>
          <p>Facebook</p>
          <p>Instagram</p>
          <p>Twitter</p>
          <p>TikTok</p>
          <p>YouTube</p>
        </div>
        <div className={classes.footer__grid__col}>
          <h3>Legal</h3>
          <p>Privacy Policy</p>
          <p>Terms & Conditions</p>
        </div>
      </div>
      <div className={classes.footer__outro}>2024</div>
    </footer>
  );
}

export default FooterSection;
