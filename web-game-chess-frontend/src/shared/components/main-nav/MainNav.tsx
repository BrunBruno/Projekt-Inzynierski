import { useNavigate } from "react-router-dom";
import classes from "./MainNav.module.scss";
import LogoIcon from "../../svgs/icons/LogoIcon";
import IconCreator from "../icon-creator/IconCreator";
import { mainNavIcons } from "./MainNavIcons";

function MainNav() {
  ///

  const navigate = useNavigate();

  // log out user
  const onLogOut = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");

    navigate("/", {
      state: {
        popupText: "Logged out",
        popupType: "info",
      },
    });
  };
  //*/

  return (
    <nav className={classes.nav}>
      <div className={classes.nav__elements}>
        <div
          className={classes.element}
          onClick={() => {
            navigate("/main");
          }}
        >
          <LogoIcon iconClass={classes["nav-icon"]} />
          <span className={classes.ind}>Main</span>
        </div>

        <div
          className={classes.element}
          onClick={() => {
            navigate("/main/account");
          }}
        >
          <IconCreator icons={mainNavIcons} iconName={"accountPage"} />
          <span className={classes.ind}>Account</span>
        </div>

        <div
          className={classes.element}
          onClick={() => {
            navigate("/main/users");
          }}
        >
          <IconCreator icons={mainNavIcons} iconName={"friendsPage"} />
          <span className={classes.ind}>Add friend</span>
        </div>

        {/* placeholders */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={classes.element} style={{ pointerEvents: "none" }}>
            <p></p>
            <span className={classes.ind}>ind</span>
          </div>
        ))}
        {/* placeholders */}

        <div
          className={classes.element}
          onClick={() => {
            onLogOut();
          }}
        >
          <IconCreator icons={mainNavIcons} iconName={"logOut"} />
          <span className={classes.ind}>Log out</span>
        </div>
      </div>
    </nav>
  );
}

export default MainNav;
