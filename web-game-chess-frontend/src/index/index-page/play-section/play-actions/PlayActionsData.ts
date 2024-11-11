export type PlayActionsData = {
  header: string;
  iconName: "online" | "offline" | "friends" | "history";
  text: string;
};

export const playActionsData: PlayActionsData[] = [
  {
    header: "Online Games with Users",
    iconName: "online",
    text: "Challenge players around the world and sharpen your skills through competitive online matches.",
  },
  {
    header: "Offline Game with Engine",
    iconName: "offline",
    text: "Play against a powerful AI engine at various difficulty levels and practice your strategy offline.",
  },
  {
    header: "Play with Friends",
    iconName: "friends",
    text: "Invite your friends and enjoy private matches with custom settings and friendly competition.",
  },
  {
    header: "Game History and More",
    iconName: "history",
    text: "Access and review your past games to analyze your performance and improve your gameplay.",
  },
];
