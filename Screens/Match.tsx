import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Row, Column, Frame } from '../Utils/CompUtils'
import { GameContextProvider, useGameContext } from '../State/GameState';
import { initializeGame } from '../package/Logic/Initialization';

import Board from "./Components/Board";
import ScoringTable from './Components/ScoringTable';
import Structures, { Structure } from './Components/Structures';
import Resources from './Components/Resources';
import Trade from './Components/Trade';

import React from 'react';
import { useAppContext } from '../State/AppState';
import { io, Socket } from 'socket.io-client';
import { emitAction, SOCKET_URL } from '../Utils/ClientUtils';
import { availableRoads } from '../package/Logic/BoardLogic';
import { GameActionTypes, validateActions } from '../package/Entities/GameActions';
import { PlayerActionType } from '../package/Entities/PlayerActions';
import { SocketTags } from '../package/Consts';



export default function Match() {
  const [availableVisible, setAvailableVisible] = useState<Structure | null>();
  const [tradeOpen, setTradeOpen] = useState<boolean>(false);
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
  },[]);
  return (
    <GameContextProvider initialState={initializeGame([])}>
    <ServerLogic/>
    <View style={styles.container}>
      <Trade tradeOpen={tradeOpen} setTradeOpen={setTradeOpen}/>
      <Row span={1} border={2}>
        <ScoringTable/>
      </Row>
      <Row span={10}>
        <Board availableVisible={availableVisible}/>
      </Row>
      <Row span={1.5} border={2}>
          <Structures setAvailableVisible={setAvailableVisible}/>  
      </Row>
      <Row span={1.5} border={2}>
        <Column span={5}>
          <Resources/>
        </Column>
        </Row>
      <Row span={1.5} border={2}>
        <Column span={1}>
          <Exit/>
        </Column>
        <Column span={1}>
          <VoiceChat/>
        </Column>
        <Column span={1}>
          <DevelopmentCard/>
        </Column>
        <Column span={1}>
          <TradeButton setTradeOpen={setTradeOpen}/>
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
    appState.socketHandler?.socket.on(SocketTags.UPDATE, updateActions => {
      validateActions(updateActions) && dispatch(updateActions);
      console.log("UPDATE", updateActions)
    });
    appState.socketHandler?.socket.on(SocketTags.INIT, initAction => {  
      validateActions([initAction]) && dispatch([initAction]);
    });
    appState.socketHandler?.socket.emit(SocketTags.INIT);
  }, []);
  return <></>
}

const ActionButton = ({title, onPress, color=null}) => {
  return <Button
    color={color}
    title={title}
    onPress={onPress}
  />
}

const Exit = () => {
  return <ActionButton
    title={"Exit\nGame"}
    onPress={()=>console.log("menu")}
    color="black"
  />
}

const VoiceChat = () => {
  return <ActionButton
    title={"Voice\nChat"}
    onPress={()=>console.log("menu")}
    color="red"
  />
}

const DevelopmentCard = () => {
  return <ActionButton
    title={"Dev\nCards"}
    onPress={()=>console.log("dev card")}
  />
}

const TradeButton = (props: {setTradeOpen: React.Dispatch<React.SetStateAction<boolean>>}) => {
  return <ActionButton
    title={"Open\nTrade"}
    onPress={() => props.setTradeOpen(curr => !curr)}
  />
}

const FinishStep = () => {
  const appState = useAppContext();
    return <ActionButton
    title={"Finish\nStep"}
    onPress={()=> {
      emitAction(appState, {type: PlayerActionType.FinishStep});
    }}
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
