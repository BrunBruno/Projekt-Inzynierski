import { useNavigate } from "react-router-dom";
import ActionButton from "../../../shared/components/action-button/ActionButton";
import IconCreator from "../../../shared/components/icon-creator/IconCreator";
import { symbolIcons } from "../../../shared/svgs/iconsMap/SymbolIcons";
import { mainColor } from "../../../shared/utils/objects/colorMaps";
import { GetFullUserDto } from "../../../shared/utils/types/userDtos";
import AccountSettings from "./account-settings/AccountSettings";
import GameplaySettings from "./gameplay-settings/GameplaySettings";
import classes from "./SettingsSection.module.scss";
import { settingsSectionIcons } from "./SettingsSectionIcons";

type SettingsSectionProps = {
  // user data
  user: GetFullUserDto | null;
};

function SettingsSection({ user }: SettingsSectionProps) {
  ///

  const navigate = useNavigate();

  return (
    <section data-testid="account-page-settings-section" className={classes.settings}>
      <div className={classes.settings__category}>
        <h3 className={classes["category-header"]}>
          <IconCreator
            icons={settingsSectionIcons}
            iconName={"account"}
            iconClass={classes["cat-icon"]}
            color={mainColor.c3}
          />
          <span>Account features</span>
        </h3>

        <AccountSettings user={user} />
      </div>

      <div className={classes.settings__category}>
        <h3 className={classes["category-header"]}>
          <IconCreator
            icons={settingsSectionIcons}
            iconName={"gameplay"}
            iconClass={classes["cat-icon"]}
            color={mainColor.c3}
          />
          <span>Gameplay settings and appearance</span>
        </h3>

        <GameplaySettings user={user} />
      </div>

      <div className={classes.settings__category}>
        <h3 className={classes["category-header"]}>
          <IconCreator icons={symbolIcons} iconName={"info"} iconClass={classes["cat-icon"]} color={mainColor.c3} />
          <span>About the App</span>
        </h3>

        <div className={classes.settings__category__row}>
          <h3 className={classes["col-title"]}>Discover More</h3>
          <p>
            Dive into details about the app, including an introduction to its purpose, objectives, terms of use, and
            privacy policies.
          </p>

          <div
            className={classes["action-button"]}
            onClick={() => {
              navigate("/about/introduction");
            }}
          >
            <ActionButton text="About page" />
          </div>
        </div>

        <div className={classes.settings__category__row}>
          <h3 className={classes["col-title"]}>Contact Us</h3>
          <p>Have questions or need assistance? Contact us using the details below, and we’ll be happy to help.</p>

          <div className={classes.contact}>
            <p className={classes["contact-data"]}>+48 000 000 000</p>
          </div>

          <div className={classes.contact}>
            <p className={classes["contact-data"]}>chess8rn@gmail.com</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SettingsSection;
