import { createContext, useContext } from 'react';
import { Coords } from '../package/Entities/Models';
import { io, Socket } from "socket.io-client";

export interface AppState {
    username?: string,
    roomId?: string,
    socketHandler?: SocketHandler,
    page?: string,
}

export const AppContext = createContext<AppState>({});

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