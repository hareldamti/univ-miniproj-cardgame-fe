import { Coords, DevelopmentCard, Hexagonal, HexType, EdgeLocation, Robber, NodeLocation, Table } from "../entities/Models";
import { GameState, PlayerState } from "../entities/State";

// Function to shuffle an array
export function shuffle(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export function getTableState(gameState: GameState) {
    return {
        ...gameState.Table,
        Cities: gameState.players.map(player => player.Cities).flat(1),
        Settlements: gameState.players.map(player => player.Settlements).flat(1),
        Roads: gameState.players.map(player => player.Roads).flat(1)
    }
}

// Function to get adjacent intersections
function getAdjacentIntersections(NodeLocation: NodeLocation, allLocations: NodeLocation[]): NodeLocation[] {
    const adjacentIntersections: NodeLocation[] = [];

    for (let location of allLocations) {
        if (location.adjHex !== NodeLocation.adjHex) { //if they are different locations
            let sharedHexes = NodeLocation.adjHex.filter(coords => location.adjHex.includes(coords));
            //the rule for adjacancy- check if the two locations have at least 2 shared hexes- then they are adjacant
            if (sharedHexes.length >= 2) {
                adjacentIntersections.push(location);
            }
        }
    }
    return adjacentIntersections;
}

// Function to check if an intersection is available for building a settlement
function isIntersectionAvailable(NodeLocation: NodeLocation, gameState: GameState): boolean {
    // Check if the current intersection is unowned
    if (NodeLocation.owner !== null) {
        return false;
    }

    // Check adjacent intersections
    let adjacentIntersections = getAdjacentIntersections(NodeLocation, gameState.Table.NodeLocations);
    for (let adjLocation of adjacentIntersections) {
        if (adjLocation.owner !== null) {
            return false;
        }
    }
    return true;
}

// Function to get available settlement locations based on rule of distance and if the locations owner is null
export function availableSettlements(gameState: GameState): NodeLocation[] {
    return gameState.Table.Settlements.filter(NodeLocation => isIntersectionAvailable(NodeLocation, gameState));
}

// Example usage in availableStructures function
export function availableStructures(playerState: PlayerState, gameState: GameState): NodeLocation[] {
    if (gameState.round === 1 || 2) {
        return availableSettlements(gameState);
    } else {
        let availableSetWithRoads: NodeLocation[] = [];
        // Rule of distance to other settlements
        const arrayRuleOfDistance = availableSettlements(gameState);
        // If there is a road that belongs to the player that is adjacent to the location
         // Check if one of the coords of each available settlement is a road that belongs to the player
         arrayRuleOfDistance.forEach(NodeLocation => {
            if (NodeLocation.adjHex.some(hex => isRoadOwnedByPlayer([hex], playerState, gameState))) {
                availableSetWithRoads.push(NodeLocation);
            }
        });
        return availableSetWithRoads;
    }
}

// Function to check if a road belongs to the player
function isRoadOwnedByPlayer(coords: Coords[], playerState: PlayerState, gameState: GameState): boolean {
    return playerState.Roads.some(roadId => {
        const road = gameState.Table.Roads.find(location => location.adjHex[0].row === roadId.adjHex[0].row && location.adjHex[0].col === roadId.adjHex[0].col && location.adjHex[1].row === roadId.adjHex[1].row && location.adjHex[1].col === roadId.adjHex[1].col);
        //compare to the coords
        return road && (
            (road.adjHex[0].row === coords[0].row && road.adjHex[0].col === coords[0].col && road.adjHex[1].row === coords[1].row && road.adjHex[1].col === coords[1].col) ||
            (road.adjHex[0].row === coords[1].row && road.adjHex[0].col === coords[1].col && road.adjHex[1].row === coords[0].row && road.adjHex[1].col === coords[0].col)
        );
    });
}

// Function to get adjacent road locations for a specific player
function getAdjacent(playerState: PlayerState, gameState: GameState): EdgeLocation[] {
    const allEdgeLocations = gameState.Table.Roads;
    const adjacentRoads: EdgeLocation[] = [];

    playerState.Roads.forEach(playerRoad => {
        const road = allEdgeLocations.find((location: { adjHex: [Coords, Coords]; }) => location.adjHex === playerRoad.adjHex);
        if (road) {
            allEdgeLocations.forEach(location => {
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
export function availableRoads(playerState: PlayerState, gameState: GameState): EdgeLocation[] {
    let availableRoadsFromAdjacanRoads: EdgeLocation[] = getAdjacent(playerState, gameState);
    //get the null locations
    availableRoadsFromAdjacanRoads = availableRoadsFromAdjacanRoads.filter(location => location.owner === null);

    // Check if the road is a continuation of an existing settlement or city
    let availableRoadsFromAdjacanSettlements: EdgeLocation[] = [];
    playerState.Settlements.forEach(settlement => {
        let coords = settlement.adjHex;
        const EdgeLocation1 = gameState.Table.Roads.find((location: { adjHex: Coords[]; }) => location.adjHex[0] === coords[0] && location.adjHex[1] === coords[1]);
        if (EdgeLocation1 && EdgeLocation1.owner === null) {
            availableRoadsFromAdjacanSettlements.push(EdgeLocation1);
        }
        const EdgeLocation2 = gameState.Table.Roads.find((location: { adjHex: Coords[]; }) => location.adjHex[0] === coords[1] && location.adjHex[1] === coords[2]);
        if (EdgeLocation2 && EdgeLocation2.owner === null) {
            availableRoadsFromAdjacanSettlements.push(EdgeLocation2);
        }
        const EdgeLocation3 = gameState.Table.Roads.find((location: { adjHex: Coords[]; }) => location.adjHex[0] === coords[2] && location.adjHex[1] === coords[0]);
        if (EdgeLocation3 && EdgeLocation3.owner === null) {
            availableRoadsFromAdjacanSettlements.push(EdgeLocation3);
        }
    });

    //get the null locations
    availableRoadsFromAdjacanRoads = availableRoadsFromAdjacanRoads.filter(location => location.owner === null);

    // Merge the two arrays 
    return availableRoadsFromAdjacanRoads.concat(availableRoadsFromAdjacanSettlements);
}


