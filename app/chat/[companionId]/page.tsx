"use client";

import { useState } from 'react';
import { useChat } from '@/hooks/use-chat';
import { ChatMessages } from '@/components/chat/chat-messages';
import { ChatInput } from '@/components/chat/chat-input';
import { VoiceControls } from '@/components/chat/voice-controls';
import { ImageUpload } from '@/components/chat/image-upload';

interface ChatPageProps {
  params: {
    companionId: string;
  };
}

export default function ChatPage({ params }: ChatPageProps) {
  const { companionId } = params;
  const { messages, isLoading, sendMessage } = useChat({ companionId });
  const [voiceOutputEnabled, setVoiceOutputEnabled] = useState(false);

  const handleVoiceOutput = (enabled: boolean) => {
    setVoiceOutputEnabled(enabled);
    // If enabled, use browser's speech synthesis for AI responses
    if (enabled && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant') {
        const utterance = new SpeechSynthesisUtterance(lastMessage.content);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const handleImageAnalysis = (result: string) => {
    sendMessage(result);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <ChatMessages messages={messages} isLoading={isLoading} />
      <div className="border-t p-4">
        <div className="flex items-center gap-4 mb-4">
          <VoiceControls 
            onTranscript={(text) => sendMessage(text)}
            onToggleVoiceOutput={handleVoiceOutput}
          />
          <ImageUpload 
            onImageAnalysis={handleImageAnalysis}
          />
        </div>
        <ChatInput onSend={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}