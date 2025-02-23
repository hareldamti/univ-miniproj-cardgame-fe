import { useEffect, useMemo } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Row, Column, Frame } from '../Utils/CompUtils'
import { GameContextProvider, useGameContext } from '../State/GameState';
import { initializeGame } from '../package/Logic/Initialization';

import Board from "./Components/Board";
import ScoringTable from './Components/ScoringTable';
import Structures from './Components/Structures';
import Resources from './Components/Resources';
import Trade from './Components/Trade';

import React from 'react';
import { useAppContext } from '../State/AppState';
import { io, Socket } from 'socket.io-client';
import { emitAction, SOCKET_URL } from '../Utils/ClientUtils';
import { availableRoads } from '../package/Logic/BoardLogic';
import { validateActions } from '../package/Entities/GameActions';
import { PlayerActionType } from '../package/Entities/PlayerActions';
import { SocketTags } from '../package/Consts';



export default function Match() {
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
  },[]);
  return (
    <GameContextProvider initialState={initializeGame([])}>
    <ServerLogic/>
    <View style={styles.container}>
      <Row span={1}>
        <ScoringTable/>
      </Row>
      <Row span={10}>
        <Column span={1}>
          <Structures/>  
        </Column>
        <Column span={5}>
          <Board/>
        </Column>
      </Row>
      <Row span={1.5}>
        <Column span={1}>
          <Menu/>
        </Column>
        <Column span={5}>
          <Resources/>
        </Column>
        <Column span={1}>
          <DevelopmentCard/>
        </Column>
        <Column span={1}>
          <TradeButton/>
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
  useEffect(() => {
    appState.socketHandler?.socket.on(SocketTags.UPDATE, updateActions => validateActions(updateActions) && dispatch(updateActions));
    appState.socketHandler?.socket.on(SocketTags.INIT, initAction => {
      console.log("before", gameState, initAction);
      validateActions([initAction]) && dispatch([initAction]);
      console.log("after", gameState);
      gameState.user.playerIdx = gameState.players.findIndex(player => player.username === appState.username);
    });
    appState.socketHandler?.socket.emit(SocketTags.INIT);
  }, []);
  return <></>
}

const ActionButton = ({title, onPress}) => {
  return <Button
    title={title}
    onPress={onPress}
  />
}

const Menu = () => {
  return <ActionButton
    title={"Menu"}
    onPress={()=>console.log("menu")}
  />
}

const DevelopmentCard = () => {
  return <ActionButton
    title={"Development\nCard"}
    onPress={()=>console.log("dev card")}
  />
}

const TradeButton = () => {
  return <ActionButton
    title={"Trade"}
    onPress={()=>console.log("trade")}
  />
}

const FinishStep = () => {
  const appState = useAppContext();
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
    title={"Finish Step"}
    onPress={()=> emitAction(appState, {type: PlayerActionType.FinishStep})}
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
