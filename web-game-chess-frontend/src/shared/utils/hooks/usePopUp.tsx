import { createContext, ReactNode, useContext, useState } from "react";
import { popupIconTypes } from "../objects/constantLists";
import { useLocation } from "react-router-dom";

interface PopupContextType {
  // to show MainPopup, set content and icon
  showPopup: (content: string, type: typeof popupIconTypes[number]) => void;
  // to hide popup
  hidePopup: () => void;
  // popup message content
  popupContent: string;
  // popup icon type
  popupType: typeof popupIconTypes[number] | null;
}

// default popup context
const PopupContext = createContext<PopupContextType>({
  showPopup: () => {},
  hidePopup: () => {},
  popupContent: "",
  popupType: null,
});

type PopUpProviderProps = {
  // page to include popup functionality
  children: ReactNode;
};

export const PopupProvider = ({ children }: PopUpProviderProps) => {
  const location = useLocation();

  // state for popup content
  const [popupContent, setPopupContent] = useState<string>("");
  // state for popup icon type
  const [popupType, setPopupType] = useState<typeof popupIconTypes[number] | null>(null);

  // show popup
  const showPopup = (content: string, type: typeof popupIconTypes[number]) => {
    hidePopup();

    setTimeout(() => {
      setPopupContent(content);
      setPopupType(type);
    }, 10);

    // clear location states for popups
    if (location.state) {
      delete location.state.popup;
      window.history.replaceState(location.state.popup, "", location.pathname);
    }
  };

  // hide popup
  const hidePopup = () => {
    setPopupContent("");
    setPopupType(null);
  };

  return (
    <PopupContext.Provider value={{ showPopup, hidePopup, popupContent, popupType }}>{children}</PopupContext.Provider>
  );
};

export const usePopup = () => useContext(PopupContext);
