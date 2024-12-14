import { DevelopmentCard, Resources, ScoringTable, SpecialCard, Table } from './Models';

export type GameState = {
    Table: Table,
    scoringTable: ScoringTable,
    players: PlayerState[],
    stack: DevelopmentCard[],
}

export type PlayerState = {
    Settlements: number[], // IDs of placed settlements
    Cities: number[], // IDs 
    Roads: number[], // IDs 
    genericHarbor: number[], // IDs 
    specificHarbor: number[], // IDs
    AvailableAssets: {
        settlements: number, // Number of settlements left to build
        cities: number, // Number of cities left to build
        roads: number, // Number of roads left to build
        genericHarbor: number, // Number of generic harbors left to build
        specificHarbor: number, // Number of specific harbors left to build
    },
    Resources: Resources[],
    DevelopmentCards: DevelopmentCard[], //cards that you can buy
    SpecialCards: SpecialCard[], 
}
