import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { PropsWithChildren } from 'react'
import { createContext, useContext, useState } from 'react';
import { GameState, Table, PlayerState } from '../package/entities/State';

export const GameContext = createContext<GameState | null>(null);

export const useAppContext = (): GameState => {
    const context = useContext(GameContext);
    if (!context) {
      throw new Error('useGameContext');
    }
    return context;
};

export default function Match() {
  ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
  const scores = 0, board = 0, availableStructures = 0, resources = 0;
  const initialGame: GameState = {
    Table: {},
    scoringTable: ScoringTable,
    players: PlayerState[],
  };

  return (
    <GameContext.Provider value={initialGame}>
    <View style={styles.container}>
      <Row span={1}>
        <Column span={1}><ScoringTable data={scores}/></Column>
      </Row>

      <Row span={5}>
        <Column span={6}>
          <Board data={board}/>
        </Column>
        <Column span={1}>
          <Structures data={availableStructures}/>
        </Column>
      </Row>

      <Row span={1}>
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
    </GameContext.Provider>
  );
}


interface ScoringTableProps { data: number };
const ScoringTable = (props: ScoringTableProps) => <Frame/>

interface BoardProps { data: number };
const Board = (props: BoardProps) => <Frame/>

interface StructuresProps { data: number };
const Structures = (props: StructuresProps) => <Frame/>

const Menu = () => <Frame/>

interface ResourcesProps { data: number };
const Resources = (props: ResourcesProps) => <Frame/>

const DevelopmentCard = () => <Frame/>

const Trade = () => <Frame/>

const Dice = () => <Frame/>


interface Span {
  span: number
}

const Row = (props: PropsWithChildren<Span>): React.JSX.Element =>
  <View style={{...styles.row, ...{flex: props.span}}} >{props.children}</View>

const Column = (props: PropsWithChildren<Span>): React.JSX.Element =>
<View style={{...styles.col, ...{flex: props.span}}} >{props.children}</View>

const Frame = () => <View style={styles.frame}></View>


const Circle = (props: any): React.JSX.Element => {
  return <View style={{...styles.circle, ...props}} />;
};
const Rect = (props: any): React.JSX.Element => {
  return <View style={{...styles.rectangle, ...props}} />;
};

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
  row: {flexDirection: 'row', width:'100%', display: 'flex', paddingVertical: 5},
  col: {display: 'flex', height:'100%', paddingHorizontal: 5},
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
