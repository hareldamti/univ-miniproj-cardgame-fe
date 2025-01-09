import { GameActionTypes, GameContextProvider, useGameContext } from '../../State/GameState';
import { Row, Column, Frame, genIntKey } from '../../Utils/CompUtils'
import { Table, Hexagonal, HexType } from '../../package/entities/Models'
import { initializeTable } from '../../package/Logic/Initialization'
import { StyleSheet, View, Text, Button, } from 'react-native';
import Svg, {Path} from 'react-native-svg';

export default () => {
    const {state, dispatch} = useGameContext();
    const table = initializeTable();
    return <Svg style={{ width: '100%', height: '100%' }} viewBox="0 0 600 640">
        {
            Array.from<[number, Hexagonal[]]>(table.Board.entries()).map(row => { const [rowIdx, tableRow] = row;
                    return Array.from<[number, Hexagonal]>(tableRow.entries()).map(row => { const [colIdx, tableHex] = row; const [x, y] = hexCoords(rowIdx, colIdx); return <HexagonalComp key={genIntKey()} hexagonal={tableHex} x={x} y={y} /> } )
                }
            ).flat(1)
        }
        {
        }
    </Svg>
  }

// const playerIdToColor

const hexCoords = (rowIdx: number, colIdx: number) => [Math.abs(rowIdx - 3) * 50.0 + colIdx * 100, rowIdx * 85.0 + 60];

interface HexagonalCompProps {
    hexagonal: Hexagonal,
    x: number,
    y: number
}

const HexagonalComp = (props: HexagonalCompProps) => {
    return <Path onPress={()=>console.log(`${props.x} ${props.y}`)}
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