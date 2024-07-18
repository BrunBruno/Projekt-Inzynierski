import { createContext, ReactNode, useContext, useState } from "react";

export const popupIconTypes = ["success", "info", "warning", "error"] as const;

interface PopupContextType {
  showPopup: (content: string, type: typeof popupIconTypes[number]) => void;
  hidePopup: () => void;
  popupContent: string;
  popupType: typeof popupIconTypes[number] | null;
}

const PopupContext = createContext<PopupContextType>({
  showPopup: () => {},
  hidePopup: () => {},
  popupContent: "",
  popupType: null,
});

type PopUpProviderProps = {
  children: ReactNode;
};

export const PopupProvider = ({ children }: PopUpProviderProps) => {
  const [popupContent, setPopupContent] = useState<string>("");
  const [popupType, setPopupType] = useState<
    typeof popupIconTypes[number] | null
  >(null);

  const showPopup = (content: string, type: typeof popupIconTypes[number]) => {
    hidePopup();

    setTimeout(() => {
      setPopupContent(content);
      setPopupType(type);
    }, 10);
  };

  const hidePopup = () => {
    setPopupContent("");
    setPopupType(null);
  };

  return (
    <PopupContext.Provider
      value={{ showPopup, hidePopup, popupContent, popupType }}
    >
      {children}
    </PopupContext.Provider>
  );
};

export const usePopup = () => useContext(PopupContext);
