import React, { useEffect, useMemo, useRef, useState } from "react";
import { ActionButton, Row, View } from "../Utils/CompUtils";
import { useAppContext } from "../State/AppState";
import { SocketTags } from "../package/Consts";
import Recorder from 'recorder-js';

export const VoiceChat = () => {
  const appState = useAppContext();
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState<Recorder>();
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const startRecording = async() => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const recorder = new Recorder(audioCtx, {
        onAnalysed: data => console.log('Analyzed:', data),
      });
      setRecorder(recorder);
      const audioChunks: Blob[] = [];
      recorder.init(stream);
      recorder.start();
      
      setIsRecording(true);
  };

  const stopRecording = async () => {
    if (!recorder) {console.log("Stop recording but recorder is null");return;}
    const { blob } = await recorder.stop();
    appState.socketHandler?.socket.emit(SocketTags.AUDIO, blob);
    setIsRecording(false);
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
    <ActionButton full title={"🎙️"} color={!isRecording ? "red" : "#AA0000"} onHold={startRecording} onRelease={stopRecording}/>
  );
};
