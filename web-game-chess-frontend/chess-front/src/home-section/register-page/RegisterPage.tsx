import { useEffect, useState } from 'react';
import classes from './RegisterPage.module.scss';
import SignUpSection from './sign-section/SignUpSection';
import SignInSection from './sign-section/SignInSection';
import PasswordIconSvg from '../../shared/svgs/PasswordIconSvg';
import { useLocation, useNavigate } from 'react-router-dom';
import { registrationActionEnum } from '../../shared/utils/enums/registrationAction';
import { mainColor } from '../../shared/utils/enums/colorMaps';
import ActionButton from '../../shared/components/action-button/ActionButton';

function RegisterPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [modal, setModal] = useState<number>(0);

  useEffect(() => {
    if (location.state && location.state.regOption) {
      setModal(location.state.regOption);
    } else {
      setModal(registrationActionEnum.signIn);
    }
  }, [location]);

  const renderModal = (): JSX.Element => {
    switch (modal) {
      case registrationActionEnum.signIn:
        return <SignInSection setModal={setModal} />;
      case registrationActionEnum.signUp:
        return <SignUpSection setModal={setModal} />;
      case registrationActionEnum.verify:
        return <></>;
      default:
        return <></>;
    }
  };

  const getFromClass = (): string => {
    switch (modal) {
      case registrationActionEnum.signIn:
        return classes['left-side-form'];
      case registrationActionEnum.signUp:
        return classes['right-side-form'];
      case registrationActionEnum.verify:
        return classes['right-side-form'];
      default:
        return '';
    }
  };

  return (
    <main className={classes.register}>
      <div className={classes.register__content}>
        {modal === registrationActionEnum.signIn ? (
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

        <div className={`${classes.register__content__form} ${getFromClass()}`}>
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
