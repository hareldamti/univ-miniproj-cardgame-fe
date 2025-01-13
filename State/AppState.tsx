import { createContext, useContext } from 'react';
import { Coords } from '../package/entities/Models';

export interface AppState {
    username: string | null,
    roomId: number | null,
    socketHandler: SocketHandler | null,
    utils: {coords: Coords[]}
}

export const AppContext = createContext<AppState | null>(null);

export const useAppContext = (): AppState => {
    const context = useContext(AppContext);
    if (!context) {
      throw new Error('useAppContext');
    }
    return context;
};

interface SocketHandler {
  request: 2,
}