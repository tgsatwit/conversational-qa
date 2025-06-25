import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Mic, MicOff, Volume2, Square } from 'lucide-react';

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  onPlayAudio: (audioUrl: string) => void;
  isListening: boolean;
  isPlaying: boolean;
  disabled?: boolean;
}

export default function AudioRecorder({ 
  onRecordingComplete, 
  onPlayAudio, 
  isListening,
  isPlaying,
  disabled = false 
}: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    // Request microphone permission on component mount
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => setHasPermission(true))
      .catch(() => setHasPermission(false));
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        onRecordingComplete(audioBlob);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  if (!hasPermission) {
    return (
      <div className="text-center p-4 bg-muted rounded-lg">
        <Mic className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Microphone permission required for voice interaction
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center space-x-4">
      {!isRecording ? (
        <Button
          onClick={startRecording}
          disabled={disabled || isPlaying || isListening}
          size="lg"
          className="flex items-center space-x-2"
        >
          <Mic className="h-5 w-5" />
          <span>Start Recording</span>
        </Button>
      ) : (
        <Button
          onClick={stopRecording}
          variant="destructive"
          size="lg"
          className="flex items-center space-x-2 animate-pulse"
        >
          <Square className="h-5 w-5" />
          <span>Stop Recording</span>
        </Button>
      )}

      {(isListening || isPlaying) && (
        <div className="flex items-center space-x-2 text-blue-600">
          {isListening && (
            <>
              <MicOff className="h-5 w-5 animate-pulse" />
              <span className="text-sm">AI is listening...</span>
            </>
          )}
          {isPlaying && (
            <>
              <Volume2 className="h-5 w-5 animate-pulse" />
              <span className="text-sm">AI is speaking...</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}