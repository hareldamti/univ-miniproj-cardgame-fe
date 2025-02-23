import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { useAppContext } from '../State/AppState';

import { NavigatorParams } from '../Utils/Navigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { io } from "socket.io-client";
import { useEffect, useState } from 'react';
import { SOCKET_URL } from '../Utils/ClientUtils';
import { SocketTags } from '../package/Consts';
var socket; 
export default function ChooseRoom({ navigation }: NativeStackScreenProps<NavigatorParams, 'ChooseRoom'>) {
  const appState = useAppContext();
  const [msg, setMsg] = useState("");
  
  /// TODO: DELETE
  appState.username = "harel";

  useEffect(() => {
    appState.socketHandler = {
      socket: io(SOCKET_URL, {
        reconnectionAttempts: 3,
        auth: {
          token: appState.username
        },
      })
    };
    //appState.socketHandler.socket.on('connect_error', () => {console.log("Failed to connect to server"); appState.socketHandler.socket.disconnect();})
  
    appState.socketHandler.socket.on(SocketTags.JOIN, (s) => console.log(s));
    appState.socketHandler.socket.on(SocketTags.START, () => {console.log("START"); navigation.navigate('Match')});
    }, []);
  
  return (
    <View style={styles.container}>
      <StatusBar style="auto" hidden/>
      <Text> ChooseRooms {appState.username}</Text>
      <Button
              title="JOIN"
              onPress={() => {
                appState?.socketHandler?.socket.emit(SocketTags.JOIN,"1");
                //appState.username="12"; navigation.navigate('Match');
              }}
      />
      <Button
              title="START"
              onPress={() => {
                appState?.socketHandler?.socket.emit(SocketTags.START);
              }}
      />
      <Text>{msg}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
