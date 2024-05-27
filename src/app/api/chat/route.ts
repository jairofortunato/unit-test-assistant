// app/api/chat/route.ts
import { openai } from '@ai-sdk/openai';
import { StreamingTextResponse, streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const systemMessage = {
    role: 'system',
    content: 'This AI chatbot will assist with automated unit testing. The primary function of the chatbot is to answer questions and help users write unit tests efficiently. It should evaluate the users inputs and provide relevant and concise responses.'
  };

  const updatedMessages = [systemMessage, ...messages];

  const result = await streamText({
    model: openai('gpt-4o'),
    messages: updatedMessages,
  });

  const stream = result.toAIStream();

  return new StreamingTextResponse(stream);
}
