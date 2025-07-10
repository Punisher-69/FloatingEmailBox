import { createContext, useContext, useState } from "react";

type EmailContextType = {
  isVisible: boolean;
  isMinimized: boolean;
  setIsVisible: (v: boolean) => void;
  setIsMinimized: (v: boolean) => void;
};

const EmailContext = createContext<EmailContextType | null>(null);

export const useEmail = () => {
  const context = useContext(EmailContext);
  if (!context) throw new Error("useEmail must be used within EmailProvider");
  return context;
};

export const EmailProvider = ({ children }: { children: React.ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <EmailContext.Provider
      value={{ isVisible, setIsVisible, isMinimized, setIsMinimized }}
    >
      {children}
    </EmailContext.Provider>
  );
};
