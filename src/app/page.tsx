'use client';

import { useChat } from 'ai/react';
import { useState, useEffect, useRef } from 'react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null); // Change ref to TextAreaElement
  const [emoji, setEmoji] = useState<string>(''); // State to store the current emoji

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleLanguageFrameworkClick = (languageFramework: string) => {
    setEmoji(languageFramework);
    if (inputRef.current) {
      const currentValue = inputRef.current.value;
      // Remove any existing emoji prefix
      const newValue = currentValue.replace(/^🚀|🐍|☕|💻|🐘|🌀|🕊️ /, '');
      // Prepend the new emoji
      inputRef.current.value = `${languageFramework} ${newValue}`;
      handleInputChange({ target: inputRef.current } as React.ChangeEvent<HTMLTextAreaElement>); // Update input value
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  const handleInputChangeWithEmoji = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const currentValue = e.target.value;
    if (!currentValue.startsWith(emoji)) {
      e.target.value = `${emoji} ` + currentValue.replace(emoji, '').trimStart();
    }
    handleInputChange(e);
  };

  const renderMessageContent = (content: string) => {
    const codeRegex = /```([\s\S]*?)```/g;
    const parts = content.split(codeRegex);

    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return (
          <pre key={index} className="bg-black text-white p-2 rounded-md overflow-auto">
            <code>{part}</code>
          </pre>
        );
      }
      return part.split('\n').map((line, i) => {
        if (line.startsWith('###')) {
          return <h3 key={i} className="text-lg font-semibold mt-4 mb-4">{line.replace(/^###\s*/, '')}</h3>;
        }
        if (line.startsWith('####')) {
          return <h4 key={i} className="text-base font-semibold mt-4 mb-4">{line.replace(/^####\s*/, '')}</h4>;
        }
        if (line.startsWith('-')) {
          return <p key={i} className="mt-2">{line}</p>;
        }
        return (
          <p key={i} className="leading-relaxed break-words">
            {line.split(/(\*\*[^*]+\*\*)/g).map((chunk, j) => {
              if (chunk.startsWith('**') && chunk.endsWith('**')) {
                return <span key={j} className="font-bold">{chunk.replace(/\*\*/g, '')}</span>;
              }
              return chunk;
            })}
          </p>
        );
      });
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 overflow-auto">
      {/* Chat Container */}
      <div className="w-full max-w-3xl bg-white p-6 rounded-lg border border-[#e5e7eb] shadow-lg h-[800px]">
        {/* Heading */}
        <div className="chatbox-header flex flex-col space-y-1.5 pb-6">
          <h2 className="font-semibold text-lg tracking-tight text-black">Unit Test Assistant</h2>
          <p className="text-sm text-[#6b7280] leading-3">Your assistant for automated unit testing</p>
        </div>

        {/* Language/Framework Buttons */}
        <div className="flex flex-wrap gap-2 pb-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleLanguageFrameworkClick('🚀')}
          >
            JavaScript / Jest
          </button>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleLanguageFrameworkClick('🐍')}
          >
            Python / unittest
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleLanguageFrameworkClick('☕')}
          >
            Java / JUnit
          </button>
          <button
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleLanguageFrameworkClick('💻')}
          >
            C# / NUnit
          </button>
          <button
            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleLanguageFrameworkClick('🐘')}
          >
            PHP / PHPUnit
          </button>
          <button
            className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleLanguageFrameworkClick('🌀')}
          >
            Go / testing
          </button>
          <button
            className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleLanguageFrameworkClick('🕊️')}
          >
            Swift / XCTest
          </button>
        </div>

        <div
          ref={chatContainerRef}
          className="pr-4 h-[620px] overflow-y-auto"
          style={{ minWidth: '100%', display: 'block' }}
        >
          {messages.map((m, index) => (
            <div key={index} className="flex gap-3 my-4 text-black text-sm flex-1 break-words">
              <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
                <div className="rounded-full bg-gray-100 border p-1">
                  <svg stroke="none" fill="black" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d={m.role === 'user' ? "M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z" : "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 0 1 0-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 1 0 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 1 0 2.455L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 0 1-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 0 1.423L21.75 6l-1.035.259a2.25 2.25 0 0 0-2.456 2.456z"}></path>
                  </svg>
                </div>
              </span>
              <p className="leading-relaxed break-words">
                <span className="block font-bold text-black">{m.role === 'user' ? 'You' : 'Unit Test Assistant'}</span>
                {renderMessageContent(m.content)}
              </p>
            </div>
          ))}
        </div>

        {/* Input box */}
        <div className="flex items-center pt-0">
          <form className="flex items-center justify-center w-full space-x-2" onSubmit={handleSubmit}>
            <textarea
              ref={inputRef} // Attach the ref to the textarea element
              className="flex h-20 w-full rounded-md border border-[#e5e7eb] px-3 py-2 text-sm placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#9ca3af] disabled:cursor-not-allowed disabled:opacity-50 text-[#030712] focus-visible:ring-offset-2"
              placeholder="Type your message"
              value={input}
              onChange={handleInputChangeWithEmoji} // Use the new change handler
              onKeyDown={handleKeyDown}
            />
            <button
              className="inline-flex items-center justify-center rounded-md text-sm font-medium text-[#f9fafb] disabled:pointer-events-none disabled:opacity-50 bg-black hover:bg-[#111827E6] h-10 px-4 py-2"
              type="submit"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
