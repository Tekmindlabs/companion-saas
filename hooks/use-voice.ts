import { useState, useCallback } from 'react';
import { SpeechService } from '@/lib/voice/speech-service';

export function useVoice() {
  const [isListening, setIsListening] = useState(false);
  const [speechService] = useState(() => new SpeechService());

  const startListening = useCallback(async (onTranscript: (text: string) => void) => {
    try {
      setIsListening(true);
      await speechService.startListening(onTranscript);
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      setIsListening(false);
    }
  }, [speechService]);

  const stopListening = useCallback(async () => {
    try {
      await speechService.stopListening();
    } finally {
      setIsListening(false);
    }
  }, [speechService]);

  const speak = useCallback(async (text: string) => {
    try {
      const audioData = await speechService.textToSpeech(text);
      const audioContext = new AudioContext();
      const audioBuffer = await audioContext.decodeAudioData(audioData);
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start();
    } catch (error) {
      console.error('Error in text-to-speech:', error);
    }
  }, [speechService]);

  return {
    isListening,
    startListening,
    stopListening,
    speak
  };
}