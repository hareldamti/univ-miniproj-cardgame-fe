
//GameState
export type Table = {
    Board: Hexagonal[][],
    SettleLocation: SettleLocation[],
    RoadLocation: RoadLocation[],
    Robber: Robber,
}

export type Coords = {
    row: number,
    col: number
}

export type ScoringTable = {
    ScoringPlayers: ScoringPlayers[], 
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
    AdjHex: [Coords, Coords, Coords], // Adjacent hexes
    owner: number | null, // Player ID or null if unoccupied
    type: 'Settlement' | 'City' | null, // Settlement or upgraded to City
};

export type RoadLocation = {
    AdjHex: [Coords, Coords, Coords], // Adjacent hexes
    owner: number | null, // Player ID or null if unoccupied
    type: 'Settlement' | 'City' | null, // Settlement or upgraded to City
};

export type Robber = {
    Hex: Coords, // The ID of the hexagonal where the robber is located
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


