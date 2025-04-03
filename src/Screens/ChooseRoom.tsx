
import { useAppContext } from "../State/AppState";

import { genIntKey, roomColor, Row, styles, View, Text, TextInput, ActionButton } from "../Utils/CompUtils";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { SOCKET_URL } from "../Utils/ClientUtils";
import { SocketTags } from "../package/Consts";
import { useNavigate } from "react-router-dom";

export default function ChooseRoom() {
  const appState = useAppContext();
  const [roomInput, setRoomInput] = useState<string>("");
  const [roomStatus, setRoomStatus] = useState<Record<string, string[]>>({});
  const navigate = useNavigate();
  useEffect(() => {
    if (!appState.username) navigate("/");
    appState.socketHandler = {
      socket: io(SOCKET_URL, {
        reconnectionAttempts: 3,
        auth: {
          token: appState.username,
        },
      }),
    };
    appState.socketHandler.socket.on('connect_error', () => {console.log("Failed to connect to server"); appState.socketHandler?.socket.disconnect();})

    appState.socketHandler.socket.on(SocketTags.JOIN, (status: Record<string, string[]>) =>
      {setRoomStatus(status); {console.log("roomStatus", status);}}
    );
    appState.socketHandler.socket.on(SocketTags.LEAVE, (status: Record<string, string[]>) =>
      {setRoomStatus(status); {console.log("roomStatus", status);}}
    );
    appState.socketHandler.socket.on(SocketTags.START, () => {
      navigate("/match");
    });
  }, []);

  return (
    <View style={styles.container}>
      <Row></Row>
      <Row>
      <Text style={{...styles.textBoldHeader, color: 'black'}}>Lobby</Text>
      </Row>
      <Row>
      <Text style={styles.text}> Hello {appState.username}</Text>
      </Row>
      
      {Object.values(roomStatus).every(users => !users.includes(appState.username ?? "")) && <>
      <Row>
        <TextInput
        style={styles.input}
        onChangeText={setRoomInput}
        value={roomInput}
      /><ActionButton
      title="Create / join room"
      onPress={() => {
        roomInput.length > 0 &&
          appState?.socketHandler?.socket.emit(SocketTags.JOIN, roomInput);
      }}
    /></Row>
    
      <Row><Text style={styles.text}> Active rooms: </Text></Row>
      </>}
      <Row span={3}>{Object.entries(roomStatus).map((entry) => {
        const [room, users] = entry;
        
        return (
          <View key={genIntKey()} style={{
            backgroundColor: room === "NO_ROOM" ? "white" : roomColor,
            borderRadius: '1rem',
            padding: '1rem',
            margin: '1rem',
            width: '10rem'
            }}>
            <Text style={styles.textHeader}>{room}</Text>
            {users.map((user) => (
              <Text style={styles.text} key={genIntKey()}>{user}</Text>
            ))}
            {users.includes(appState.username ?? "") && (
              <>
                <ActionButton
                  title="Start game"
                  onPress={() => {
                    appState?.socketHandler?.socket.emit(SocketTags.START);
                  }}
                />
                <ActionButton
                  title="Leave room"
                  onPress={() => {
                    appState?.socketHandler?.socket.emit(SocketTags.LEAVE, room);
                  }}
                />
              </>
            )}
            {Object.values(roomStatus).every(users => !users.includes(appState.username ?? "")) && (
              <>
                <ActionButton
                  title="Join room"
                  onPress={() => {
                    appState?.socketHandler?.socket.emit(SocketTags.JOIN, room);
                  }}
                />
              </>
            )}
          </View>
        );
      })}</Row>

    </View>
  );
}
