import { useEffect, useMemo, useState } from 'react';

import { Row, Column, Text, ActionButton, View, styles } from '../Utils/CompUtils'
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
import { VoiceChat } from './VoiceChat';
import { useNavigate } from 'react-router-dom';
import Development from './Components/Development';

export default function Match() {
  const [availableVisible, setAvailableVisible] = useState<Structure | null>(null);
  const [tradeOpen, setTradeOpen] = useState<boolean>(false);
  const [developmentOpen, setDevelopmentOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const appState = useAppContext();
  useEffect(() => {
    if (!appState.username) navigate("/");
  },[]);
  return (
    <GameContextProvider initialState={initializeGame([])}>
    <ServerLogic/>
    <View style={styles.container}>
      <Trade tradeOpen={tradeOpen} setTradeOpen={setTradeOpen}/>
      <Development developmentOpen={developmentOpen} setDevelopmentOpen={setDevelopmentOpen}/>
      <GameEnded/>
      <Row span={1} border={2}>
        <ScoringTable/>
      </Row>
      <Row span={10}>
      <Column><Board availableVisible={availableVisible}/></Column>
      </Row>
      <Row span={1.5} border={2}>
          <Column><Row><Structures setAvailableVisible={setAvailableVisible}/></Row></Column>
      </Row>
      <Row span={1.5} border={2}>
        <Column span={5}>
          <Resources/>
        </Column>
        </Row>
      <Row span={1.5} border={2}>
        <Column span={1}>
          <Quit/>
        </Column>
        <Column span={1}>
          <VoiceChat/>
        </Column>
        <Column span={1}>
          <DevelopmentButton setDevelopmentOpen={setDevelopmentOpen}/>
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
      console.log("INIT", initAction);
    });
    appState.socketHandler?.socket.emit(SocketTags.INIT);
  }, []);
  return <></>
}

const GameEnded = () => {
  const {gameState, dispatch} = useGameContext();
  const appState = useAppContext();
  const navigate = useNavigate();
  if (gameState.turn != -1) return <></>;
  return <View style={styles.floatingTradeWindow}>
    <Column>
    <Row span={1}><Text style={styles.textBoldHeader}>Game ended!</Text></Row>
    { gameState.winnerId !== undefined && <Row span={1}><Text style={styles.textHeader}>The winner is {gameState.players[gameState.winnerId].username} 🎉</Text></Row>}
    { gameState.quitterId !== undefined && <Row span={1}><Text style={styles.textHeader}>{gameState.players[gameState.quitterId].username} quit 👎</Text></Row>}
    <Row span={1}><ActionButton title={"Back to\nlobby"} onPress={()=>{
      appState.page="lobby";
      navigate("/lobby");
      }}/></Row>
    </Column>
  </View>
}

const Quit = () => {
  const appState = useAppContext();
  return <ActionButton
    full
    title={"Quit\nGame"}
    onPress={() => appState.socketHandler?.socket.emit(SocketTags.ACTION, { type: PlayerActionType.Quit })}
    color="black"
  />
}



const DevelopmentButton = (props: {setDevelopmentOpen: React.Dispatch<React.SetStateAction<boolean>>}) => {
  return <ActionButton
    full
    title={"Dev\nCards"}
    onPress={() => props.setDevelopmentOpen(curr => !curr)}
  />
}

const TradeButton = (props: {setTradeOpen: React.Dispatch<React.SetStateAction<boolean>>}) => {
  return <ActionButton
    full
    title={"Trade\nPanel"}
    onPress={() => props.setTradeOpen(curr => !curr)}
  />
}

const FinishStep = () => {
  const appState = useAppContext();
    return <ActionButton
    full
    title={"Finish\nStep"}
    onPress={()=> {
      emitAction(appState, {type: PlayerActionType.FinishStep});
    }}
  />
}
