import { Coords, DevelopmentCard, Hexagonal, HexType, RoadLocation, Robber, SettleLocation, Table, SpecialCard } from "../entities/Models";
import { KnightCard, LargestArmyCard, LongestRoadCard } from "../entities/Models";
import { GameState, PlayerState } from "../entities/State";
import { availableRoads, availableSettlements } from "../Logic/BoardUtils";

//if the player can build a road
function canBuildRoad(playerState: PlayerState, gameState: GameState, roadLocation: RoadLocation): boolean {
    return playerState.Resources.lumber > 0 && playerState.Resources.brick > 0 && availableRoads(playerState, gameState).length > 0
    && playerState.AvailableAssets.roads > 0
    && availableRoads(playerState, gameState).includes(roadLocation);
}

//if the player can build a settlement
function canBuildSettlement(playerState: PlayerState, gameState: GameState, settleLocation: SettleLocation): boolean {
    return playerState.Resources.lumber > 0 && playerState.Resources.brick > 0 && playerState.Resources.wool > 0 && playerState.Resources.grain > 0
    && availableSettlements(gameState).length > 0 && playerState.AvailableAssets.settlements > 0
    && availableSettlements(gameState).includes(settleLocation);
}

//if the player can build a city
function canBuildCity(playerState: PlayerState, gameState: GameState, settleLocation: SettleLocation): boolean {
    return playerState.Resources.grain > 1 && playerState.Resources.ore > 2 && playerState.AvailableAssets.cities > 0
    && availableSettlements(gameState).includes(settleLocation);
}

//if the player can buy a development card
function canBuyDevelopmentCard(playerState: PlayerState, gameState: GameState): boolean {
    return playerState.Resources.grain > 0 && playerState.Resources.ore > 0 && playerState.Resources.wool > 0
    && gameState.stack.length > 0;
}

//if the player can play a knight card only. no other development cards can be played.
//no refering to strongest army card
function canPlayDevelopmentCard(playerState: PlayerState, gameState: GameState): boolean {
    return playerState.DevelopmentCards.some(card => card.type === 'Knight') && gameState.round > 2;
}
 
// TODO: actual action functions
//function to build a road
export function buildRoad(playerState: PlayerState, gameState: GameState, roadLocation: RoadLocation): void {
    if (canBuildRoad(playerState, gameState, roadLocation)) {
        roadLocation.owner = playerState.id;
        gameState.Table.RoadLocations.push(roadLocation);
        playerState.Roads.push(roadLocation);
        playerState.Resources.lumber--;
        playerState.Resources.brick--;
        playerState.AvailableAssets.roads--;
    }
}

//function to build a settlement
export function buildSettlement(playerState: PlayerState, gameState: GameState, settleLocation: SettleLocation): void {
    if (canBuildSettlement(playerState, gameState, settleLocation)) {
        settleLocation.owner = playerState.id;
        settleLocation.type = 'Settlement';
        gameState.Table.SettleLocations.push(settleLocation);
        playerState.Settlements.push(settleLocation);
        playerState.Resources.lumber--;
        playerState.Resources.brick--;
        playerState.Resources.wool--;
        playerState.Resources.grain--;
        playerState.AvailableAssets.settlements--;
        settleLocation.type = 'Settlement';
    }
}

//function to build a city
export function buildCity(playerState: PlayerState, gameState: GameState, settleLocation: SettleLocation): void {
    if (canBuildCity(playerState, gameState, settleLocation)) {
        settleLocation.owner = playerState.id;
        settleLocation.type = 'City';
        gameState.Table.SettleLocations.push(settleLocation);
        playerState.Cities.push(settleLocation);
        playerState.Resources.grain -= 2;
        playerState.Resources.ore -= 3;
        playerState.AvailableAssets.cities--;
        settleLocation.type = 'City';
    }
}

//function to buy a development card
export function buyDevelopmentCard(playerState: PlayerState, gameState: GameState): void {
    if (canBuyDevelopmentCard(playerState, gameState)) {
        playerState.Resources.grain--;
        playerState.Resources.ore--;
        playerState.Resources.wool--;
        playerState.DevelopmentCards.push(gameState.stack.pop() as DevelopmentCard);
    }
}

// function to play a knight card only
export function playDevelopmentCard(playerState: PlayerState, gameState: GameState, card: DevelopmentCard): void {
    if (canPlayDevelopmentCard(playerState, gameState)) {
        removeKnightCard(playerState);
        playerState.knightsPlayed++;
        if (playerState.knightsPlayed == 3) {
            playerState.SpecialCards.push({ type: 'LargestArmy' } as SpecialCard);
            gameState.scoringTable[playerState.name] += 2;
        }
        //todo: here the player has to choose the new hex for the robber
        gameState.Table.Robber.Hex = { row: 0, col: 0 };
    }
}

// helper function to playdevelopmentcard
function removeKnightCard(playerState: PlayerState): void {
    const knightCardIndex = playerState.DevelopmentCards.findIndex(card => card.type === 'Knight');
    if (knightCardIndex !== -1) {
        playerState.DevelopmentCards.splice(knightCardIndex, 1);
    }
}

//finishStep function
export function finishStep(gameState: GameState): void {
    if (gameState.round === 1) {
        gameState.currentPlayer = (gameState.currentPlayer + 1) % gameState.players.length;
        if (gameState.currentPlayer === 0) {
            gameState.round = 2
        }
    }
    else if (gameState.round === 2) {
        gameState.currentPlayer = (gameState.currentPlayer - 1) % gameState.players.length;
        if (gameState.currentPlayer === 0) {
            gameState.round = 3
        }
    }
    else {
        gameState.currentPlayer = (gameState.currentPlayer + 1) % gameState.players.length;
    }
}