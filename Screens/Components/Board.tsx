import { useGameContext } from '../../State/GameState';
import { availableStuctureColor, colorByPlayer, genIntKey, hexagonalToColor, markedHexColor, PressableSvg } from '../../Utils/CompUtils'
import { Coords, EdgeLocation, Hexagonal, HexType, NodeLocation } from '../../package/Entities/Models'
import { StyleSheet, View, Button, } from 'react-native';
import Svg, {Path, G, Circle, Text} from 'react-native-svg';
import { City, Dice, Road, Settlement } from './Structures';
import { useAppContext } from '../../State/AppState';
import { useMemo, useState } from 'react';
import { availableRoads, availableStructures } from '../../package/Logic/BoardLogic';
import { createEdge, createNode, isEdgeLegal } from '../../package/Logic/BoardUtils';
import { GameActionTypes } from '../../package/Entities/GameActions';
import { SocketTags } from '../../package/Consts';
import { PlayerActionType } from '../../package/Entities/PlayerActions';
import { getCurrentPlayer, getRound } from '../../package/Entities/State';
import { canBuy, cityCost, roadCost, settlementCost } from '../../package/Logic/GameUtils';

export default () => {
    const {gameState, dispatch} = useGameContext();
    const appState = useAppContext();
    const available = {
        Structures: useMemo(() => {
            return availableStructures(gameState.user.playerId, gameState)}, [gameState.Table.Settlements, gameState.Table.Cities, gameState.user.availableVisible]),
        Roads: useMemo(() => {
            return availableRoads(gameState.user.playerId, gameState)}, [gameState.Table.Roads, gameState.user.availableVisible]),
        canBuyCity: useMemo(() => {
            return canBuy(gameState, gameState.user.playerId, cityCost);
        }, [gameState.players]),
        canBuySettlement: useMemo(() => {
            return canBuy(gameState, gameState.user.playerId, settlementCost);
        }, [gameState.players]),
        canBuyRoad: useMemo(() => {
            return canBuy(gameState, gameState.user.playerId, roadCost);
        }, [gameState.players])
    }

    // for debugging:
    const [hex, setHex] = useState<Coords[]>([]);
    //

    return <Svg style={{ width: '100%', height: '100%' }} viewBox="0 0 600 640">
        {   // Hexagonals
            Array.from<[number, Hexagonal[]]>(gameState.Table.Board.entries()).map(row => { const [rowIdx, tableRow] = row;
                    return Array.from<[number, Hexagonal]>(tableRow.entries()).map(col => {
                        const [colIdx, tableHex] = col;
                        const [x, y] = hexCoords(rowIdx, colIdx);
                        return <HexagonalComp
                                    key={genIntKey()}
                                    hexagonal={tableHex}
                                    x={x}
                                    y={y}
                                    isMarked={gameState.lastDice && gameState.lastDice[0] + gameState.lastDice[1] == tableHex.nuOfPoints}
                                /> } )
                }
            ).flat(1)
        }
        
        {   // Existing
            gameState.Table.Roads.map(road => {
                let [x, y, theta] = EdgeCoords(road);
                return <Road key={genIntKey()} color={colorByPlayer(road.owner)} x={x} y={y} theta={theta}/>
            })
            
        }
        {
            gameState.Table.Settlements.map(settlement => {
                let [x, y] = NodeCoords(settlement);
                return <Settlement key={genIntKey()} color={colorByPlayer(settlement.owner)} x={x} y={y}/>
            })
        }
        {   
            gameState.Table.Cities.map(city => {
                let [x, y] = NodeCoords(city);
                return <City key={genIntKey()} color={colorByPlayer(city.owner)} x={x} y={y}/>
            })
        }

        {   // Available
            ((available.canBuyRoad && gameState.user.availableVisible === 'Roads') || (getCurrentPlayer(gameState) == gameState.user.playerId && (getRound(gameState) == 0 || getRound(gameState) == 3))) && 
            available.Roads.map(road => {
                let [x, y, theta] = EdgeCoords(road);
                return <Road key={genIntKey()} color={availableStuctureColor} x={x} y={y} theta={theta}
                        onPress={() => appState.socketHandler?.socket.emit(SocketTags.ACTION,
                            { type: PlayerActionType.BuildRoad, road })}/>
            })
        }
        {   
            (available.canBuyCity && gameState.user.availableVisible === 'Cities') && 
            available.Structures.map(city => {
                let [x, y] = NodeCoords(city);
                return <City key={genIntKey()} color={availableStuctureColor} x={x} y={y}
                onPress={() => appState.socketHandler?.socket.emit(SocketTags.ACTION,
                    { type: PlayerActionType.BuildCity, city })}/>
            })
        }
        {   ((available.canBuySettlement && gameState.user.availableVisible === 'Settlements') || (getCurrentPlayer(gameState) == gameState.user.playerId && (getRound(gameState) == 1 || getRound(gameState) == 2))) && 
            available.Structures.map(settlement => {
                let [x, y] = NodeCoords(settlement);
                return <Settlement key={genIntKey()} color={availableStuctureColor} x={x} y={y}
                onPress={() => appState.socketHandler?.socket.emit(SocketTags.ACTION,
                    { type: PlayerActionType.BuildSettlement, settlement })}/>
            })
        }
        {
            gameState.lastDice &&
            <G>
                <Dice x={600} y={500} theta={-10} number={gameState.lastDice[0]}/>
                <Dice x={670} y={500} theta={20} number={gameState.lastDice[1]}/>
            </G>
        }
    </Svg>
  }

// const playerIdToColor

const hexCoords = (rowIdx: number, colIdx: number) => [Math.abs(rowIdx - 3) * 50.0 + colIdx * 100, rowIdx * 85.0 + 60];
const NodeCoords = (n: NodeLocation) => {
    let points = n.adjHex.map(coords => hexCoords(coords.row, coords.col));
    return [points.map(p => p[0]).reduce((a, b) => a + b, 0) / 3, points.map(p => p[1]).reduce((a, b) => a + b, 0) / 3]
}
const EdgeCoords = (n: EdgeLocation) => {
    let points = n.adjHex.map(coords => hexCoords(coords.row, coords.col));
    if (n.adjHex[0].row > n.adjHex[1].row) n.adjHex = [n.adjHex[1], n.adjHex[0]];
    let d1 = n.adjHex[1].row - n.adjHex[0].row, d2 = n.adjHex[1].col - n.adjHex[0].col + ((n.adjHex[1].row > 3) ? 1 : 0), theta = d1 == 0 ? 0 : d2 == 0 ? -1 : 1;
    return [
        points.map(p => p[0]).reduce((a, b) => a + b, 0) / 2,
        points.map(p => p[1]).reduce((a, b) => a + b, 0) / 2, 
        theta * 60
    ]
}

interface HexagonalCompProps extends PressableSvg {
    hexagonal: Hexagonal,
    isMarked: boolean
}

const HexagonalComp = (props: HexagonalCompProps) => {
    return <G onPress={props.onPress} transform={`translate(${props.x} ${props.y})`}>
            <Path
                d="M-3.9485-52.214q3.9485-2.28 7.897 0l41.461 23.937q3.949 2.28 3.949 6.8395v47.875q0 4.5595-3.949 6.8395L3.9485 57.214q-3.9485 2.28-7.897 0l-41.461-23.937q-3.949-2.28-3.949-6.8395v-47.875q0-4.5595 3.949-6.8395Z"
                fill={hexagonalToColor(props.hexagonal.type)}
                stroke="black"
                strokeWidth="2"
            />
            {props.hexagonal.nuOfPoints && <><Circle cx={0} cy={0} r={20} fill={props.isMarked ? markedHexColor : "white"} stroke="black" strokeWidth="2"/>
            <Text x={0} y={0} textAnchor="middle" alignmentBaseline="middle" pointerEvents="none" fontFamily='fantasy'>{props.hexagonal.nuOfPoints}</Text></>}
        </G>
}

