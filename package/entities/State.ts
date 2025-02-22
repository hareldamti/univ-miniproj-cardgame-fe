import { DevelopmentCard, Resources, EdgeLocation, ScoringTable, NodeLocation, SpecialCard, Table } from './Models';
import { buildCity, buildRoad, buildSettlement, buyDevelopmentCard, finishStep, playDevelopmentCard, tradeResources } from '../Logic/Step';



export type GameState = {
    Table: Table,
    players: PlayerState[],
    currentPlayer: number,
    stack: DevelopmentCard[],
    round: number,
    user: UserState
}

export type UserState = {
    playerIdx: number,
    availableVisible: 'Cities' | 'Settlements' | 'Roads' | null 
}

export type PlayerState = {
    id: number, // index in players array
    username: string,
    Settlements: NodeLocation[], // IDs of placed settlements
    Cities: NodeLocation[], // IDs of placed cities
    Roads: EdgeLocation[], // all placed roads
    AvailableAssets: {
        settlements: number, // Number of settlements left to build
        cities: number, // Number of cities left to build
        roads: number, // Number of roads left to build
    },
    Resources: Resources,
    DevelopmentCards: DevelopmentCard[], //cards that you can buy
    knightsPlayed: number,
    SpecialCards: SpecialCard[], 
    score: number
}

export enum PlayerActionType {
    BuildSettlement,
    BuildCity,
    BuildRoad,
    DrawDevelopmentCard,
    PlayDevelopmentCard,
    Trade,
    FinishStep
}

export type PlayerAction =
    | { type: PlayerActionType.BuildSettlement, NodeLocation: NodeLocation }
    | { type: PlayerActionType.BuildCity, city: NodeLocation }
    | { type: PlayerActionType.BuildRoad, EdgeLocation: EdgeLocation }
    | { type: PlayerActionType.DrawDevelopmentCard }
    | { type: PlayerActionType.PlayDevelopmentCard, card: DevelopmentCard }
    | { type: PlayerActionType.Trade, resources: Resources }
    | { type: PlayerActionType.FinishStep };

export function handlePlayerAction(action: PlayerAction, gameState: GameState, playerState: PlayerState): GameState {
    switch (action.type) {
        case PlayerActionType.BuildSettlement:
            buildSettlement(playerState, gameState, action.NodeLocation);
            break;
        case PlayerActionType.BuildCity:
            buildCity(playerState, gameState, action.city);
            break;
        case PlayerActionType.BuildRoad:
            buildRoad(playerState, gameState, action.EdgeLocation);
            break;
        case PlayerActionType.DrawDevelopmentCard:
            buyDevelopmentCard(playerState, gameState);
            break;
        case PlayerActionType.PlayDevelopmentCard:
            playDevelopmentCard(playerState, gameState, action.card);
            break;
        case PlayerActionType.Trade:
            //TODO: trade screen
            tradeResources(playerState, action.resources);
            break;
        case PlayerActionType.FinishStep:
            finishStep(gameState);
            break;
    }
    return gameState;
}