import React, { useEffect, useMemo, useRef, useState } from "react";
import { ActionButton, Row, View } from "../Utils/CompUtils";
import { useAppContext } from "../State/AppState";
import { SocketTags } from "../package/Consts";
import Recorder from 'recorder-js';

export const VoiceChat = () => {
  const appState = useAppContext();
  const [audioCtx, setAudioCtx] = useState<AudioContext>();
  const [isRecording, setIsRecording] = useState(false);
  const {joinVoiceChat, leaveVoiceChat} = useVoiceChat(appState.socketHandler?.socket, setIsRecording);
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
    <ActionButton full title={!isRecording ? "🎙️" : "🔇"} color={!isRecording ? "red" : "#AA0000"} onTouchStart={ isRecording ? leaveVoiceChat : joinVoiceChat } />
    {debugMsg}</>
  );
};

export function useVoiceChat(socket: any, setIsRecording: React.Dispatch<React.SetStateAction<boolean>>) {
  const recorderRef1 = useRef<Recorder | null>(null);
  const recorderRef2 = useRef<Recorder | null>(null);
  const toggleRef = useRef<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const joinVoiceChat = async () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContext();
      audioContextRef.current = audioCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder1 = new Recorder(audioCtx);
      const recorder2 = new Recorder(audioCtx);
      await recorder1.init(stream);
      await recorder2.init(stream);
      recorder1.start();
      recorderRef1.current = recorder1;
      recorderRef2.current = recorder2;

      intervalRef.current = setInterval(() => {
        if (toggleRef.current) {
          recorderRef1.current?.start();
          recorderRef2.current?.stop().then(({ blob }) => {
            blob.arrayBuffer().then((buffer) => {
              socket.emit(SocketTags.AUDIO, Array.from(new Uint8Array(buffer)));
            });
          });
          toggleRef.current = false;
        }
        else {
          recorderRef2.current?.start();
          recorderRef1.current?.stop().then(({ blob }) => {
            blob.arrayBuffer().then((buffer) => {
              socket.emit(SocketTags.AUDIO, Array.from(new Uint8Array(buffer)));
            });
          });
          toggleRef.current = true;
        }
      }, 1000); // Send every 1 sec
    }
    catch (error) { window.alert((error as any).message); }
    setIsRecording(true);
  };

  const leaveVoiceChat = () => {
    recorderRef1.current?.stop();
    recorderRef1.current = null;
    recorderRef2.current?.stop();
    recorderRef2.current = null;

    if (intervalRef.current) clearInterval(intervalRef.current);

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setIsRecording(false);
  };

  useEffect(() => {
    socket?.on(SocketTags.AUDIO, async (props: { data: number[]; senderId: string }) => {
      if (socket.id === props.senderId) return;

      const array = new Uint8Array(props.data);
      const blob = new Blob([array.buffer], { type: "audio/wav" }); // WAV for Recorder.js
      const audioURL = URL.createObjectURL(blob);
      const audio = new Audio(audioURL);
      audio.play().catch(console.error);
    });
  }, [socket]);

  return { joinVoiceChat, leaveVoiceChat };
}
