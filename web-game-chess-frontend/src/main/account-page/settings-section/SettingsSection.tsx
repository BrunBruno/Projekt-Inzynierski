import IconCreator from "../../../shared/components/icon-creator/IconCreator";
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

  return (
    <section className={classes.settings}>
      <div className={classes.settings__category}>
        <h3 className={classes["category-header"]}>
          <IconCreator icons={settingsSectionIcons} iconName={"account"} iconClass={classes["cat-icon"]} />
          <span>Account features</span>
        </h3>

        <AccountSettings user={user} />
      </div>

      <div className={classes.settings__category}>
        <h3 className={classes["category-header"]}>
          <IconCreator icons={settingsSectionIcons} iconName={"gameplay"} iconClass={classes["cat-icon"]} />
          <span>Gameplay appearance and settings</span>
        </h3>

        <GameplaySettings />
      </div>
    </section>
  );
}

export default SettingsSection;
