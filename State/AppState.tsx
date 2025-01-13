import { createContext, useContext } from 'react';
import { Coords } from '../package/entities/Models';
import { io, Socket } from "socket.io-client";

export interface AppState {
    username?: string,
    roomId?: number,
    socketHandler?: SocketHandler,
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
  socket: Socket,
}