import { useNavigate } from "react-router-dom";
import classes from "./MainNav.module.scss";
import MainNavIcons from "./MainNavIcons";
import LogoIconSvg from "../../svgs/LogoIconSvg";

function MainNav() {
  const navigate = useNavigate();

  const onLogOut = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");

    navigate("/");
  };

  return (
    <nav className={classes.nav}>
      <div className={classes.nav__elements}>
        <div
          className={classes.element}
          onClick={() => {
            navigate("/main");
          }}
        >
          <LogoIconSvg iconClass={classes["nav-icon"]} />
        </div>

        <div
          className={classes.element}
          onClick={() => {
            navigate("/main/account");
          }}
        >
          <MainNavIcons iconName="account" />
          <span className={classes.ind}>Account</span>
        </div>

        <div
          className={classes.element}
          onClick={() => {
            navigate("/main/users");
          }}
        >
          <MainNavIcons iconName="addFriend" />
          <span className={classes.ind}>Add friend</span>
        </div>

        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={classes.element}>
            <p>i</p>
            <span className={classes.ind}>ind</span>
          </div>
        ))}

        <div
          className={classes.element}
          onClick={() => {
            onLogOut();
          }}
        >
          <MainNavIcons iconName="logOut" />
          <span className={classes.ind}>Log out</span>
        </div>
      </div>
    </nav>
  );
}

export default MainNav;
