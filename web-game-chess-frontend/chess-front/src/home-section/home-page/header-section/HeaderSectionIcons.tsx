import classes from './HeaderSection.module.scss';

import { mainColor } from '../../../shared/styles/Variables';

type IconProps = {
  iconName: string;
};

function HeaderSectionIcons({ iconName }: IconProps) {
  if (iconName === 'home') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={classes.icon}
      >
        <path
          d="M19 10L19 20H9M5 20L5 10L12 3L15.5 6.5"
          stroke={mainColor.c0}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  } else if (iconName === 'learn') {
    return (
      <svg
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        className={classes.icon}
      >
        <path
          fill={mainColor.c0}
          d="M8.316 2.07a.75.75 0 00-.632 0l-7 3.25a.75.75 0 000 1.36l1.434.666A.746.746 0 002 7.75V11a.75.75 0 00.158.46L2.75 11l-.592.46.001.002.001.001.003.004.008.01a1.882 1.882 0 00.103.12c.068.076.165.178.292.299.254.24.63.555 1.132.866C4.706 13.388 6.217 14 8.25 14c2.037 0 3.44-.615 4.345-1.266a5.32 5.32 0 00.977-.902 3.916 3.916 0 00.322-.448l.007-.012.003-.004v-.002h.001c0-.001 0-.002-.655-.366l.655.365A.754.754 0 0014 11V7.75a.747.747 0 00-.118-.404l1.434-.666a.75.75 0 000-1.36l-7-3.25zM12.5 7.988L8.316 9.93a.75.75 0 01-.632 0L3.5 7.988v2.723a5.585 5.585 0 00.99.776c.804.5 2.043 1.013 3.76 1.013 1.713 0 2.81-.51 3.468-.984a3.812 3.812 0 00.782-.745V7.988zM8 8.423L2.781 6 8 3.577 13.219 6 8 8.423z"
          fillRule="evenodd"
          clipRule="evenodd"
        />
      </svg>
    );
  } else if (iconName === 'play') {
    return (
      <svg
        fill={mainColor.c0}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className={classes.icon}
      >
        <path d="M19.97,17.758A1,1,0,0,0,19,17h-.536c-1.377-1.76-1.87-5.044-2-7H17a1,1,0,0,0,0-2h-.064a5.145,5.145,0,0,0,.314-1.75,5.25,5.25,0,0,0-10.5,0A5.145,5.145,0,0,0,7.064,8H7a1,1,0,0,0,0,2h.533c-.127,1.956-.62,5.24-2,7H5a1,1,0,0,0-.97.758l-1,4A1,1,0,0,0,4,23H20a1,1,0,0,0,.97-1.242ZM12,3a3.254,3.254,0,0,1,3.25,3.25A3.158,3.158,0,0,1,14.72,8H9.28a3.158,3.158,0,0,1-.53-1.75A3.254,3.254,0,0,1,12,3ZM9.536,10h4.928a18.915,18.915,0,0,0,1.641,7H7.9A18.915,18.915,0,0,0,9.536,10ZM5.281,21l.5-2H18.219l.5,2Z" />
      </svg>
    );
  } else if (iconName === 'faq') {
    return (
      <svg
        fill={mainColor.c0}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className={classes.icon}
      >
        <path d="M12,1A11,11,0,1,0,23,12,11.013,11.013,0,0,0,12,1Zm0,20a9,9,0,1,1,9-9A9.011,9.011,0,0,1,12,21Zm1-4.5v2H11v-2Zm3-7a3.984,3.984,0,0,1-1.5,3.122A3.862,3.862,0,0,0,13.063,15H11.031a5.813,5.813,0,0,1,2.219-3.936A2,2,0,0,0,13.1,7.832a2.057,2.057,0,0,0-2-.14A1.939,1.939,0,0,0,10,9.5,1,1,0,0,1,8,9.5V9.5a3.909,3.909,0,0,1,2.319-3.647,4.061,4.061,0,0,1,3.889.315A4,4,0,0,1,16,9.5Z" />
      </svg>
    );
  } else {
    return <>i</>;
  }
}

export default HeaderSectionIcons;
