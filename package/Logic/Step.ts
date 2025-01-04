import { Coords, DevelopmentCard, Hexagonal, HexType, RoadLocation, Robber, SettleLocation, Table } from "../entities/Models";
import { GameState, PlayerState } from "../entities/State";
import { availableRoads, availableSettlements } from "./BoardUtils";

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
 
// TODO: actual action functions