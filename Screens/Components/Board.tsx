import { GameActionTypes, GameContextProvider, useGameContext } from '../../State/GameState';
import { Row, Column, Frame } from '../../Utils/CompUtils'
import { Table, Hexagonal, HexType } from '../../package/entities/Models'
import { initializeTable } from '../../package/Logic/Initialization'
import { StyleSheet, View, Text, Button, } from 'react-native';
import Svg, {Path} from 'react-native-svg';

export default () => {
    const {state, dispatch} = useGameContext();
    const table = initializeTable();
    return <Frame>
        {Array.from<[number, Hexagonal[]]>(table.Board.entries()).map(
            row => {
                const [idx, tableRow] = row;
                return <Row span={1}>
                <Column span={Math.abs(3 - idx)}></Column>
                {tableRow.map(tableHex => <Column span={2}><HexagonalComp hexagonal={tableHex}></HexagonalComp> </Column>)}
                <Column span={Math.abs(3 - idx)}></Column>
            </Row>
            }
        )}
    </Frame>
  }


interface HexagonalCompProps {
    hexagonal: Hexagonal
}

const HexagonalComp = (props: HexagonalCompProps) => {
    return <Svg style={{ width: '100%', height: '100%' }} viewBox="400 400 600 600">
        <Path onPress={()=>console.log(props.hexagonal)}
            d="M 666.103 405.572 Q 674 401.012 681.897 405.572 L 764.819 453.446 Q 772.717 458.006 772.717 467.125 L 772.717 562.875 Q 772.717 571.994 764.819 576.554 L 681.897 624.428 Q 674 628.988 666.103 624.428 L 583.181 576.554 Q 575.283 571.994 575.283 562.875 L 575.283 467.125 Q 575.283 458.006 583.181 453.446 Z"
            fill={hexToColor(props.hexagonal.type)}
            stroke="black"
            strokeWidth="2"
        />
    </Svg>
    return <View style={{backgroundColor: hexToColor(props.hexagonal.type), width: "100%", height: "100%"}}></View>
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