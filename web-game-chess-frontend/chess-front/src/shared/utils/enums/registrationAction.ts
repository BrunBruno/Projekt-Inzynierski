export type registrationActionType = {
  [key: string]: number;
};

export const registrationActionEnum: registrationActionType = {
  signIn: 1,
  signUp: 2,
  verify: 3,
};
