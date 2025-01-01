"use client";

import { useState } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVoice } from '@/hooks/use-voice';

interface VoiceControlsProps {
  onTranscript: (text: string) => void;
  onToggleVoiceOutput: (enabled: boolean) => void;
}

export function VoiceControls({ onTranscript, onToggleVoiceOutput }: VoiceControlsProps) {
  const { isListening, startListening, stopListening } = useVoice();
  const [voiceOutputEnabled, setVoiceOutputEnabled] = useState(false);

  const toggleVoiceOutput = () => {
    setVoiceOutputEnabled(!voiceOutputEnabled);
    onToggleVoiceOutput(!voiceOutputEnabled);
  };

  const toggleListening = async () => {
    if (isListening) {
      await stopListening();
    } else {
      await startListening(onTranscript);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleListening}
        className={isListening ? 'text-primary' : ''}
      >
        {isListening ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleVoiceOutput}
        className={voiceOutputEnabled ? 'text-primary' : ''}
      >
        {voiceOutputEnabled ? (
          <Volume2 className="h-5 w-5" />
        ) : (
          <VolumeX className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
}