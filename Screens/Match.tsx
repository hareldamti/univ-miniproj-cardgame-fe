import { useEffect, useMemo } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Row, Column, Frame } from '../Utils/CompUtils'

import { GameContextProvider, useGameContext } from '../State/GameState';
import { initializeGame } from '../package/Logic/Initialization';

import Board from "./Components/Board";
import ScoringTable from './Components/ScoringTable';
import Sidebar from './Components/Structures';
import React from 'react';
import { useAppContext } from '../State/AppState';
import { io, Socket } from 'socket.io-client';
import { SOCKET_TAG_INIT, SOCKET_TAG_UPDATE, SOCKET_URL } from '../Utils/EnvConstsUtils';

export default function Match() {
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    // fetch -> initial gameState
  },[]);
  
  return (
    <GameContextProvider initialState={initializeGame(['a'])}>
    <ServerLogic/>
    <View style={styles.container}>
      <Row span={1}>
        <ScoringTable/>
      </Row>
      <Row span={10}>
        <Column span={5}>
          <Board/>
        </Column>
        <Column span={1}>
          <Sidebar/>  
        </Column>
      </Row>
      <Row span={1.5}>
        <Column span={1}>
          <Menu/>
        </Column>
        <Column span={5}>
          <Resources data={1}/>
        </Column>
        <Column span={1}>
          <DevelopmentCard/>
        </Column>
        <Column span={1}>
          <Trade/>
        </Column>
        <Column span={1}>
          <FinishStep/>
        </Column>
      </Row>
    </View>

    </GameContextProvider>
  );
}

const ServerLogic = () => {
  const {gameState, dispatch} = useGameContext();
  const appState = useAppContext();
  // useEffect(() => {
  //   appState.socketHandler = {
  //     socket: io(SOCKET_URL, {
  //     })
  //   };
  //   appState.socketHandler.socket.on(SOCKET_TAG_UPDATE, updateAction => dispatch(updateAction));
  //   appState.socketHandler.socket.on(SOCKET_TAG_INIT, initAction => {
  //     dispatch(initAction);
  //     gameState.user.playerIdx = gameState.players.findIndex(player => player.username == appState.username);
  //   });
  // }
  // , []);
  return <></>
}

const ActionButton = ({title, onPress}) => {
  return <Button
    title={title}
    onPress={onPress}
  />
}

const Menu = () => <Frame/>

interface ResourcesProps { data: number };
const Resources = (props: ResourcesProps) => {
  const {gameState, dispatch} = useGameContext();
  return <Frame><Text>show {gameState.user.availableVisible}</Text></Frame>
}

const DevelopmentCard = () => {
  return <ActionButton
    title={"Development\nCard"}
    onPress={()=>console.log("dev card")}
  />
}

const Trade = () => {
  return <ActionButton
    title={"Trade"}
    onPress={()=>console.log("trade")}
  />
}

const FinishStep = () => {
  // TODO: Delete
  // const {gameState, dispatch} = useGameContext();
  // const appState = useAppContext();
  // return <Button title="Add city" onPress={()=>{
  //   dispatch({
  //   type: GameActionTypes.AddRoad,
  //   payload: {
  //     playerId: 0,
  //     location: {adjHex: ([...appState.utils.coords.splice(appState.utils.coords.length - 2)] as [Coords, Coords])}
  //   }});
  // }}/>
  return <ActionButton
    title={"Finish\nStep"}
    onPress={()=>console.log("finish")}
  />
}




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
