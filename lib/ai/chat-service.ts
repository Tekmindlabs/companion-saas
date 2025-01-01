import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "langchain/schema";
import { genAI } from "./config";
import { CompanionPersonality, generateSystemPrompt } from "./companion-template";
import { db } from "@/lib/db";

export class CompanionChatService {
  private model: ChatGoogleGenerativeAI;
  private personality: CompanionPersonality;

  constructor(personality: CompanionPersonality) {
    this.model = new ChatGoogleGenerativeAI({
      modelName: "gemini-pro",
      maxOutputTokens: 2048,
      temperature: 0.7,
    });
    this.personality = personality;
  }

  async sendMessage(userId: string, companionId: string, content: string) {
    try {
      // Get conversation history
      const conversation = await db.conversation.findFirst({
        where: { userId, companionId },
        include: { messages: { take: 10, orderBy: { createdAt: 'desc' } } }
      });

      // Create messages array for context
      const messages = [
        new SystemMessage(generateSystemPrompt(this.personality)),
        ...conversation?.messages.map(msg => 
          new HumanMessage(msg.content)
        ) || [],
        new HumanMessage(content)
      ];

      // Get AI response
      const response = await this.model.call(messages);

      // Save message and response to database
      const newMessage = await db.message.create({
        data: {
          conversationId: conversation?.id || '',
          content,
          role: 'user'
        }
      });

      const aiResponse = await db.message.create({
        data: {
          conversationId: conversation?.id || '',
          content: response.content,
          role: 'assistant'
        }
      });

      return {
        userMessage: newMessage,
        aiResponse
      };
    } catch (error) {
      console.error('Error in chat service:', error);
      throw new Error('Failed to process message');
    }
  }
}