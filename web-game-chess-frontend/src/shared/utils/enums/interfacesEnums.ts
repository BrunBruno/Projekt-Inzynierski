/* enums for changing page content based on user selection */

// to distinguish different type of content it main page
export enum GameSearchInterface {
  vsPlayer,
  vsComputer,
  vsFriend,
  searching,
  userGames,
  invitations,
}

export type StateWithSearchInterface = {
  interface: GameSearchInterface;
};
//*/

// to distinguish registration modals
export enum RegistrationInterface {
  signIn,
  signUp,
  verify,
}

export type StateWithRegOption = {
  regOption: RegistrationInterface;
  path: string;
};
//*/

// for displaying game board confirmation window
export enum GameActionInterface {
  abort,
  resign,
  draw,
}
