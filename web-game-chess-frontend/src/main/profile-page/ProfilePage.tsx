import MainNav from "../../shared/components/main-nav/MainNav";
import classes from "./ProfilePage.module.scss";

type ProfilePageProps = {};

function ProfilePage({}: ProfilePageProps) {
  return (
    <main className={classes["profile-main"]}>
      <MainNav />
    </main>
  );
}

export default ProfilePage;
