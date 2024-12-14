export type GameState = {
    Table: Table,
    scoringTable: ScoringTable,
    players: PlayerState[],
}

//GameState
export type Table = {
    Board: Hexagonal[],
    SettleLocation: SettleLocation[],
    RoadLocation: RoadLocation[],
    Robber: Robber,
}

export type ScoringTable = {
    ScoringPlayers: ScoringPlayers[], 
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

export type ScoringPlayers = {
    name: string,
    points: number,
}

export type Hexagonal = {
    id: number,
    type: HexType,
    nuOfPoints: number,
}

export enum HexType {
    Forest, //lumber
    Hill, //brick
    Mountain, //ore
    Field, //grain
    Pasture, //wool
    Desert, //nothing
    Sea,
}


//Table
export type SettleLocation = {
    id: number,
    hexagonals: [number, number, number], // Adjacent hexes
    owner: number | null, // Player ID or null if unoccupied
    type: 'Settlement' | 'City' | null, // Settlement or upgraded to City
};

export type RoadLocation = {
    id: number,
    hexagonals: [number, number], // Adjacent hexes
    owner: number | null, // Player ID or null if unoccupied
    type: 'Settlement' | 'City' | null, // Settlement or upgraded to City
};

export type Robber = {
    hexagonalId: number, // The ID of the hexagonal where the robber is located
}


//PlayerState
export type Resources = {
    lumber: number,
    brick: number,
    ore: number,
    grain: number,
    wool: number,
};

export type DevelopmentCard = KnightCard | VictoryCard;

export type KnightCard = {
    type: 'Knight',
    description: string, // Description of the card's effect
}

export type VictoryCard = {
    type: 'Victory',
    points: 1, // Points worth by the card
}


export type SpecialCard = LongestArmyCard | LongestRoadCard;

export type LongestArmyCard = {
    type: 'LongestArmy',
    points: 2, // Points worth by the card
}

export type LongestRoadCard = {
    type: 'LongestRoad',
    points: 2, // Points worth by the card
}


