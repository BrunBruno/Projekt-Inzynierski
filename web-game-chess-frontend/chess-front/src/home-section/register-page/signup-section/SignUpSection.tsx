import { mainColor } from '../../../shared/styles/Variables';
import DetailPawnIconSvg from '../../../shared/svgs/DetailPawnIconSvg';
import { actionEnum } from '../RegisterPage';
import classes from './SignUpSection.module.scss';

type SignUpSectionProps = {
  setModal: React.Dispatch<React.SetStateAction<number>>;
};

function SignUpSection({ setModal }: SignUpSectionProps) {
  const signUpUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <form
      className={classes['signup-form']}
      onSubmit={(event) => signUpUser(event)}
    >
      <DetailPawnIconSvg color={mainColor.c0} />
      <h2>Create Account</h2>
      <div className={classes['change-form']}>
        Already have an account?{' '}
        <span onClick={() => setModal(actionEnum.signIn)}>Sing In</span>
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
      <button>Sign Up</button>
    </form>
  );
}

export default SignUpSection;
