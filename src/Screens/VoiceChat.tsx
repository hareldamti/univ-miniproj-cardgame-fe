import React, { useEffect, useMemo, useRef, useState } from "react";
import { ActionButton, Row, View } from "../Utils/CompUtils";
import { useAppContext } from "../State/AppState";
import { SocketTags } from "../package/Consts";
import Recorder from 'recorder-js';

export const VoiceChat = () => {
  const appState = useAppContext();
  const [audioCtx, setAudioCtx] = useState<AudioContext>();
  const [isRecording, setIsRecording] = useState(false);
  const [started, setStarted] = useState(false);
  const { startVoiceChat, resumeVoiceChat, pauseVoiceChat, leaveVoiceChat } = useVoiceChat(appState.socketHandler?.socket, setIsRecording);

  useEffect(() => {
    return leaveVoiceChat;
  }, []);

  const startVoice = () => {
    startVoiceChat();
    setStarted(true);
  }

  return <ActionButton full title={!isRecording ? "🎙️" : "🔇"} color={!isRecording ? "red" : "#AA0000"} onTouchStart={ started ? (isRecording ? pauseVoiceChat : resumeVoiceChat) : startVoice } />;
};

export function useVoiceChat(socket: any, setIsRecording: React.Dispatch<React.SetStateAction<boolean>>) {
  const recorderRef1 = useRef<Recorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startVoiceChat = async () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContext();
      audioContextRef.current = audioCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder1 = new Recorder(audioCtx);
      await recorder1.init(stream);
      recorder1.start();
      recorderRef1.current = recorder1;
    }
    catch (error) { window.alert((error as any).message); }
    setIsRecording(true);
  }

  const resumeVoiceChat = async () => {
    recorderRef1.current?.start();
    setIsRecording(true);
  };

  const pauseVoiceChat = async () => {
    recorderRef1.current?.stop().then(({ blob }) => {
      blob.arrayBuffer().then((buffer) => {
        socket.emit(SocketTags.AUDIO, Array.from(new Uint8Array(buffer)));
      });
    });
    setIsRecording(false);
  }

  const leaveVoiceChat = () => {
    recorderRef1.current?.stop();
    recorderRef1.current = null;

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

  return { startVoiceChat, resumeVoiceChat, pauseVoiceChat, leaveVoiceChat };
}
