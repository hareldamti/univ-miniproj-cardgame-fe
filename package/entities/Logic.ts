
import { Coords, DevelopmentCard, Hexagonal, HexType, RoadLocation, Robber, SettleLocation, Table } from "./Models";
import { GameState, PlayerState } from "./State";

// Initialize Game
// returns new Game: GameState
export function initializeGame(playersNames: string[]): GameState {
    return {
        Table: initializeTable(),
        players: initializePlayers(playersNames),
        scoringTable: initializeScoringTable(playersNames), 
        stack: initializeStack(),
        round: 1,
    };
}

//Initialize Table
function initializeTable(): Table {
    return {
        Board: initializeBoard(),
        SettleLocation: initializeSettleLocation(),
        RoadLocation: initializeRoadLocation(),
        Robber: initializeRobber(),
    };
}

// Initialize Board
function initializeBoard(): Hexagonal[][] {
    const board: Hexagonal[][] = [
        // First row (4 hexagons)
        [
            { id: 0, type: HexType.Sea, nuOfPoints: 0 },
            { id: 1, type: HexType.Sea, nuOfPoints: 0 },
            { id: 2, type: HexType.Sea, nuOfPoints: 0 },
            { id: 3, type: HexType.Sea, nuOfPoints: 0 }
        ],
        // Second row (5 hexagons)
        [
            { id: 4, type: HexType.Sea, nuOfPoints: 0 },
            { id: 5, type: HexType.Hill, nuOfPoints: 8 },
            { id: 6, type: HexType.Pasture, nuOfPoints: 4 },
            { id: 7, type: HexType.Hill, nuOfPoints: 11 },
            { id: 8, type: HexType.Sea, nuOfPoints: 0 },
        ],
        // Third row (6 hexagons)
        [
            { id: 9, type: HexType.Sea, nuOfPoints: 0 },
            { id: 10, type: HexType.Field, nuOfPoints: 10 },
            { id: 11, type: HexType.Mountain, nuOfPoints: 11 },
            { id: 12, type: HexType.Forest, nuOfPoints: 3 },
            { id: 13, type: HexType.Pasture, nuOfPoints: 12 },
            { id: 14, type: HexType.Sea, nuOfPoints: 0 },
        ],
        // Fourth row (7 hexagons)
        [
            { id: 15, type: HexType.Sea, nuOfPoints: 0 },
            { id: 16, type: HexType.Forest, nuOfPoints: 5 },
            { id: 17, type: HexType.Hill, nuOfPoints: 9 },
            { id: 18, type: HexType.Desert, nuOfPoints: 0 },
            { id: 19, type: HexType.Mountain, nuOfPoints: 6 },
            { id: 20, type: HexType.Field, nuOfPoints: 9 },
            { id: 21, type: HexType.Sea, nuOfPoints: 0 },
        ],
        // Fifth row (6 hexagons)
        [
            { id: 22, type: HexType.Sea, nuOfPoints: 0 },
            { id: 23, type: HexType.Field, nuOfPoints: 2 },
            { id: 24, type: HexType.Mountain, nuOfPoints: 4 },
            { id: 25, type: HexType.Field, nuOfPoints: 5 },
            { id: 26, type: HexType.Forest, nuOfPoints: 10 },
            { id: 27, type: HexType.Sea, nuOfPoints: 0 },
        ],
        // Sixth row (5 hexagons)
        [
            { id: 28, type: HexType.Sea, nuOfPoints: 0 },
            { id: 20, type: HexType.Forest, nuOfPoints: 6 },
            { id: 30, type: HexType.Pasture, nuOfPoints: 3 },
            { id: 31, type: HexType.Pasture, nuOfPoints: 8 },
            { id: 32, type: HexType.Sea, nuOfPoints: 0 },
        ],
        // Seventh row (4 hexagons)
        [
         
            { id: 33, type: HexType.Sea, nuOfPoints: 0 },
            { id: 34, type: HexType.Sea, nuOfPoints: 0 },
            { id: 35, type: HexType.Sea, nuOfPoints: 0 },
            { id: 36, type: HexType.Sea, nuOfPoints: 0 },
        ]
    ];

    return board;
}

// Initialize settleLocation
function initializeSettleLocation(): SettleLocation[] {
    let settleLocations: SettleLocation[] = [];
    return settleLocations;
}

// Initialize RoadLocation
function initializeRoadLocation(): RoadLocation[] {
    let roadLocations: RoadLocation[] = [];
    return roadLocations;
}

// Initialize Robber
function initializeRobber(): Robber {
    return { Hex: { row: 3, col: 3 } };
}


// Initialize Players
function initializePlayers(playersNames: string[]): PlayerState[] {
    //will be changed after we will have the player's data
    return [
        initializePlayer("eilon"),
        initializePlayer("harel"),
        initializePlayer("paz"),
        initializePlayer("yossi"),
    ];
}

// Initialize Player
function initializePlayer(name: string): PlayerState {
    return {
        name: name, //here we will have the player's name by its data
        Settlements: [],
        Cities: [],
        Roads: [],
        AvailableAssets: {
            settlements: 5,
            cities: 4,
            roads: 15,
        },
        Resources: {
            lumber: 0,
            brick: 0,
            ore: 0,
            grain: 0,
            wool: 0,
        },
        DevelopmentCards: [],
        SpecialCards: [],
    };
}

// Initialize ScoringTable
function initializeScoringTable(players: string[]): Record<string, number> {
    let scoringTable: Record<string, number> = {};
    players.forEach(player => {
        scoringTable[player] = 0; // Initialize each player's score to 0
    });
    return scoringTable;
}

// Initialize Stack
function initializeStack(): DevelopmentCard[] {
    let stack: DevelopmentCard[] = [];

    // Create 11 Knight cards
    for (let i = 0; i < 11; i++) {
        stack.push({ type: 'Knight', description: 'Move the robber' });
    }
    // Create 4 Victory Point cards
    for (let i = 0; i < 4; i++) {
        stack.push({ type: 'Victory', points: 1 });
    }
    // Shuffle the stack
    stack = shuffle(stack);

    return stack;
}

// Function to shuffle an array
function shuffle(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/// 4TODO: Create ComputedBoardState ComputeBoardState

function computeBoardState {

}


//first round
// availableStrtuctures(....) Coords[]
function availableStructures(playerId: number, gameState: GameState): SettleLocation[] {
    if (gameState.round === 1) {
        return gameState.Table.SettleLocation.filter((settleLocation: SettleLocation) => settleLocation.owner === null);
    } else {
        //rule of dictance- to other settlements
        arrayRuleOfDistance =

        //if there is a road that belongs to the player that is adjacent to the location
   
        //merging the two arrays
    }
}

//rule of dictance- settlements


// canMakeSettlement()
function canMakeSettlement(GameState, playerId) {
    return GameState.Players[playerId].AvailableAssets.settlements > 0 && availableStructures(GameState, playerId).length > 0;
}

// availableRoads(GameState, playerId....) Coords[]
function availableRoads(GameState, playerId) {
    return GameState.Board.RoadLocation.filter(location => 
        location.isAvailable && 
        GameState.Players[playerId].Roads.some(road => 
            areAdjacent(road.coords, location.coords)
        )
    );
}



// isRoadAvailable(playerId, BoardState, Coords) boolean



// isStructureAvailable(playerId, BoardState, Coords) boolean



// canDrawDevelopmentCard()
 
