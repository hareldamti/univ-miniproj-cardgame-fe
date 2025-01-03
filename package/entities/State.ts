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
    Cities: number[], // IDs of placed cities
    Roads: RoadLocation[], // all placed roads
    AvailableAssets: {
        settlements: number, // Number of settlements left to build
        cities: number, // Number of cities left to build
        roads: number, // Number of roads left to build
    },
    Resources: {
        lumber: number,
        brick: number,
        ore: number,
        grain: number,
        wool: number,
    }
    DevelopmentCards: DevelopmentCard[], //cards that you can buy
    SpecialCards: SpecialCard[], 
}
