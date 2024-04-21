import { useState } from 'react';
import classes from './RegisterPage.module.scss';
import SignUpSection from './signup-section/SignUpSection';
import SignInSection from './signin-section/SignInSection';
import PasswordIconSvg from '../../shared/svgs/PasswordIconSvg';
import { mainColor } from '../../shared/styles/Variables';

type actionEnumType = {
  [key: string]: number;
};

export const actionEnum: actionEnumType = {
  signIn: 0,
  signUp: 1,
  verify: 2,
};

function RegisterPage() {
  const [modal, setModal] = useState<number>(actionEnum.signUp);

  const renderModal = (): JSX.Element => {
    switch (modal) {
      case actionEnum.signUp:
        return <SignUpSection setModal={setModal} />;
      case actionEnum.signIn:
        return <SignInSection setModal={setModal} />;
      default:
        return <></>;
    }
  };

  return (
    <main className={classes.register}>
      <div className={classes.register__content}>
        {modal === actionEnum.signIn ? (
          <div
            className={`${classes.register__content__split} ${classes['left-side-content']}`}
          >
            <div className={classes.form}></div>
            <div className={classes.intro}>
              <h1>Get on Board</h1>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Voluptatibus mollitia, pariatur maxime deleniti, quos nesciunt
                consequuntur et asperiores totam maiores adipisci itaque eaque
                quisquam quibusdam, vero architecto similique repellendus culpa.
              </p>
            </div>
          </div>
        ) : (
          <div
            className={`${classes.register__content__split} ${classes['right-side-content']}`}
          >
            <div className={classes.intro}>
              <h1>Welcome Back</h1>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Voluptatibus mollitia, pariatur maxime deleniti, quos nesciunt
                consequuntur et asperiores totam maiores adipisci itaque eaque
                quisquam quibusdam, vero architecto similique repellendus culpa.
              </p>
            </div>
            <div className={classes.form}></div>
          </div>
        )}

        <div
          className={`${classes.register__content__form} ${modal === actionEnum.signIn ? classes['left-side-form'] : classes['right-side-form']}`}
        >
          <PasswordIconSvg color={mainColor.c7} />
          {renderModal()}
        </div>
      </div>
    </main>
  );
}

export default RegisterPage;
