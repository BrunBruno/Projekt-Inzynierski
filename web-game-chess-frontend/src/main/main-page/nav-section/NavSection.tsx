import { useNavigate } from "react-router-dom";
import classes from "./NavSection.module.scss";
import NavSectionIcons from "./NavSectionIcons";

function NavSection() {
  const navigate = useNavigate();

  const onLogOut = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");

    navigate("/");
  };

  return (
    <nav className={classes.nav}>
      <div className={classes.nav__elements}>
        <div className={classes.element}>
          <NavSectionIcons iconName="account" />
          <span className={classes.ind}>Account</span>
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
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
          <NavSectionIcons iconName="logOut" />
          <span className={classes.ind}>Log out</span>
        </div>
      </div>
    </nav>
  );
}

export default NavSection;
