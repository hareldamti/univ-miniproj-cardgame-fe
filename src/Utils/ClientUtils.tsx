
import { SocketTags } from "../package/Consts";
import { PlayerAction } from "../package/Entities/PlayerActions";
import { AppState } from "../State/AppState";

export const emitAction = (appState: AppState, action: PlayerAction): void => {
    appState.socketHandler?.socket?.emit(SocketTags.ACTION, action);
}