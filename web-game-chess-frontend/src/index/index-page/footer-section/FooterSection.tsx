import LogoIconSvg from "../../../shared/svgs/LogoIconSvg";
import RoundArrowSvg from "../../../shared/svgs/RoundArrowSvg";
import { mainColor } from "../../../shared/utils/enums/colorMaps";
import classes from "./FooterSection.module.scss";
import FooterSectionIcons from "./FooterSectionIcons";

type FooterSectionProps = {};

function FooterSection({}: FooterSectionProps) {
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

          <a
            href="https://www.facebook.com/"
            target="blank"
            className={classes.link}
          >
            <div className={classes.element}>
              <FooterSectionIcons iconName="facebook" />
              <p>Facebook</p>
              <RoundArrowSvg
                color={mainColor.c0}
                iconClass={classes["r-arr"]}
              />
            </div>
          </a>
          <a
            href="https://www.instagram.com/"
            target="blank"
            className={classes.link}
          >
            <div className={classes.element}>
              <FooterSectionIcons iconName="instagram" />
              <p>Instagram</p>
              <RoundArrowSvg
                color={mainColor.c0}
                iconClass={classes["r-arr"]}
              />
            </div>
          </a>
          <a
            href="https://twitter.com/"
            target="blank"
            className={classes.link}
          >
            <div className={classes.element}>
              <FooterSectionIcons iconName="twitter" />
              <p>X (Twitter)</p>
              <RoundArrowSvg
                color={mainColor.c0}
                iconClass={classes["r-arr"]}
              />
            </div>
          </a>
          <a
            href="https://www.tiktok.com/"
            target="blank"
            className={classes.link}
          >
            <div className={classes.element}>
              <FooterSectionIcons iconName="tiktok" />
              <p>TikTok</p>
              <RoundArrowSvg
                color={mainColor.c0}
                iconClass={classes["r-arr"]}
              />
            </div>
          </a>
          <a
            href="https://www.youtube.com/"
            target="blank"
            className={classes.link}
          >
            <div className={classes.element}>
              <FooterSectionIcons iconName="youtube" />
              <p>YouTube</p>
              <RoundArrowSvg
                color={mainColor.c0}
                iconClass={classes["r-arr"]}
              />
            </div>
          </a>
        </div>
        <div className={classes.footer__grid__col}>
          <h3>Legal</h3>

          <a href="" target="blank" className={classes.link}>
            <div className={classes.element}>
              <FooterSectionIcons iconName="privacy" />
              <p>Privacy Policy</p>
              <RoundArrowSvg
                color={mainColor.c0}
                iconClass={classes["r-arr"]}
              />
            </div>
          </a>
          <a href="" target="blank" className={classes.link}>
            <div className={classes.element}>
              <FooterSectionIcons iconName="terms" />
              <p>Terms & Conditions</p>
              <RoundArrowSvg
                color={mainColor.c0}
                iconClass={classes["r-arr"]}
              />
            </div>
          </a>
        </div>
      </div>
      <div className={classes.footer__outro}>2024</div>
    </footer>
  );
}

export default FooterSection;
