import { useState } from 'react';

export function useChat() {
  const [messages, setMessages] = useState<{ role: string, content: string }[]>([]);

  const handleSubmit = async (message: string) => {
    const newMessages = [...messages, { role: 'user', content: message }];
    setMessages(newMessages);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        console.error('Failed to get reader from response body');
        return;
      }

      const decoder = new TextDecoder();
      let done = false;
      let result = '';

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        result += decoder.decode(value, { stream: !done });
      }

      setMessages([...newMessages, { role: 'assistant', content: result }]);
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages([...newMessages, { role: 'assistant', content: 'Error processing your request. Please try again.' }]);
    }
  };

  return { messages, handleSubmit };
}
