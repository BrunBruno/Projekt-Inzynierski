import { createContext, ReactNode, useContext, useState } from "react";
import { TimingTypeModel } from "../types/abstracDtosAndModels";

type TimingTypeContextType = {
  // selected or obtained timing type
  timingType: TimingTypeModel | null;
  // to set game timing
  setTimingType: React.Dispatch<React.SetStateAction<TimingTypeModel | null>>;
};

// default context
const TimingTypeContext = createContext<TimingTypeContextType>({
  timingType: null,
  setTimingType: () => {},
});

type TimingTypeContextProps = {
  // page to include timing type functionality
  children: ReactNode;
};

// used to obtaion chosen timing time to multiple components
// set or get game timing type
export const TimingTypeProvider = ({ children }: TimingTypeContextProps) => {
  const [timingType, setTimingType] = useState<TimingTypeModel | null>(null);

  return <TimingTypeContext.Provider value={{ timingType, setTimingType }}>{children}</TimingTypeContext.Provider>;
};

export const useTimingType = () => useContext(TimingTypeContext);
