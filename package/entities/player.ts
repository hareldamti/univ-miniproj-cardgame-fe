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
}

export type ScoringTable = {
    ScoringPlayers: ScoringPlayers[], 
}

export type PlayerState = {
    Settlements: Settlements[],
    Cities: Cities[],
    Roads: Roads[],
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
    hexagonals: [number, number, number], // Exactly 3 adjacent hexagonals
}

export type RoadLocation = {
    id: number,
    hexagonals: [number, number], // Exactly 2 adjacent hexagonals
}


//PlayerState
export type Settlements = {

};

export type Cities = {

};

export type Roads = {

};

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


