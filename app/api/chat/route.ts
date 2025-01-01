import { NextResponse } from 'next/server';
import { CompanionChatService } from '@/lib/ai/chat-service';
import { auth } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { companionId, message } = body;

    if (!companionId || !message) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Get companion details from database
    const companion = await prisma.companion.findUnique({
      where: { id: companionId }
    });

    if (!companion) {
      return new NextResponse('Companion not found', { status: 404 });
    }

    // Initialize chat service with companion personality
    const chatService = new CompanionChatService({
      name: companion.name,
      background: companion.description,
      traits: companion.instructions.split(','),
      interests: companion.seed.split(','),
      conversationStyle: 'friendly and engaging'
    });

    // Process message and get response
    const response = await chatService.sendMessage(
      session.user.id,
      companionId,
      message
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error('[CHAT_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}