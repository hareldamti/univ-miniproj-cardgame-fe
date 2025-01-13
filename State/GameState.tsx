import { createContext, PropsWithChildren, Dispatch, useReducer, ReactNode, useContext } from 'react';
import { GameState } from '../package/entities/State';
import { EdgeLocation, NodeLocation } from '../package/entities/Models';
import { getTableState } from '../package/Logic/BoardUtils';

export enum GameActionTypes {
    AddSettlement,
    AddCity,
    AddRoad,
}

type GameAction = 
    | { type: GameActionTypes.AddCity, payload: {playerId: number, location: NodeLocation} }
    | { type: GameActionTypes.AddSettlement, payload: {playerId: number, location: NodeLocation} }
    | { type: GameActionTypes.AddRoad, payload: {playerId: number, location: EdgeLocation} }



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
        case GameActionTypes.AddSettlement: {
            let updatedState = {...state, players: state.players.map(player => player.id == action.payload.playerId ? {...player, Settlements: [...player.Settlements, {...action.payload.location, owner: player.id}]} : player)}
            return {...updatedState, Table: getTableState(updatedState)};
        } 
        case GameActionTypes.AddCity: {
            let updatedState = {...state, players: state.players.map(player => player.id == action.payload.playerId ? {...player, Cities: [...player.Cities, {...action.payload.location, owner: player.id}]} : player)}
            return {...updatedState, Table: getTableState(updatedState)};
        }
        case GameActionTypes.AddRoad: {
            let updatedState = {...state, players: state.players.map(player => player.id == action.payload.playerId ? {...player, Roads: [...player.Roads, {...action.payload.location, owner: player.id}]} : player)}
            return {...updatedState, Table: getTableState(updatedState)};
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
