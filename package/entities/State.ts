import { DevelopmentCard, Resources, RoadLocation, ScoringTable, SettleLocation, SpecialCard, Table } from './Models';
import { buildCity, buildRoad, buildSettlement, buyDevelopmentCard, finishStep, playDevelopmentCard, tradeResources } from '../Logic/Step';

export type GameState = {
    Table: Table,
    players: PlayerState[],
    currentPlayer: number,
    scoringTable: Record<string, number>,
    stack: DevelopmentCard[],
    round: number,
}

export type PlayerState = {
    id: number,
    name: string,
    Settlements: SettleLocation[], // IDs of placed settlements
    Cities: SettleLocation[], // IDs of placed cities
    Roads: RoadLocation[], // all placed roads
    AvailableAssets: {
        settlements: number, // Number of settlements left to build
        cities: number, // Number of cities left to build
        roads: number, // Number of roads left to build
    },
    Resources: Resources,
    DevelopmentCards: DevelopmentCard[], //cards that you can buy
    knightsPlayed: number,
    SpecialCards: SpecialCard[], 
}


// todo: action types and state
export enum PlayerActionType {
    BuildSettlement,
    BuildCity,
    BuildRoad,
    DrawDevelopmentCard,
    PlayDevelopmentCard,
    Trade,
    FinishStep
}

export type PlayerActionState =
    | { type: PlayerActionType.BuildSettlement, settleLocation: SettleLocation }
    | { type: PlayerActionType.BuildCity, city: SettleLocation }
    | { type: PlayerActionType.BuildRoad, roadLocation: RoadLocation }
    | { type: PlayerActionType.DrawDevelopmentCard }
    | { type: PlayerActionType.PlayDevelopmentCard, card: DevelopmentCard }
    | { type: PlayerActionType.Trade, resources: Resources }
    | { type: PlayerActionType.FinishStep };

export function handlePlayerAction(action: PlayerActionState, gameState: GameState, playerState: PlayerState): GameState {
    switch (action.type) {
        case PlayerActionType.BuildSettlement:
            buildSettlement(playerState, gameState, action.settleLocation);
            break;
        case PlayerActionType.BuildCity:
            buildCity(playerState, gameState, action.city);
            break;
        case PlayerActionType.BuildRoad:
            buildRoad(playerState, gameState, action.roadLocation);
            break;
        case PlayerActionType.DrawDevelopmentCard:
            buyDevelopmentCard(playerState, gameState);
            break;
        case PlayerActionType.PlayDevelopmentCard:
            playDevelopmentCard(playerState, gameState, action.card);
            break;
        case PlayerActionType.Trade:
            //todo: trade
            tradeResources(playerState, action.resources);
            break;
        case PlayerActionType.FinishStep:
            //todo: finish step
            finishStep(gameState);
            break;
    }
    return gameState;
}