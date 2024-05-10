import { useEffect, useState } from 'react';
import classes from './RegisterPage.module.scss';
import SignUp from './modals/SignUp';
import SignIn from './modals/SignIn';
import PasswordIconSvg from '../../shared/svgs/PasswordIconSvg';
import { useLocation, useNavigate } from 'react-router-dom';
import { mainColor } from '../../shared/utils/enums/colorMaps';
import ActionButton from '../../shared/components/action-button/ActionButton';
import VerifyEmail from './modals/VerifyEmail';
import { registrationActions } from '../../shared/utils/enums/registrationEnum';

function RegisterPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [modal, setModal] = useState<number>(0);

  useEffect(() => {
    if (location.state && location.state.regOption) {
      setModal(location.state.regOption);
    } else {
      setModal(registrationActions.signIn);
    }
  }, [location]);

  // set form modal
  const renderModal = (): JSX.Element => {
    switch (modal) {
      case registrationActions.signIn:
        return <SignIn setModal={setModal} />;
      case registrationActions.signUp:
        return <SignUp setModal={setModal} />;
      case registrationActions.verify:
        return <VerifyEmail />;
      default:
        return <></>;
    }
  };

  // get form class
  const getFormClass = (): string => {
    switch (modal) {
      case registrationActions.signIn:
        return classes['left-side-form'];
      case registrationActions.signUp:
        return classes['right-side-form'];
      case registrationActions.verify:
        return classes['right-side-form'];
      default:
        return '';
    }
  };

  return (
    <main className={classes.register}>
      <div className={classes.register__content}>
        {modal === registrationActions.signIn ? (
          <div
            className={`${classes.register__content__split} ${classes['left-side-content']}`}
          >
            <div className={classes.form}></div>
            <div className={classes.intro}>
              <h1>Welcome Back</h1>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Voluptatibus mollitia, pariatur maxime deleniti, quos nesciunt
                consequuntur et asperiores totam maiores adipisci itaque eaque
                quisquam quibusdam, vero architecto similique repellendus culpa.
              </p>
              <div
                className={classes['action-button']}
                onClick={() => {
                  navigate('/');
                }}
              >
                <ActionButton text="Home Page" />
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`${classes.register__content__split} ${classes['right-side-content']}`}
          >
            <div className={classes.intro}>
              <h1>Get on Board</h1>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Voluptatibus mollitia, pariatur maxime deleniti, quos nesciunt
                consequuntur et asperiores totam maiores adipisci itaque eaque
                quisquam quibusdam, vero architecto similique repellendus culpa.
              </p>
              <div
                className={classes['action-button']}
                onClick={() => {
                  navigate('/');
                }}
              >
                <ActionButton text="Home Page" />
              </div>
            </div>
            <div className={classes.form}></div>
          </div>
        )}

        <div className={`${classes.register__content__form} ${getFormClass()}`}>
          <PasswordIconSvg
            color={mainColor.c7}
            iconClass={classes['lock-svg']}
          />
          {renderModal()}
        </div>
      </div>
    </main>
  );
}

export default RegisterPage;
