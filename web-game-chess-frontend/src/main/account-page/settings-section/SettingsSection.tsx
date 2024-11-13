import { GetFullUserDto } from "../../../shared/utils/types/userDtos";
import AccountSettings from "./account-settings/AccountSettings";
import GameplaySettings from "./gameplay-settings/GameplaySettings";
import classes from "./SettingsSection.module.scss";

type SettingsSectionProps = {
  // user data
  user: GetFullUserDto | null;
};

function SettingsSection({ user }: SettingsSectionProps) {
  ///

  return (
    <section className={classes.settings}>
      <div className={classes.settings__category}>
        <h3 className={classes["category-header"]}>Account</h3>

        <AccountSettings user={user} />
      </div>

      <div className={classes.settings__category}>
        <h3 className={classes["category-header"]}>Gameplay</h3>

        <GameplaySettings />
      </div>
    </section>
  );
}

export default SettingsSection;
