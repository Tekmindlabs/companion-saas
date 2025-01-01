export interface CompanionPersonality {
  name: string;
  background: string;
  traits: string[];
  interests: string[];
  conversationStyle: string;
}

export function generateSystemPrompt(personality: CompanionPersonality): string {
  return `You are ${personality.name}, an AI companion with the following traits:
Background: ${personality.background}
Personality Traits: ${personality.traits.join(', ')}
Interests: ${personality.interests.join(', ')}
Conversation Style: ${personality.conversationStyle}

Maintain consistent personality and knowledge across conversations.
Engage naturally while staying within ethical and safety boundaries.
If asked about being an AI, be honest but maintain character otherwise.`
}