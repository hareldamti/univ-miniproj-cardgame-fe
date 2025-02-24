import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, TextInput } from "react-native";
import { useAppContext } from "../State/AppState";

import { NavigatorParams } from "../Utils/Navigator";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { genIntKey, roomColor, styles } from "../Utils/CompUtils";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { SOCKET_URL } from "../Utils/ClientUtils";
import { SocketTags } from "../package/Consts";
var socket;
export default function ChooseRoom({
  navigation,
}: NativeStackScreenProps<NavigatorParams, "ChooseRoom">) {
  const appState = useAppContext();
  const [roomInput, setRoomInput] = useState<string>("");
  const [roomStatus, setRoomStatus] = useState<Record<string, string[]>>({});
  useEffect(() => {
    appState.socketHandler = {
      socket: io(SOCKET_URL, {
        reconnectionAttempts: 3,
        auth: {
          token: appState.username,
        },
      }),
    };
    //appState.socketHandler.socket.on('connect_error', () => {console.log("Failed to connect to server"); appState.socketHandler.socket.disconnect();})

    appState.socketHandler.socket.on(SocketTags.JOIN, (status) =>
      {setRoomStatus(status); {console.log("roomStatus", status);}}
    );
    appState.socketHandler.socket.on(SocketTags.LEAVE, (status) =>
      {setRoomStatus(status); {console.log("roomStatus", status);}}
    );
    appState.socketHandler.socket.on(SocketTags.START, () => {
      navigation.navigate("Match");
    });
  }, []);

  return (
    <View style={styles.container}>
      
      <Text> Hello {appState.username}</Text>
      
      {Object.values(roomStatus).every(users => !users.includes(appState.username)) && <><TextInput
        style={styles.input}
        onChangeText={setRoomInput}
        value={roomInput}
      />
      <Button
        title="Join room"
        onPress={() => {
          roomInput.length > 0 &&
            appState?.socketHandler?.socket.emit(SocketTags.JOIN, roomInput);
          //appState.username="12"; navigation.navigate('Match');
        }}
      /></>}
      {Object.entries(roomStatus).map((entry) => {
        const [room, users] = entry;
        
        return (
          <View key={genIntKey()} style={{
            backgroundColor: room === "NO_ROOM" ? "white" : roomColor,
            borderRadius: '1rem',
            padding: '1rem',
            margin: '1rem',
            width: '10rem'
            }}>
            <Text style={styles.textHeader}>Room: {room}</Text>
            {users.map((user) => (
              <Text key={genIntKey()}>{user}</Text>
            ))}
            {users.includes(appState.username) && (
              <>
                <Button
                  title="Start game"
                  onPress={() => {
                    appState?.socketHandler?.socket.emit(SocketTags.START);
                  }}
                />
                <Button
                  title="Leave room"
                  onPress={() => {
                    appState?.socketHandler?.socket.emit(SocketTags.LEAVE, room);
                  }}
                />
              </>
            )}
            {!users.includes(appState.username) && (
              <>
                <Button
                  title="Join room"
                  onPress={() => {
                    appState?.socketHandler?.socket.emit(SocketTags.JOIN, room);
                  }}
                />
              </>
            )}
          </View>
        );
      })}
    </View>
  );
}
