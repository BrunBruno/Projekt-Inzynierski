import DetailPawnIconSvg from '../../../shared/svgs/DetailPawnIconSvg';
import { mainColor } from '../../../shared/utils/enums/colorMaps';
import { registrationActionEnum } from '../../../shared/utils/enums/registrationAction';
import classes from './SignSection.module.scss';

type SignUpSectionProps = {
  setModal: React.Dispatch<React.SetStateAction<number>>;
};

function SignUpSection({ setModal }: SignUpSectionProps) {
  const signUpUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <form
      className={classes['sign-form']}
      onSubmit={(event) => signUpUser(event)}
    >
      <DetailPawnIconSvg color={mainColor.c0} iconClass={classes['bg-svg']} />
      <h2>Create Account</h2>
      <div className={classes['change-form']}>
        Already have an account?{' '}
        <span onClick={() => setModal(registrationActionEnum.signIn)}>
          Sing In
        </span>
      </div>
      <div className={classes['form-row']}>
        <input type="text" placeholder="E-mail" />
      </div>
      <div className={classes['form-row']}>
        <input type="text" placeholder="UserName" />
      </div>
      <div className={classes['form-row']}>
        <input type="password" placeholder="Passworrd" />
      </div>
      <div className={classes['form-row']}>
        <input type="password" placeholder="Confirm Password" />
      </div>
      <div className={classes.error}>
        <span>Something went wrong.</span>
      </div>
      <button>Sign Up</button>
    </form>
  );
}

export default SignUpSection;
