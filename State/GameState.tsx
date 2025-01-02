import { createContext, PropsWithChildren, Dispatch, useReducer, ReactNode, useContext } from 'react';
import { GameState } from '../package/entities/State';


export enum GameActionTypes {
    Action1,
    Action2
}

type GameAction = 
    | { type: GameActionTypes.Action1, payload: {val: string} }
    | { type: GameActionTypes.Action2, payload: {val: string} }



type GameContext = {
    state: GameState,
    dispatch: Dispatch<GameAction>;
}

type GameStateProviderProps = {
    initialState: GameState,
    children: ReactNode
}

const GameStateContext = createContext<GameContext | null>(null);

function gameReducer(state: GameState, action: GameAction): GameState {
    switch (action.type) {
        case GameActionTypes.Action1: {
            return {...state, players: state.players.map((player) => player.name == "harel" ? {...player, name: action.payload.val} : player)};
        }
        case GameActionTypes.Action2: {
            return {...state, round: state.round + 1};
        }
    }
}

export const GameContextProvider: React.FC<GameStateProviderProps> = ({initialState, children}) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  return <GameStateContext.Provider value={{state, dispatch}}>
    {children}
  </GameStateContext.Provider>
}

export const useGameContext = (): GameContext => {
    const context = useContext(GameStateContext);
    if (!context) {
        throw new Error('useGameContext must be used within a GameContextProvider');
    }
    return context;
}
