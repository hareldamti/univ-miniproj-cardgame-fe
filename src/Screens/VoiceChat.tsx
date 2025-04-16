import React, { useEffect, useMemo, useRef, useState } from "react";
import { ActionButton, Row, View } from "../Utils/CompUtils";
import { useAppContext } from "../State/AppState";
import { SocketTags } from "../package/Consts";
import Recorder from 'recorder-js';

export const VoiceChat = () => {
  const appState = useAppContext();
  const [audioCtx, setAudioCtx] = useState<AudioContext>();
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState<Recorder>();
  const [debugMsg, setDebugMsg] = useState("");
  const startRecording = async() => {
      recorder?.stop();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const _recorder = new Recorder(audioCtx, {
      });
      setRecorder(_recorder);
      _recorder.init(stream);
      _recorder.start();
      
      setIsRecording(true);
  };

  const stopRecording = async () => {
    if (!recorder) {console.log("Stop recording but recorder is null");return;}
    const { blob } = await recorder.stop();
    appState.socketHandler?.socket.emit(SocketTags.AUDIO, blob);
    setIsRecording(false);
  };

  const unlockAudio = () => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const audioCtx = new AudioContext();
  
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    setAudioCtx(audioCtx);
  };

  const playAudioBlob = async (blob: Blob) => {
    if (!audioCtx) return;
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = await audioCtx.decodeAudioData(arrayBuffer);
    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(audioCtx.destination);
    source.start(0);
  };
  
  useEffect(() => {
    if (!appState.socketHandler?.socket) { return; }
    appState.socketHandler?.socket.on(SocketTags.AUDIO, (props: { data: Blob; senderId: string }) => {
      if (appState.socketHandler?.socket.id === props.senderId) return;
      playAudioBlob(props.data);
      //audio.play().catch((error) => setDebugMsg(msg => msg + "\n" + JSON.stringify(error)));
    });

    return () => {
      appState.socketHandler?.socket?.off(SocketTags.AUDIO);
      recorder?.stop();
    };
  }, [appState]);

  return (<>
    <ActionButton full title={"🎙️"} color={!isRecording ? "red" : "#AA0000"} onPress={ isRecording ? stopRecording : startRecording }/>
    {debugMsg}</>
  );
};
