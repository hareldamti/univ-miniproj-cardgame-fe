import { GameActionTypes, useGameContext } from '../../State/GameState';
import { genIntKey, PressableSvg } from '../../Utils/CompUtils'
import { Coords, EdgeLocation, Hexagonal, HexType, NodeLocation } from '../../package/entities/Models'
import { StyleSheet, View, Text, Button, } from 'react-native';
import Svg, {Path} from 'react-native-svg';
import { City, Road, Settlement } from './Structures';
import { availableStuctureColor, colorByPlayer } from '../../Utils/DesignUtils';
import { useAppContext } from '../../State/AppState';
import { useMemo, useState } from 'react';
import { availableRoads, availableStructures } from '../../package/Logic/BoardLogic';
import { createEdge, createNode, isEdgeLegal } from '../../package/Logic/BoardUtils';

export default () => {
    const {gameState, dispatch} = useGameContext();
    const appState = useAppContext();
    const available = {
        Structures: useMemo(() => {return availableStructures(gameState.players[gameState.user.playerIdx], gameState)}, [gameState.players, gameState.user.availableVisible]),
        Roads: useMemo(() => {return availableRoads(gameState.players[gameState.user.playerIdx], gameState)}, [gameState.players, gameState.user.availableVisible])
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
                                    
                                    // for debugging:
                                    onPress={ () =>
                                        setHex(hex => {
                                            let updated = [...hex, {row: rowIdx, col: colIdx}];
                                            if (updated.length == 2) {
                                                let newEdge = createEdge(updated.splice(0) as [Coords, Coords], gameState.user.playerIdx);
                                                if (isEdgeLegal(newEdge)) dispatch([{type: GameActionTypes.AddRoad, payload: {playerId: gameState.user.playerIdx, location: newEdge}}]);
                                            }
                                            //if (updated.length == 3) dispatch({type: GameActionTypes.AddSettlement, payload: {playerId: gameState.user.playerIdx, location: {adjHex: updated.splice(0) as [Coords, Coords, Coords], owner: gameState.user.playerIdx}}})
                                            //if (updated.length == 3) dispatch({type: GameActionTypes.AddCity, payload: {playerId: gameState.user.playerIdx, location: {adjHex: updated.splice(0) as [Coords, Coords, Coords], owner: gameState.user.playerIdx}}})
                                            return updated;})
                                    }

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
                return <Settlement key={genIntKey()} color={colorByPlayer(settlement.owner)} x={x} y={y} scale={0.5}/>
            })
        }
        {   
            gameState.Table.Cities.map(city => {
                let [x, y] = NodeCoords(city);
                return <City key={genIntKey()} color={colorByPlayer(city.owner)} x={x} y={y} scale={0.5}/>
            })
        }

        {   // Available
            gameState.user.availableVisible === 'Roads' && 
            available.Roads.map(road => {
                let [x, y, theta] = EdgeCoords(road);
                return <Road key={genIntKey()} color={availableStuctureColor} x={x} y={y} theta={theta}/>
            })
        }
        {   
            gameState.user.availableVisible === 'Cities' && 
            available.Structures.map(city => {
                let [x, y] = NodeCoords(city);
                return <City key={genIntKey()} color={availableStuctureColor} x={x} y={y} scale={0.5}/>
            })
        }
        {   gameState.user.availableVisible === 'Settlements' && 
            available.Structures.map(settlement => {
                let [x, y] = NodeCoords(settlement);
                return <Settlement key={genIntKey()} color={availableStuctureColor} x={x} y={y} scale={0.5}/>
            })
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
}

const HexagonalComp = (props: HexagonalCompProps) => {
    return <Path onPress={props.onPress}
            d="M-3.9485-52.214q3.9485-2.28 7.897 0l41.461 23.937q3.949 2.28 3.949 6.8395v47.875q0 4.5595-3.949 6.8395L3.9485 57.214q-3.9485 2.28-7.897 0l-41.461-23.937q-3.949-2.28-3.949-6.8395v-47.875q0-4.5595 3.949-6.8395Z"
            fill={hexToColor(props.hexagonal.type)}
            stroke="black"
            strokeWidth="2"
            transform={`translate(${props.x} ${props.y})`}
        />
}

const hexToColor = (h: HexType) => {
    switch (h) {
        case HexType.Desert:
            return "red";
        case HexType.Forest:
            return "green";
        case HexType.Hill:
            return "grey";
        case HexType.Mountain:
            return "blue";
        case HexType.Field:
            return "yellow";
        case HexType.Sea:
            return "cyan";
        case HexType.Pasture:
            return "purple";
    }
};