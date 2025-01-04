import { DevelopmentCard, Resources, RoadLocation, ScoringTable, SettleLocation, SpecialCard, Table } from './Models';

export type GameState = {
    Table: Table,
    players: PlayerState[],
    scoringTable: Record<string, number>,
    stack: DevelopmentCard[],
    round: number,
}

export type PlayerState = {
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
    SpecialCards: SpecialCard[], 
}


// todo: action types and state

export enum PlayerActionType {
    BuildCity,
    DrawDevelopmentCard,
    FinishStep
}

export type PlayerActionState =
        {
        type: PlayerActionType.BuildCity,
        city: SettleLocation
    } | {
        type: PlayerActionType.DrawDevelopmentCard
    } | {
        type: PlayerActionType.FinishStep
    }
