import { getTableState } from "../Logic/BoardLogic";
import { addResources } from "../Logic/GameUtils";
import { EdgeLocation, NodeLocation, Resources, Trade } from "./Models";
import { GameState } from "./State";

export enum GameActionTypes {
    AddSettlement,
    AddCity,
    AddRoad,
    InitializeGame,
    ChangeResources,
    FinishStep,
    OpenTrade,
    CloseTrade
}

export const validateActions = (actions: any): actions is GameAction[] => {
    return Array.isArray(actions) && actions.every(action => Object.values(GameActionTypes).includes(action.type));
}

export type GameAction = 
    | { type: GameActionTypes.AddCity, payload: {playerId: number, city: NodeLocation} }
    | { type: GameActionTypes.AddSettlement, payload: {playerId: number, settlement: NodeLocation} }
    | { type: GameActionTypes.AddRoad, payload: {playerId: number, road: EdgeLocation} }
    | { type: GameActionTypes.ChangeResources, payload: {playerId: number, delta: Resources} }
    | { type: GameActionTypes.InitializeGame, payload: {initialized: GameState}}
    | { type: GameActionTypes.FinishStep, payload: {dice: [number, number] | null }}
    | { type: GameActionTypes.OpenTrade, payload: {trade: Trade }}
    | { type: GameActionTypes.CloseTrade, payload: {trade: Trade }}

export function gameReducer(state: GameState, actions: GameAction[]): GameState {
    let updatedState: GameState = state;
    actions.forEach(action => {
        switch (action.type) {
            case GameActionTypes.InitializeGame: {
                let update = {...action.payload.initialized};
                updatedState = {...update, Table: getTableState(update)};
                break;
            }
            case GameActionTypes.AddSettlement: {
                let update = {...updatedState, players: updatedState.players.map(player => player.id == action.payload.playerId ? {...player, Settlements: [...player.Settlements, {...action.payload.settlement, owner: player.id}], score: player.score + 1} : player)}
                updatedState = {...update, Table: getTableState(update)};
                break;
            } 
            case GameActionTypes.AddCity: {
                let update = {...updatedState, players: updatedState.players.map(player => player.id == action.payload.playerId ? {...player, Cities: [...player.Cities, {...action.payload.city, owner: player.id}], score: player.score + 2} : player)}
                updatedState = {...update, Table: getTableState(update)};
                break;
            }
            case GameActionTypes.AddRoad: {
                let update = {...updatedState, players: updatedState.players.map(player => player.id == action.payload.playerId ? {...player, Roads: [...player.Roads, {...action.payload.road, owner: player.id}]} : player)}
                updatedState = {...update, Table: getTableState(update)};
                break;
            }
            case GameActionTypes.ChangeResources: {
                updatedState = {...updatedState, players: updatedState.players.map(player => player.id == action.payload.playerId ? {...player, Resources: addResources(player.Resources, action.payload.delta)} : player)}
                break;
            }
            case GameActionTypes.FinishStep: {
                updatedState = {...updatedState, turn: updatedState.turn + 1, lastDice: action.payload.dice};
                break;
            }
            case GameActionTypes.OpenTrade: {
                updatedState = {...updatedState, openTrades: [...updatedState.openTrades, action.payload.trade]};
                break;
            }
            case GameActionTypes.CloseTrade: {
                updatedState = {...updatedState, openTrades: updatedState.openTrades.filter(trade => trade.offeredById != action.payload.trade.offeredById || trade.offeredToId != action.payload.trade.offeredToId)};
                break;
            }
        }
    });
    return updatedState;
}