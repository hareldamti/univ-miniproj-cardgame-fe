import React, { useEffect, useMemo, useRef, useState } from "react";
import { ActionButton, Row, View } from "../Utils/CompUtils";
import { useAppContext } from "../State/AppState";
import { SocketTags } from "../package/Consts";

export const VoiceChat = () => {
  const appState = useAppContext();
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = async() => {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      setAudioStream(stream);
      const recorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });
      const audioChunks: Blob[] = [];
      recorder.ondataavailable = (e) => { audioChunks.push(e.data); };
      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        audioChunks.length = 0;
        appState.socketHandler?.socket.emit(SocketTags.AUDIO, audioBlob);
      };
      recorder.start();
      setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
    audioStream?.getTracks().forEach((track) => track.stop());
  };

  useEffect(() => {
    if (!appState.socketHandler?.socket) { return; }
    appState.socketHandler?.socket.on(SocketTags.AUDIO, (props: { data: Blob; senderId: string }) => {
      if (appState.socketHandler?.socket.id === props.senderId) return;
      const audioUrl = URL.createObjectURL(
        new Blob([props.data], { type: "audio/webm" })
      );
      
      const audio = new Audio(audioUrl);
      audio
        .play()
        .catch((error) => console.error("Error playing audio:", error));
    });

    return () => {
      appState.socketHandler?.socket?.off(SocketTags.AUDIO);
    };
  }, [appState]);

  return (
    <ActionButton full title={"🎙️"} color={!isRecording ? "red" : "#AA0000"} onPress={isRecording ? stopRecording : startRecording}/>
  );
};
