import { createContext, useCallback, useContext, useMemo, useState } from "react";

const DEFAULT_IMPACTS = {
  scc: false,
  so2: false,
  water: false,
};

const ClimateImpactContext = createContext(null);

export const ClimateImpactProvider = ({ children }) => {
  const [impacts, setImpacts] = useState(DEFAULT_IMPACTS);

  const toggleImpact = useCallback((key) => {
    setImpacts((prev) => {
      if (!(key in prev)) return prev;
      return {
        ...prev,
        [key]: !prev[key],
      };
    });
  }, []);

  const setImpact = useCallback((key, value) => {
    setImpacts((prev) => {
      if (!(key in prev)) return prev;
      return {
        ...prev,
        [key]: Boolean(value),
      };
    });
  }, []);

  const value = useMemo(
    () => ({
      impacts,
      setImpacts,
      setImpact,
      toggleImpact,
    }),
    [impacts, setImpact, toggleImpact]
  );

  return (
    <ClimateImpactContext.Provider value={value}>
      {children}
    </ClimateImpactContext.Provider>
  );
};

export const useClimateImpacts = () => {
  const context = useContext(ClimateImpactContext);
  if (!context) {
    throw new Error(
      "useClimateImpacts must be used within a ClimateImpactProvider"
    );
  }
  return context;
};
