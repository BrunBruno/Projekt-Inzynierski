/* data for faq section cards (questions and answers) */

export type QuestionsType = {
  question: string;
  answer: string;
};

// first row data
export const accountAndUserProfileFAQs: QuestionsType[] = [
  {
    question: "How do I create an account on this chess web app?",
    answer:
      "To create an account, click on the 'Sign Up' or 'Register' button on the homepage. You'll be prompted to provide an email address and create a password. Follow the instructions to complete the registration process.",
  },
  {
    question: "Is there a guest mode available for playing without signing up?",
    answer:
      "No, we do not offer a guest mode for users who want to play without creating an account. You must create and verify an account to use all features of the website, including accessing games and saving your progress. This ensures a personalized experience, data security, and full access to our platform's offerings.",
  },
  {
    question: "Can I customize my profile picture and username?",
    answer:
      "Yes, once you're logged in, navigate to your profile settings. From there, you can upload a profile picture and update your data to personalize your account.",
  },
  {
    question: "How do I reset my password if I forget it?",
    answer:
      "If you forget your password, click on the 'Reset Password' link on the login page. You'll be prompted to enter your email address, and we'll send you instructions on how to reset your password.",
  },
  {
    question: "Are there any tutorials or guides available for new users?",
    answer:
      "Yes, we provide tutorials and guides to help new users get started with the chess web app. You can find them in the 'Help' or 'Support' section of the app.",
  },
  {
    question: "Can I invite friends to play a game?",
    answer:
      "Yes, you can invite friends to play by sharing your game link or sending them invitations through the app. Keep track of your friends activity and enjoy playing together!",
  },
  {
    question: "How can I update my email address or other account information?",
    answer:
      "To update your account information, go to your profile settings. From there, you can edit your email address, password, and other details as needed.",
  },
];

// second row data
export const gameplayAndFeaturesFAQs: QuestionsType[] = [
  {
    question: "How do I make a move in the chess game?",
    answer:
      "To make a move, simply click on the piece you want to move, then click on the square you want to move it to. If the move is valid, it will be executed.",
  },
  {
    question: "What are the rules for castling?",
    answer:
      "Castling is a special move involving the king and one of the rooks. To castle, move the king two squares towards the rook, then move the rook to the square next to the king. However, there are certain conditions that must be met to perform castling.",
  },
  {
    question: "How do I analyze my games after they're finished?",
    answer:
      "While we do not have a dedicated analysis page, you can rejoin a finished game and review the board. This allows you to go over each move, reflect on your strategy, and identify areas for improvement. It's a great way to learn from completed games and enhance your future performance.",
  },
  {
    question: "Is there a chat feature for communicating with opponents during a game?",
    answer:
      "Yes, there's a chat feature available during games. You can use it to communicate with your opponent, discuss strategies, or just say hello!",
  },
  {
    question: "Can I customize the board and pieces?",
    answer:
      "Yes, you can customize the board's appearance and choose from different piece sets to suit your preferences. Explore the settings to find the options for customization.",
  },
  {
    question: "How do I resign from a game?",
    answer:
      "If you decide to resign from a game, you can do so by clicking on the 'Resign' button during the game. This will concede the game to your opponent.",
  },
  {
    question: "Are there different time controls for games?",
    answer:
      "Yes, you can choose from various time controls when starting a game, such as blitz, rapid, or classical. Select the time control that suits your playing style and preferences.",
  },
  {
    question: "Can I play against the computer?",
    answer:
      "Yes, you can play against the computer at different difficulty levels. Choose the desired difficulty level before starting a game against the AI.",
  },
  {
    question: "How do I access my game history and statistics?",
    answer:
      "You can view your game history and statistics in the 'Profile' or 'Stats' section of the app. Here, you'll find details such as your win-loss record, rating, and more.",
  },
  {
    question: "Is there a tutorial for learning chess?",
    answer:
      "Currently, we do not have a tutorial for learning chess on our website. However, there are many resources available online and through apps that can help you learn chess basics and advanced strategies. We recommend checking out reputable chess platforms, instructional videos, and guides to improve your skills.",
  },
];
