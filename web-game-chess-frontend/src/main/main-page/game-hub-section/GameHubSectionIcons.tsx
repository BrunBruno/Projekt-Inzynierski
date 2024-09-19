import { mainColor } from "../../../shared/utils/objects/colorMaps";
import { IconMap } from "../../../shared/utils/types/commonTypes";
import classes from "./GameHubSection.module.scss";

type IconNames = "vsPlayer" | "vsComputer" | "vsFriend" | "userGames" | "gameInvitations";

export const gameHubSectionIcons: IconMap<IconNames> = {
  vsPlayer: () => (
    <svg
      className={classes["vs-player-icon"]}
      viewBox="0 0 24 24"
      fill={mainColor.c7}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.83824 18.4467C10.0103 18.7692 10.1826 19.0598 10.3473 19.3173C8.59745 18.9238 7.07906 17.9187 6.02838 16.5383C6.72181 16.1478 7.60995 15.743 8.67766 15.4468C8.98112 16.637 9.40924 17.6423 9.83824 18.4467ZM11.1618 17.7408C10.7891 17.0421 10.4156 16.1695 10.1465 15.1356C10.7258 15.0496 11.3442 15 12.0001 15C12.6559 15 13.2743 15.0496 13.8535 15.1355C13.5844 16.1695 13.2109 17.0421 12.8382 17.7408C12.5394 18.3011 12.2417 18.7484 12 19.0757C11.7583 18.7484 11.4606 18.3011 11.1618 17.7408ZM9.75 12C9.75 12.5841 9.7893 13.1385 9.8586 13.6619C10.5269 13.5594 11.2414 13.5 12.0001 13.5C12.7587 13.5 13.4732 13.5593 14.1414 13.6619C14.2107 13.1384 14.25 12.5841 14.25 12C14.25 11.4159 14.2107 10.8616 14.1414 10.3381C13.4732 10.4406 12.7587 10.5 12.0001 10.5C11.2414 10.5 10.5269 10.4406 9.8586 10.3381C9.7893 10.8615 9.75 11.4159 9.75 12ZM8.38688 10.0288C8.29977 10.6478 8.25 11.3054 8.25 12C8.25 12.6946 8.29977 13.3522 8.38688 13.9712C7.11338 14.3131 6.05882 14.7952 5.24324 15.2591C4.76698 14.2736 4.5 13.168 4.5 12C4.5 10.832 4.76698 9.72644 5.24323 8.74088C6.05872 9.20472 7.1133 9.68686 8.38688 10.0288ZM10.1465 8.86445C10.7258 8.95042 11.3442 9 12.0001 9C12.6559 9 13.2743 8.95043 13.8535 8.86447C13.5844 7.83055 13.2109 6.95793 12.8382 6.2592C12.5394 5.69894 12.2417 5.25156 12 4.92432C11.7583 5.25156 11.4606 5.69894 11.1618 6.25918C10.7891 6.95791 10.4156 7.83053 10.1465 8.86445ZM15.6131 10.0289C15.7002 10.6479 15.75 11.3055 15.75 12C15.75 12.6946 15.7002 13.3521 15.6131 13.9711C16.8866 14.3131 17.9412 14.7952 18.7568 15.2591C19.233 14.2735 19.5 13.1679 19.5 12C19.5 10.8321 19.233 9.72647 18.7568 8.74093C17.9413 9.20477 16.8867 9.6869 15.6131 10.0289ZM17.9716 7.46178C17.2781 7.85231 16.39 8.25705 15.3224 8.55328C15.0189 7.36304 14.5908 6.35769 14.1618 5.55332C13.9897 5.23077 13.8174 4.94025 13.6527 4.6827C15.4026 5.07623 16.921 6.08136 17.9716 7.46178ZM8.67765 8.55325C7.61001 8.25701 6.7219 7.85227 6.02839 7.46173C7.07906 6.08134 8.59745 5.07623 10.3472 4.6827C10.1826 4.94025 10.0103 5.23076 9.83823 5.5533C9.40924 6.35767 8.98112 7.36301 8.67765 8.55325ZM15.3224 15.4467C15.0189 16.637 14.5908 17.6423 14.1618 18.4467C13.9897 18.7692 13.8174 19.0598 13.6527 19.3173C15.4026 18.9238 16.921 17.9186 17.9717 16.5382C17.2782 16.1477 16.3901 15.743 15.3224 15.4467ZM12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
      />
    </svg>
  ),

  vsComputer: () => (
    <svg
      className={classes["vs-computer-icon"]}
      viewBox="0 0 24 24"
      fill={mainColor.c7}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 6C2 4.34315 3.34315 3 5 3H19C20.6569 3 22 4.34315 22 6V15C22 16.6569 20.6569 18 19 18H13V19H15C15.5523 19 16 19.4477 16 20C16 20.5523 15.5523 21 15 21H9C8.44772 21 8 20.5523 8 20C8 19.4477 8.44772 19 9 19H11V18H5C3.34315 18 2 16.6569 2 15V6ZM5 5C4.44772 5 4 5.44772 4 6V15C4 15.5523 4.44772 16 5 16H19C19.5523 16 20 15.5523 20 15V6C20 5.44772 19.5523 5 19 5H5Z"
      />
    </svg>
  ),

  vsFriend: () => (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 512 512"
      xmlSpace="preserve"
      className={classes["vs-friend-icon"]}
    >
      <path
        fill={mainColor.c7}
        d="M215.736,361.283c0-36.31,14.115-70.422,39.749-96.048c13.081-13.072,28.379-23.108,45.031-29.836 c3.966-11.08,7.217-24.029,9.642-37.795c11.54-4.117,18.118-10.703,26.349-39.524c8.758-30.701-13.174-29.658-13.174-29.658 c17.741-58.704-5.6-113.874-44.712-109.824c-26.97-47.183-117.294,10.779-145.598,6.738c0,16.182,6.728,28.314,6.728,28.314 c-9.83,18.681-6.033,55.932-3.271,74.773c-1.597-0.028-21.425,0.179-13.024,29.658c8.232,28.821,14.828,35.407,26.35,39.524 c4.943,28.003,13.25,52.708,24.207,64.878c0,14.594,0,25.24,0,33.764c0,12.865-29.319,34.534-46.534,40.605 C91.938,349.368,4.582,385.368,10.22,452.802c1.354,16.182,90.326,32.974,219.761,32.974c22.76,0,44.167-0.544,64.164-1.484 c-14.171-6.616-27.27-15.572-38.66-26.942C229.851,431.715,215.736,397.594,215.736,361.283z"
      />
      <path
        fill={mainColor.c7}
        d="M493.326,469.83l-51.928-50.575c11.089-17.113,17.066-37.063,17.066-57.972c0-28.604-11.108-55.461-31.293-75.637c-20.166-20.176-47.023-31.293-75.628-31.293c-28.604,0-55.461,11.117-75.646,31.293c-20.166,20.176-31.292,47.033-31.292,75.637c0,28.605,11.126,55.472,31.292,75.647c20.186,20.176,47.042,31.292,75.646,31.292c20.919,0,40.859-5.995,57.98-17.084l50.556,51.91c9.417,11.36,23.324,12.037,34.075,1.288 C504.923,493.594,504.678,479.227,493.326,469.83z M392.119,401.87c-10.844,10.835-25.24,16.802-40.577,16.802 c-15.317,0-29.732-5.977-40.577-16.812c-10.844-10.834-16.802-25.25-16.802-40.577c0-15.326,5.958-29.732,16.802-40.567 c10.845-10.834,25.241-16.811,40.577-16.811c15.318,0,29.733,5.976,40.577,16.811C414.485,343.09,414.485,379.495,392.119,401.87z"
      />
    </svg>
  ),

  userGames: () => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={classes["user-games-icon"]}>
      <path
        d="M21.2206 8C20.5311 5.81603 19.4281 4.63486 18.0908 4.16059C17.7099 4.02549 17.3016 4 16.8974 4H16.2849C15.4074 4 14.5514 4.27225 13.8351 4.77922L13.3332 5.13441C12.9434 5.41029 12.4776 5.55844 12 5.55844C11.5225 5.55844 11.0567 5.41029 10.6669 5.13443L10.165 4.77922C9.44862 4.27225 8.59264 4 7.71504 4H7.10257C6.69838 4 6.29009 4.02549 5.90915 4.16059C3.52645 5.00566 1.88749 8.09504 2.00604 15.1026C2.02992 16.5145 2.3603 18.075 3.63423 18.6842C4.03121 18.8741 4.49667 19 5.02671 19C5.66273 19 6.1678 18.8187 6.55763 18.5632C7.47153 17.9642 8.14122 16.9639 9.11125 16.4609C9.69519 16.1581 10.3434 16 11.0011 16H12.9989C13.6566 16 14.3048 16.1581 14.8888 16.4609C15.8588 16.9639 16.5285 17.9642 17.4424 18.5632C17.8322 18.8187 18.3373 19 18.9733 19C19.5033 19 19.9688 18.8741 20.3658 18.6842C21.6397 18.075 21.9701 16.5145 21.994 15.1026C22.0132 13.9681 21.9863 12.9362 21.9176 12"
        stroke={mainColor.c7}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M7.5 9V12M6 10.5L9 10.5" stroke={mainColor.c7} strokeWidth="2" strokeLinecap="round" />
      <path
        d="M19 10.25C19 10.6642 18.6642 11 18.25 11C17.8358 11 17.5 10.6642 17.5 10.25C17.5 9.83579 17.8358 9.5 18.25 9.5C18.6642 9.5 19 9.83579 19 10.25Z"
        fill={mainColor.c7}
      />
      <path
        d="M16 10.25C16 10.6642 15.6642 11 15.25 11C14.8358 11 14.5 10.6642 14.5 10.25C14.5 9.83579 14.8358 9.5 15.25 9.5C15.6642 9.5 16 9.83579 16 10.25Z"
        fill={mainColor.c7}
      />
      <path
        d="M16.75 8C17.1642 8 17.5 8.33579 17.5 8.75C17.5 9.16421 17.1642 9.5 16.75 9.5C16.3358 9.5 16 9.16421 16 8.75C16 8.33579 16.3358 8 16.75 8Z"
        fill={mainColor.c7}
      />
      <path
        d="M16.75 11C17.1642 11 17.5 11.3358 17.5 11.75C17.5 12.1642 17.1642 12.5 16.75 12.5C16.3358 12.5 16 12.1642 16 11.75C16 11.3358 16.3358 11 16.75 11Z"
        fill={mainColor.c7}
      />
    </svg>
  ),

  gameInvitations: () => (
    <svg
      fill={mainColor.c7}
      viewBox="0 0 1920 1920"
      xmlns="http://www.w3.org/2000/svg"
      className={classes["invitations-icon"]}
    >
      <path
        d="m1387.688 1315.136 387.307 498.24H144.275l387.413-498.24 89.28 71.573h677.44l89.28-71.573ZM53 932.235l395.413 316.48L53 1756.98V932.235Zm1813.333.053v824.64l-395.413-508.267 395.413-316.373ZM1546.408-.011v498.347l319.893 277.333v19.947l-426.666 341.44v-1030.4h-960v1030.4L52.968 795.616v-19.947l320-277.333V-.011h1173.44ZM1013 266.667v266.666h266.667V640H1013v266.667H906.333V640H639.667V533.333h266.666V266.667H1013Z"
        fillRule="evenodd"
      />
    </svg>
  ),
};
