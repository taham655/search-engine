'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface IncognitoContextType {
  isIncognito: boolean;
  toggleIncognito: () => void;
}

const IncognitoContext = createContext<IncognitoContextType | undefined>(undefined);

export function IncognitoProvider({ children }: { children: React.ReactNode }) {
  const [isIncognito, setIsIncognito] = useState<boolean>(false);

  // Toggle incognito state
  const toggleIncognito = () => {
    setIsIncognito((prev) => !prev);
  };

  return (
    <IncognitoContext.Provider value={{ isIncognito, toggleIncognito }}>
      {children}
    </IncognitoContext.Provider>
  );
}

// Hook to use incognito context
export function useIncognito() {
  const context = useContext(IncognitoContext);

  if (context === undefined) {
    throw new Error('useIncognito must be used within an IncognitoProvider');
  }

  return context;
}