import { useEffect } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import Svg, { Rect, Circle, SvgUri } from 'react-native-svg';
// import Card from '../assets/Svg/card.svg';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Row, Column, Frame } from '../Utils/CompUtils'

import { GameActionTypes, GameContextProvider, useGameContext } from '../State/GameState';
import { initializeGame } from '../package/Logic/Initialization';

import Board from "./Components/Board";

export default function Match() {
  useEffect(()=>{ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)},[]);
  const scores = 0, board = 0, availableStructures = 0, resources = 0;

  return (
    <GameContextProvider initialState={initializeGame(["a","b"])}>
    <View style={styles.container}>
      <Row span={1}>
        <Column span={1}><ScoringTable data={scores}/></Column>
      </Row>
      <Row span={10}>
        <Column span={5}>
          <Board/>
        </Column>
        <Column span={1}>
          <Structures data={availableStructures}/>
        </Column>
      </Row>
      <Row span={1.5}>
        <Column span={1}>
          <Menu/>
        </Column>
        <Column span={5}>
          <Resources data={resources}/>
        </Column>
        <Column span={1}>
          <DevelopmentCard/>
        </Column>
        <Column span={1}>
          <Trade/>
        </Column>
        <Column span={1}>
          <Dice/>
        </Column>
      </Row>
    </View>
    </GameContextProvider>
  );
}


interface ScoringTableProps { data: number };
const ScoringTable = (props: ScoringTableProps) => {
  const {state, dispatch} = useGameContext();
  return <Frame>
    <Text>{state.players.map(p=>p.name).join(" ")}</Text>
  </Frame>
}


interface StructuresProps { data: number };
const Structures = (props: StructuresProps) => <Frame/>

const Menu = () => <Frame/>

interface ResourcesProps { data: number };
const Resources = (props: ResourcesProps) => <Frame/>

const DevelopmentCard = () => <Frame/>

const Trade = () => <Frame/>

const Dice = () => <Frame/>




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: "auto",
    width: '100%',
    height: '100%'
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: '50%',
    backgroundColor: "red",
  },
  rectangle: {
    width: 100 * 2,
    height: 100,
    backgroundColor: "red",
  },
  frame: {
    display: 'flex',
    borderColor: "black",
    width:'100%',
    height: '100%',
    borderWidth: 1,
  }

});
