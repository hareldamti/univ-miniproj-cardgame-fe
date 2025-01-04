
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

//initalize round
function initializeRound(gameState: GameState): GameState {
    gameState.round = 1;
    return gameState;
}

/// 4TODO: Create ComputedBoardState ComputeBoardState- what excectly?
// function computeBoardState {

// }



// Function to get adjacent intersections
function getAdjacentIntersections(settleLocation: SettleLocation, allLocations: SettleLocation[]): SettleLocation[] {
    const adjacentIntersections: SettleLocation[] = [];

    for (let location of allLocations) {
        if (location.adjHex !== settleLocation.adjHex) { //if they are different locations
            let sharedHexes = settleLocation.adjHex.filter(coords => location.adjHex.includes(coords));
            //the rule for adjacancy- check if the two locations have at least 2 shared hexes- then they are adjacant
            if (sharedHexes.length >= 2) {
                adjacentIntersections.push(location);
            }
        }
    }
    return adjacentIntersections;
}

// Function to check if an intersection is available for building a settlement
function isIntersectionAvailable(settleLocation: SettleLocation, gameState: GameState): boolean {
    // Check if the current intersection is unowned
    if (settleLocation.owner !== null) {
        return false;
    }

    // Check adjacent intersections
    let adjacentIntersections = getAdjacentIntersections(settleLocation, gameState.Table.SettleLocation);
    for (let adjLocation of adjacentIntersections) {
        if (adjLocation.owner !== null) {
            return false;
        }
    }
    return true;
}

// Function to get available settlement locations based on rule of distance and if the locations owner is null
function availableSettlements(gameState: GameState): SettleLocation[] {
    return gameState.Table.SettleLocation.filter(settleLocation => isIntersectionAvailable(settleLocation, gameState));
}

// Example usage in availableStructures function
function availableStructures(playerState: PlayerState, gameState: GameState): SettleLocation[] {
    if (gameState.round === 1 || 2) {
        return availableSettlements(gameState);
    } else {
        let availableSetWithRoads: SettleLocation[] = [];
        // Rule of distance to other settlements
        const arrayRuleOfDistance = availableSettlements(gameState);
        // If there is a road that belongs to the player that is adjacent to the location
         // Check if one of the coords of each available settlement is a road that belongs to the player
         arrayRuleOfDistance.forEach(settleLocation => {
            if (settleLocation.adjHex.some(hex => isRoadOwnedByPlayer([hex], playerState, gameState))) {
                availableSetWithRoads.push(settleLocation);
            }
        });
        return availableSetWithRoads;
    }
}

// Function to check if a road belongs to the player
function isRoadOwnedByPlayer(coords: Coords[], playerState: PlayerState, gameState: GameState): boolean {
    return playerState.Roads.some(roadId => {
        const road = gameState.Table.RoadLocation.find(location => location.adjHex === roadId.adjHex); //the road exists
        //compare to the coords
        return road && (
            (road.adjHex[0].row === coords[0].row && road.adjHex[0].col === coords[0].col && road.adjHex[1].row === coords[1].row && road.adjHex[1].col === coords[1].col) ||
            (road.adjHex[0].row === coords[1].row && road.adjHex[0].col === coords[1].col && road.adjHex[1].row === coords[0].row && road.adjHex[1].col === coords[0].col)
        );
    });
}

// Function to get adjacent road locations for a specific player
function getAdjacent(playerState: PlayerState, gameState: GameState): RoadLocation[] {
    const allRoadLocations = gameState.Table.RoadLocation;
    const adjacentRoads: RoadLocation[] = [];

    playerState.Roads.forEach(playerRoad => {
        const road = allRoadLocations.find(location => location.adjHex === playerRoad.adjHex);
        if (road) {
            allRoadLocations.forEach(location => {
                if (location.adjHex !== road.adjHex) {
                    const coords1 = playerRoad.adjHex[0];
                    const coords2 = playerRoad.adjHex[1];
                    const locCoords1 = location.adjHex[0];
                    const locCoords2 = location.adjHex[1];

                    if (
                        (coords1.row === locCoords1.row && Math.abs(coords1.col - locCoords1.col) === 1) ||
                        (coords1.col === locCoords1.col && Math.abs(coords1.row - locCoords1.row) === 1) ||
                        (coords1.row === locCoords2.row && Math.abs(coords1.col - locCoords2.col) === 1) ||
                        (coords1.col === locCoords2.col && Math.abs(coords1.row - locCoords2.row) === 1) ||
                        (coords2.row === locCoords1.row && Math.abs(coords2.col - locCoords1.col) === 1) ||
                        (coords2.col === locCoords1.col && Math.abs(coords2.row - locCoords1.row) === 1) ||
                        (coords2.row === locCoords2.row && Math.abs(coords2.col - locCoords2.col) === 1) ||
                        (coords2.col === locCoords2.col && Math.abs(coords2.row - locCoords2.row) === 1) ||
                        (Math.abs(coords1.row - locCoords1.row) === 1 && Math.abs(coords1.col - locCoords1.col) === 1) ||
                        (Math.abs(coords1.row - locCoords2.row) === 1 && Math.abs(coords1.col - locCoords2.col) === 1) ||
                        (Math.abs(coords2.row - locCoords1.row) === 1 && Math.abs(coords2.col - locCoords1.col) === 1) ||
                        (Math.abs(coords2.row - locCoords2.row) === 1 && Math.abs(coords2.col - locCoords2.col) === 1)
                    ) {
                        adjacentRoads.push(location);
                    }
                }
            });
        }
    });
    return adjacentRoads;
}



// Function to get available road locations for building for specific player
function availableRoads(playerState: PlayerState, gameState: GameState): RoadLocation[] {
    let availableRoadsFromAdjacanRoads: RoadLocation[] = getAdjacent(playerState, gameState);
    //get the null locations
    availableRoadsFromAdjacanRoads = availableRoadsFromAdjacanRoads.filter(location => location.owner === null);

    // Check if the road is a continuation of an existing settlement or city
    let availableRoadsFromAdjacanSettlements: RoadLocation[] = [];
    playerState.Settlements.forEach(settlement => {
        let coords = settlement.adjHex;
        const roadLocation1 = gameState.Table.RoadLocation.find(location => location.adjHex[0] === coords[0] && location.adjHex[1] === coords[1]);
        if (roadLocation1 && roadLocation1.owner === null) {
            availableRoadsFromAdjacanSettlements.push(roadLocation1);
        }
        const roadLocation2 = gameState.Table.RoadLocation.find(location => location.adjHex[0] === coords[1] && location.adjHex[1] === coords[2]);
        if (roadLocation2 && roadLocation2.owner === null) {
            availableRoadsFromAdjacanSettlements.push(roadLocation2);
        }
        const roadLocation3 = gameState.Table.RoadLocation.find(location => location.adjHex[0] === coords[2] && location.adjHex[1] === coords[0]);
        if (roadLocation3 && roadLocation3.owner === null) {
            availableRoadsFromAdjacanSettlements.push(roadLocation3);
        }
    });

    //get the null locations
    availableRoadsFromAdjacanRoads = availableRoadsFromAdjacanRoads.filter(location => location.owner === null);

    // Merge the two arrays 
    return availableRoadsFromAdjacanRoads.concat(availableRoadsFromAdjacanSettlements);
}

//if the player can build a road
function canBuildRoad(playerState: PlayerState, gameState: GameState): boolean {
    return playerState.Resources.lumber > 0 && playerState.Resources.brick > 0 && availableRoads(playerState, gameState).length > 0
    && playerState.AvailableAssets.roads > 0;
}

//if the player can build a settlement
function canBuildSettlement(playerState: PlayerState, gameState: GameState): boolean {
    return playerState.Resources.lumber > 0 && playerState.Resources.brick > 0 && playerState.Resources.wool > 0 && playerState.Resources.grain > 0
    && availableSettlements(gameState).length > 0 && playerState.AvailableAssets.settlements > 0;
}

//if the player can build a city
function canBuildCity(playerState: PlayerState, gameState: GameState): boolean {
    return playerState.Resources.grain > 1 && playerState.Resources.ore > 2 && playerState.AvailableAssets.cities > 0;
}

//if the player can buy a development card
function canBuyDevelopmentCard(playerState: PlayerState, gameState: GameState): boolean {
    return playerState.Resources.grain > 0 && playerState.Resources.ore > 0 && playerState.Resources.wool > 0
    && gameState.stack.length > 0;
}
 
