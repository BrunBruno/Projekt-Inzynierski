import DetailPawnIconSvg from '../../../shared/svgs/DetailPawnIconSvg';
import { mainColor } from '../../../shared/utils/enums/colorMaps';
import { registrationActionEnum } from '../../../shared/utils/enums/registrationAction';
import classes from './SignSection.module.scss';

type SignIpSectionProps = {
  setModal: React.Dispatch<React.SetStateAction<number>>;
};

function SignInSection({ setModal }: SignIpSectionProps) {
  const signInUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <form
      className={classes['sign-form']}
      onSubmit={(event) => signInUser(event)}
    >
      <DetailPawnIconSvg color={mainColor.c0} iconClass={classes['bg-svg']} />

      <h2>Login Now</h2>

      <div className={classes['change-form']}>
        Don't have an accout?{' '}
        <span onClick={() => setModal(registrationActionEnum.signUp)}>
          Sing Up
        </span>
      </div>

      <div className={classes['form-row']}>
        <input type="text" placeholder="UserName" />
      </div>

      <div className={classes['form-row']}>
        <input type="password" placeholder="Passworrd" />
      </div>

      <div className={classes.error}>
        <span>Something went wrong.</span>
      </div>

      <button>Sign In</button>
    </form>
  );
}

export default SignInSection;
