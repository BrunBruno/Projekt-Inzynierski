import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";
import { TimingTypeModel } from "../types/abstractDtosAndModels";

type TimingTypeContextType = {
  // selected or obtained timing type
  timingType: TimingTypeModel | null;
  // to set game timing
  setTimingType: Dispatch<SetStateAction<TimingTypeModel | null>>;
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

// used to obtain chosen timing time to multiple components
// set or get game timing type
export const TimingTypeProvider = ({ children }: TimingTypeContextProps) => {
  const [timingType, setTimingType] = useState<TimingTypeModel | null>(null);

  return <TimingTypeContext.Provider value={{ timingType, setTimingType }}>{children}</TimingTypeContext.Provider>;
};

export const useTimingType = () => useContext(TimingTypeContext);
