import { createContext, useContext } from 'react';

export type AppState = {
    username: string | null,
    roomId: number | null,
}

export const AppContext = createContext<AppState | null>(null);

export const useAppContext = (): AppState => {
    const context = useContext(AppContext);
    if (!context) {
      throw new Error('useAppContext');
    }
    return context;
};