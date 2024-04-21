import { mainColor } from '../../../shared/styles/Variables';
import DetailPawnIconSvg from '../../../shared/svgs/DetailPawnIconSvg';
import { actionEnum } from '../RegisterPage';
import classes from './SignInSection.module.scss';

type SignIpSectionProps = {
  setModal: React.Dispatch<React.SetStateAction<number>>;
};

function SignInSection({ setModal }: SignIpSectionProps) {
  const signInUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <form
      className={classes['signin-form']}
      onSubmit={(event) => signInUser(event)}
    >
      <DetailPawnIconSvg color={mainColor.c0} />
      <h2>Create Account</h2>
      <div className={classes['change-form']}>
        Already have an account?{' '}
        <span onClick={() => setModal(actionEnum.signUp)}>Sing Up</span>
      </div>

      <div className={classes['form-row']}>
        <input type="text" placeholder="UserName" />
      </div>
      <div className={classes['form-row']}>
        <input type="password" placeholder="Passworrd" />
      </div>

      <button>Sign Ip</button>
    </form>
  );
}

export default SignInSection;
