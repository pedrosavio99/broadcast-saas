import { createContext, useContext } from 'react';

type ColorModeContextType = {
  toggle: () => void;
};

export const ColorModeContext = createContext<ColorModeContextType>({
  toggle: () => {},
});

export const useColorMode = () => useContext(ColorModeContext);