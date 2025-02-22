import { createContext, Dispatch, useReducer, ReactNode, useContext } from 'react';
import { GameState } from '../package/Entities/State';
import { GameAction, gameReducer } from '../package/Entities/GameActions';

type GameStateProviderProps = {
    initialState: GameState,
    children: ReactNode
}

export const GameContextProvider: React.FC<GameStateProviderProps> = ({initialState, children}) => {
  const [gameState, dispatch] = useReducer(gameReducer, initialState);
  return <GameStateContext.Provider value={{gameState, dispatch}}>
    {children}
  </GameStateContext.Provider>
}

type GameContext = {
    gameState: GameState,
    dispatch: Dispatch<GameAction[]>;
}

const GameStateContext = createContext<GameContext | null>(null);

export const useGameContext = (): GameContext => {
    const context = useContext(GameStateContext);
    if (!context) {
        throw new Error('useGameContext must be used within a GameContextProvider');
    }
    return context;
}
