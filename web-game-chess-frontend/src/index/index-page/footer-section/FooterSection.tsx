import LogoIconSvg from "../../../shared/svgs/LogoIconSvg";
import RoundArrowSvg from "../../../shared/svgs/RoundArrowSvg";
import { mainColor } from "../../../shared/utils/enums/colorMaps";
import classes from "./FooterSection.module.scss";
import FooterSectionIcons from "./FooterSectionIcons";

const socials = ["Facebook", "Instagram", "Twitter", "TikTok", "YouTube"] as const;

type FooterSectionProps = {};

function FooterSection({}: FooterSectionProps) {
  ///

  return (
    <footer className={classes.footer}>
      <div className={classes.footer__intro}>
        <h2 className={classes["footer-title"]}>
          <LogoIconSvg iconClass={classes["footer-logo"]} />
          <span>BRN CHESS</span>
        </h2>
      </div>

      <div className={classes.footer__grid}>
        <div className={classes.footer__grid__col}>
          <h3>Reach Us</h3>
          <div className={classes.contact}>
            <p>+48 000 000 000</p>
            <FooterSectionIcons iconName="flag" />
          </div>
          <div className={classes.contact}>
            <p>chess8rn@gmail.com</p>
          </div>
        </div>

        <div className={classes.footer__grid__col}>
          <h3>Socials</h3>

          {socials.map((social) => (
            <a href={`https://www.${social.toLocaleLowerCase()}.com/`} target="blank" className={classes.link}>
              <div className={classes.element}>
                <FooterSectionIcons iconName={social.toLocaleLowerCase()} />
                <p>{social}</p>
                <RoundArrowSvg color={mainColor.c0} iconClass={classes["r-arr"]} />
              </div>
            </a>
          ))}
        </div>

        <div className={classes.footer__grid__col}>
          <h3>Legal</h3>

          <a href="" target="blank" className={classes.link}>
            <div className={classes.element}>
              <FooterSectionIcons iconName="privacy" />
              <p>Privacy Policy</p>
              <RoundArrowSvg color={mainColor.c0} iconClass={classes["r-arr"]} />
            </div>
          </a>

          <a href="" target="blank" className={classes.link}>
            <div className={classes.element}>
              <FooterSectionIcons iconName="terms" />
              <p>Terms & Conditions</p>
              <RoundArrowSvg color={mainColor.c0} iconClass={classes["r-arr"]} />
            </div>
          </a>
        </div>
      </div>

      <div className={classes.footer__outro}>2024</div>
    </footer>
  );
}

export default FooterSection;
