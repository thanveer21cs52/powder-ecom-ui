import React, { createContext, useContext, useState } from 'react';

type Page = 'home' | 'products' | 'detail' | 'about' | 'contact' | 'login' | 'account' | 'checkout' | 'admin';

interface NavigationContextType {
  activePage: Page;
  navigateTo: (page: Page, data?: any) => void;
  pageData: any;
}

const NavigationContext = createContext<NavigationContextType>({
  activePage: 'home',
  navigateTo: () => {},
  pageData: null
});

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<Page>('home');
  const [pageData, setPageData] = useState<any>(null);

  const navigateTo = (page: Page, data?: any) => {
    setPageData(data || null);
    // Add a slight delay for smooth transition if needed, but CSS handles it
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <NavigationContext.Provider value={{ activePage, navigateTo, pageData }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);
