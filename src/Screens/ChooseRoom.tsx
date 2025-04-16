
import { useAppContext } from "../State/AppState";

import { genIntKey, roomColor, Row, styles, View, Text, TextInput, ActionButton, Column } from "../Utils/CompUtils";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { SOCKET_URL } from "../Utils/ClientUtils";
import { SocketTags } from "../package/Consts";
import { useNavigate } from "react-router-dom";

interface RoomDescription {users: string[], playing: boolean}

export default function ChooseRoom() {
  const appState = useAppContext();
  const [roomInput, setRoomInput] = useState<string>("");
  const [roomStatus, setRoomStatus] = useState<Record<string, RoomDescription>>({});
  const navigate = useNavigate();
  useEffect(() => {
    if (!appState.username) navigate("/");
    appState.socketHandler = {
      socket: io(`wss://${SOCKET_URL}`, {
        reconnectionAttempts: 3,
        withCredentials: true,
        auth: {
          token: appState.username,
        },
      }),
    };
    appState.socketHandler.socket.on('connect_error', () => {console.log("Failed to connect to server"); appState.socketHandler?.socket.disconnect();})

    appState.socketHandler.socket.on(SocketTags.JOIN, (status: Record<string, RoomDescription>) =>
      {setRoomStatus(status); console.log("roomStatus", status);}
    );
    appState.socketHandler.socket.on(SocketTags.LEAVE, (status: Record<string, RoomDescription>) =>
      {setRoomStatus(status); console.log("roomStatus", status);}
    );
    appState.socketHandler.socket.on(SocketTags.START, () => {
      appState.page="match";
      navigate("/match");
    });

    
  }, []);
  useEffect(() => {
    if (appState.roomId) {appState.socketHandler?.socket.emit(SocketTags.LEAVE, appState.roomId);}
    appState.roomId = undefined;
  }, [appState.page]);
  return (
    <View style={styles.container}>
      <Row></Row>
      <Row>
      <Text style={{...styles.textBoldHeader, color: 'black'}}>Lobby</Text>
      </Row>
      <Row>
      <Text style={styles.text}> Hello {appState.username}</Text>
      </Row>
      
      {Object.values(roomStatus).every(room => !room.users.includes(appState.username ?? "")) && <>
      <Row>
        <TextInput
        style={styles.input}
        onChangeText={setRoomInput}
        value={roomInput}
      />
      <ActionButton
      title="Create / join room"
      onPress={() => {
        appState.roomId = roomInput;
        roomInput.length > 0 &&
          appState?.socketHandler?.socket.emit(SocketTags.JOIN, roomInput);
      }}
    /></Row>
    
      <Row><Text style={styles.text}> Active rooms: </Text></Row>
      </>}
      <Row span={3}>{Object.entries(roomStatus).map((entry) => {
        const [roomId, room] = entry;
        
        return (
          <View key={genIntKey()} style={{
            backgroundColor: room.playing ? "gray" : roomColor,
            borderRadius: '1rem',
            padding: '1rem',
            margin: '1rem',
            width: '10rem'
            }}>
            <Text style={styles.textHeader}>{`${roomId} ${room.playing ? " - playing" : ""}`}</Text>
            {room.users.map((user) => (
              <Text style={styles.text} key={genIntKey()}>{user}</Text>
            ))}
            {room.users.includes(appState.username ?? "") && (
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
                    appState.roomId = undefined;
                    appState?.socketHandler?.socket.emit(SocketTags.LEAVE, roomId);
                  }}
                />
              </>
            )}
            {Object.values(roomStatus).every(room => !room.users.includes(appState.username ?? "")) && !room.playing && (
              <>
                <ActionButton
                  title="Join room"
                  onPress={() => {
                    appState.roomId = roomId;
                    appState?.socketHandler?.socket.emit(SocketTags.JOIN, roomId);
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
