"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { logCustomEvent } from '../utils/customLogger';
import { FALLBACK_PAGE_LAYOUT } from '../config/fallbackLayout';
import { initializeApiClients } from '../shared/api/apiClientFactory';

export type UserRole = 'USER' | 'ADMIN';

export interface LoggedInUser {
  email: string;
  name: string;
  role: string;
  emailVerified?: boolean;
}

interface AppContextType {
  isLoggedIn: boolean;
  userRole: UserRole;
  currentUser: LoggedInUser | null;
  siteContent: any;
  cmsStatus: 'READY' | 'NOT_INITIALIZED' | 'ERROR';
  handleLoginSuccess: (userObj: LoggedInUser) => void;
  handleLogout: () => void;
  updateUserName: (newName: string) => void;
  handleUpdateContent: (newContent: any) => Promise<void>;
  initializeCMS: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<UserRole>('USER');
  const [currentUser, setCurrentUser] = useState<LoggedInUser | null>(null);
  const [siteContent, setSiteContent] = useState<any>(null);
  const [cmsStatus, setCmsStatus] = useState<'READY' | 'NOT_INITIALIZED' | 'ERROR'>('READY');
  const initializedRef = React.useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    let isMounted = true;
    let dataLoaded = false;

    const loadLocal = async (source: string) => {
      if (!isMounted || dataLoaded) return;
      try {
        const localRes = await fetch('./content.json');
        if (!localRes.ok) throw new Error("Local file not found");
        const localData = await localRes.json();
        localData.pageLayout = FALLBACK_PAGE_LAYOUT;
        if (isMounted && !dataLoaded) {
          setSiteContent(localData);
          dataLoaded = true;
          console.log(`Dane załadowane lokalnie (${source}).`);
        }
      } catch (e) {
        console.error("Błąd krytyczny ładowania lokalnego JSON:", e);
      }
    };

    const loadCloud = async () => {
      console.log("Łączenie z systemem CMS...");
      try {
        // Najpierw pobierz dane lokalne jako bazę (fallback/defaults)
        const localRes = await fetch('./content.json');
        const localData = localRes.ok ? await localRes.json() : {};
        localData.pageLayout = FALLBACK_PAGE_LAYOUT;

        const response = await fetch('/api/content');
        if (response.ok) {
          const cloudData = await response.json();
          if (cloudData.status === 'CMS_NOT_INITIALIZED') {
            setCmsStatus('NOT_INITIALIZED');
            console.warn("Baza CMS nie zainicjalizowana w chmurze. Ładowanie danych startowych.");
            if (isMounted && !dataLoaded) {
              setSiteContent(localData);
              dataLoaded = true;
            }
            return;
          }
          
          if (cloudData && !cloudData.error && isMounted && !dataLoaded) {
            const mergedContent = {
              ...localData,
              ...cloudData
            };
            
            setSiteContent(mergedContent);
            setCmsStatus('READY');
            dataLoaded = true;
            console.log("Dane pobrane i scalone pomyślnie z systemu CMS.");
          }
        } else {
          console.error("Serwer Cloud zwrócił błąd. Próba ostatecznego fallbacku.");
          if (isMounted && !dataLoaded) {
            setSiteContent(localData);
            dataLoaded = true;
          }
        }
      } catch (e) {
        console.warn("Chmura niedostępna lub błąd sieci. System będzie czekał na stabilne połączenie.");
        setTimeout(() => {
          if (!dataLoaded) loadLocal("Network Error Fallback");
        }, 10000);
      }
    };

    const init = async () => {
      try {
        await initializeApiClients();
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            setCurrentUser(data.user);
            setUserRole(data.user.role === 'System Admin' || data.user.role === 'ADMIN' ? 'ADMIN' : 'USER');
            setIsLoggedIn(true);
          }
        }
      } catch (e) {
        console.error("Błąd inicjalizacji sesji:", e);
      }
      
      await loadCloud();
    };
    
    init();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLoginSuccess = (userObj: LoggedInUser) => {
    setCurrentUser(userObj);
    setUserRole(userObj.role === 'System Admin' || userObj.role === 'ADMIN' ? 'ADMIN' : 'USER');
    setIsLoggedIn(true);

    logCustomEvent({ 
      event_name: 'user_login_success', 
      user_email: userObj.email,
      metadata: { name: userObj.name, role: userObj.role }
    });
  };

  const handleLogout = async () => {
    const email = currentUser?.email;
    setIsLoggedIn(false);
    setUserRole('USER');
    setCurrentUser(null);
    
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error("Błąd podczas wylogowywania:", e);
    }
    
    logCustomEvent({ event_name: 'user_logout', user_email: email });
  };

  const updateUserName = (newName: string) => {
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        name: newName
      });
    }
  };

  const handleUpdateContent = async (newContent: any) => {
    setSiteContent(newContent);
    
    try {
      console.log("Synchronizacja danych z systemem CMS...");
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'UPDATE_CMS',
          data: newContent
        })
      });
      
      if (response.ok) {
        console.log("Zlecenie aktualizacji wysłane do chmury i zapisane pomyślnie.");
      } else {
        console.error("Błąd podczas zapisu do chmury:", await response.text());
        throw new Error("Błąd podczas zapisu do chmury");
      }
    } catch (err) {
      console.error("Błąd synchronizacji z systemem CMS:", err);
      throw err;
    }
  };

  const initializeCMS = async () => {
    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'INITIALIZE_CMS',
          data: siteContent
        })
      });
      
      if (response.ok) {
        setCmsStatus('READY');
        console.log("CMS zainicjalizowany pomyślnie");
      } else {
        console.error("Błąd podczas inicjalizacji CMS:", await response.text());
      }
    } catch (err) {
      console.error("Błąd inicjalizacji CMS:", err);
    }
  };

  // Inactivity timeout logic
  useEffect(() => {
    if (!isLoggedIn) return;

    let timeoutId: NodeJS.Timeout;

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      // 15 minutes = 15 * 60 * 1000 ms
      timeoutId = setTimeout(() => {
        console.log("Wylogowanie z powodu bezczynności.");
        handleLogout();
      }, 15 * 60 * 1000);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [isLoggedIn]);

  const contextValue = React.useMemo(() => ({
    isLoggedIn,
    userRole,
    currentUser,
    siteContent,
    cmsStatus,
    handleLoginSuccess,
    handleLogout,
    updateUserName,
    handleUpdateContent,
    initializeCMS,
  }), [isLoggedIn, userRole, currentUser, siteContent, cmsStatus]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
