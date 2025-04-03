import React, { useEffect, useRef, useState } from "react";
import { ActionButton, Row, View } from "../Utils/CompUtils";
import { useAppContext } from "../State/AppState";
import { SocketTags } from "../package/Consts";
import * as mediasoup from "mediasoup";
import { SOCKET_URL } from "../Utils/ClientUtils";

export const VoiceChat = () => {
  
  const appState = useAppContext();
  const socket = appState.socketHandler?.socket;
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [isRecording, setIsRecording] = useState<Boolean>(false);
  let recordingId: number = 0;

  const startRecording = async () => {
    setIsRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    setMediaStream(stream);
    const audioCtx = new (window.AudioContext)();
    setAudioContext(audioCtx);
    const micSource = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    micSource.connect(analyser);
    analyser.connect(audioCtx.destination);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const processAudio = () => {
      analyser.getByteFrequencyData(dataArray);

      if (socket && socket.connected) {
        socket.emit('audio-data', dataArray);
      }

      recordingId = requestAnimationFrame(processAudio);
    };

    // Start audio capture loop
    processAudio();
  };
  const stopRecording = () => {
    setIsRecording(false);
    setMediaStream(null);
    cancelAnimationFrame(recordingId);
  }
  const playAudioData = (data: ArrayBuffer) => {
    if (audioContext) {
      // Create a buffer from the received audio data
      audioContext.decodeAudioData(new Uint8Array(data).buffer, (buffer) => {
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);
        source.start();
      }, (err) => {
        console.error('Error decoding audio data', err);
      });
    }
  };
  useEffect(() => {
    socket?.on('audio-data', (data) => {
      playAudioData(data);
    });
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [socket]);

  

  return <ActionButton
  title={`${isRecording ? 'Pause' : 'Start'} Voice Chat`}
  onPress={!isRecording ? startRecording : stopRecording}
/>;
};




export const VoiceChat____ = () => {
  const appState = useAppContext();
  const socket = appState.socketHandler?.socket;
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const startAudioCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      setAudioStream(stream);
    } catch (err) {
      console.error("Error accessing microphone", err);
    }
  };
  useEffect(() => {
    startAudioCapture();
  }, []);

  const startRecording = () => {
    if (audioStream) {
      const recorder = new MediaRecorder(audioStream, { mimeType: 'audio/webm' });  // Choose mimeType as 'audio/webm' or other formats that suit your needs
      const audioChunks: Blob[] = [];
  
      recorder.ondataavailable = (e) => {
        // Store chunks of audio data
        audioChunks.push(e.data);
      };

      setInterval(() => {recorder.stop(); recorder.start();}, 100);
      recorder.onstop = () => {
        // Combine all the audio chunks into one Blob after recording stops
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        audioChunks.length = 0;
        // Send the complete audio Blob to the server (or play it locally)
        socket?.emit("audio-data", audioBlob);
      };
  
      recorder.start(100); // Record in chunks of 100ms
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    audioStream?.getTracks().forEach((track) => track.stop());
  };

  // Play incoming audio
  useEffect(() => {
    socket?.on(
      "audio-data",
      (props: { data: Blob; senderId: string }) => {
        if (socket?.id === props.senderId) return;
        console.log("recieving", props.data);
          const audioUrl = URL.createObjectURL(new Blob([props.data], { type: 'audio/webm' }));
          const audio = new Audio(audioUrl);
          audio.play().catch((error) => console.error("Error playing audio:", error));
        }
    );

    return () => {
      socket?.off("audio-data");
    };
  }, []);

  return (
    <div>
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? "Stop" : "Start"} Recording
      </button>
    </div>
  );
};
