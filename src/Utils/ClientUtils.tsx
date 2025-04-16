
import { SocketTags } from "../package/Consts";
import { PlayerAction } from "../package/Entities/PlayerActions";
import { AppState } from "../State/AppState";

export const SOCKET_URL = "univ-miniproj-cardgame-be.onrender.com";
export const emitAction = (appState: AppState, action: PlayerAction): void => {
    appState.socketHandler?.socket?.emit(SocketTags.ACTION, action);
}