import { DevelopmentCard, Resources, ScoringTable, SpecialCard, Table } from './Models';

export type GameState = {
    Table: Table,
    players: PlayerState[],
    scoringTable: Record<string, number>,
    stack: DevelopmentCard[],
    round: number,
}

export type PlayerState = {
    name: string,
    Settlements: number[], // IDs of placed settlements
    Cities: number[], // IDs of placed cities
    Roads: number[], // IDs of placed roads
    AvailableAssets: {
        settlements: number, // Number of settlements left to build
        cities: number, // Number of cities left to build
        roads: number, // Number of roads left to build
    },
    Resources: Resources[],
    DevelopmentCards: DevelopmentCard[], //cards that you can buy
    SpecialCards: SpecialCard[], 
}
