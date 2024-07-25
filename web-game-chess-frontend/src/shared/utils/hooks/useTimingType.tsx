import { createContext, ReactNode, useContext, useState } from "react";
import { TimingTypeModel } from "../types/abstracDtosAndModels";

type TimingTypeContextType = {
  timingType: TimingTypeModel | null;
  setTimingType: React.Dispatch<React.SetStateAction<TimingTypeModel | null>>;
};

const TimingTypeContext = createContext<TimingTypeContextType>({
  timingType: null,
  setTimingType: () => {},
});

type TimingTypeContextProps = {
  children: ReactNode;
};

export const TimingTypeProvider = ({ children }: TimingTypeContextProps) => {
  const [timingType, setTimingType] = useState<TimingTypeModel | null>(null);

  return <TimingTypeContext.Provider value={{ timingType, setTimingType }}>{children}</TimingTypeContext.Provider>;
};

export const useTimingType = () => useContext(TimingTypeContext);
