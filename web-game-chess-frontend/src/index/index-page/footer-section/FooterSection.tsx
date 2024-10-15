import { useNavigate } from "react-router-dom";
import LogoIcon from "../../../shared/svgs/icons/LogoIcon";
import { mainColor } from "../../../shared/utils/objects/colorMaps";
import classes from "./FooterSection.module.scss";
import IconCreator from "../../../shared/components/icon-creator/IconCreator";
import { footerSectionIcons } from "./FooterSectionIcons";
import { symbolIcons } from "../../../shared/svgs/iconsMap/SymbolIcons";

const socials = ["Facebook", "Instagram", "Twitter", "TikTok", "YouTube"] as const;
type SocialNames = Lowercase<typeof socials[number]>;

type FooterSectionProps = {};

function FooterSection({}: FooterSectionProps) {
  ///

  const navigate = useNavigate();

  return (
    <footer className={classes.footer}>
      {/* footer intro */}
      <div className={classes.footer__intro}>
        <h2 className={classes["footer-title"]}>
          <LogoIcon iconClass={classes["footer-logo"]} />
          <span>BRN CHESS</span>
        </h2>
      </div>
      {/* --- */}

      {/* footer content */}
      <div className={classes.footer__grid}>
        <div className={classes.footer__grid__col}>
          <h3 className={classes["col-title"]}>Reach Us</h3>

          <div className={classes.contact}>
            <IconCreator icons={footerSectionIcons} iconName={"countryFlag"} />
            <p className={classes["contact-data"]}>+48 000 000 000</p>
          </div>

          <div className={classes.contact}>
            <IconCreator icons={footerSectionIcons} iconName={"atSymbol"} />
            <p className={classes["contact-data"]}>chess8rn@gmail.com</p>
          </div>
        </div>

        <div className={classes.footer__grid__col}>
          <h3 className={classes["col-title"]}>Socials</h3>

          {socials.map((social) => (
            <a
              key={social}
              href={`https://www.${social.toLocaleLowerCase()}.com/`}
              target="blank"
              className={classes.link}
            >
              <div className={classes.element}>
                <IconCreator
                  icons={footerSectionIcons}
                  iconName={social.toLocaleLowerCase() as SocialNames}
                  iconClass={classes["social-svg"]}
                />

                <p className={classes["action-text"]}>{social}</p>

                <IconCreator
                  icons={symbolIcons}
                  iconName={"roundArrow"}
                  color={mainColor.c2}
                  iconClass={classes["r-arr"]}
                />
              </div>
            </a>
          ))}
        </div>

        <div className={classes.footer__grid__col}>
          <h3 className={classes["col-title"]}>Legal</h3>

          <a href="" className={classes.link}>
            <div
              className={classes.element}
              onClick={() => {
                navigate("/about/privacy");
              }}
            >
              <IconCreator icons={footerSectionIcons} iconName={"privacy"} iconClass={classes["social-svg"]} />

              <p className={classes["action-text"]}>Privacy Policy</p>

              <IconCreator
                icons={symbolIcons}
                iconName={"roundArrow"}
                color={mainColor.c0}
                iconClass={classes["r-arr"]}
              />
            </div>
          </a>

          <a href="" className={classes.link}>
            <div
              className={classes.element}
              onClick={() => {
                navigate("/about/terms");
              }}
            >
              <IconCreator icons={footerSectionIcons} iconName={"terms"} iconClass={classes["social-svg"]} />

              <p className={classes["action-text"]}>Terms & Conditions</p>

              <IconCreator
                icons={symbolIcons}
                iconName={"roundArrow"}
                color={mainColor.c0}
                iconClass={classes["r-arr"]}
              />
            </div>
          </a>
        </div>
      </div>
      {/* --- */}

      <div className={classes.footer__outro}>2024</div>
    </footer>
  );
}

export default FooterSection;
