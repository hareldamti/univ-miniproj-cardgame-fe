import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { useAppContext } from '../State/AppState';

import { NavigatorParams } from '../Utils/Navigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { io } from "socket.io-client";
import { useEffect, useState } from 'react';
var socket; 
export default function ChooseRoom({ navigation }: NativeStackScreenProps<NavigatorParams, 'ChooseRoom'>) {
  const appState = useAppContext();
  const [msg, setMsg] = useState("");
  console.log("rendering");
  useEffect(() => {
    socket = io("ws://localhost:3000", {
    });
    socket?.on('test', res => setMsg(msg => msg + res));
  }, []);
  
  return (
    <View style={styles.container}>
      <StatusBar style="auto" hidden/>
      <Text> ChooseRooms {appState.username}</Text>
      <Button
              title="Login"
              onPress={() => { appState.username="12"; navigation.navigate('Match');}}
      />
      <Text>{msg}</Text>
      <Button
              title="Send test"
              onPress={() => {
                socket?.emit('test', {msg: "\n123456"});
              }}
      />
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
