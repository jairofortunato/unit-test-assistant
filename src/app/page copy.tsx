'use client';

import { useChat } from 'ai/react';
import { useState, useEffect, useRef } from 'react';

// Mapping of library options to their respective emojis
const libraryEmojiMap: { [key: string]: string } = {
  'JavaScript / Jest': '🚀',
  'JavaScript / Mocha': '🚀✨',
  'JavaScript / Jasmine': '🚀🌟',
  'JavaScript / Ava': '🚀🔥',
  'Python / unittest': '🐍',
  'Python / pytest': '🐍✨',
  'Python / nose2': '🐍🌟',
  'Java / JUnit': '☕',
  'Java / TestNG': '☕✨',
  'C# / NUnit': '💻',
  'C# / xUnit.net': '💻✨',
  'PHP / PHPUnit': '🐘',
  'PHP / Codeception': '🐘✨',
  'Go / testing': '🌀',
  'Go / Testify': '🌀✨',
  'Swift / XCTest': '🕊️',
  'Ruby / RSpec': '🦋',
  'Ruby / Minitest': '🦋✨',
};

const languageOptions: { [key: string]: string[] } = {
  'JavaScript': ['Jest', 'Mocha', 'Jasmine', 'Ava'],
  'Python': ['unittest', 'pytest', 'nose2'],
  'Java': ['JUnit', 'TestNG'],
  'C#': ['NUnit', 'xUnit.net'],
  'PHP': ['PHPUnit', 'Codeception'],
  'Go': ['testing', 'Testify'],
  'Swift': ['XCTest'],
  'Ruby': ['RSpec', 'Minitest'],
};

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null); // Change ref to TextAreaElement
  const [emoji, setEmoji] = useState<string>(''); // State to store the current emoji
  const [selectedLanguage, setSelectedLanguage] = useState<string>(''); // State to store the selected language
  const [selectedLibrary, setSelectedLibrary] = useState<string>(''); // State to store the selected library

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Function to handle the change of the selected language
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setSelectedLanguage(selected);
    setSelectedLibrary(''); // Reset the selected library when the language changes
    console.log(`Language selected: ${selected}`);
  };

  // Function to handle the change of the selected library
  const handleLibraryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setSelectedLibrary(selected);
    const combinedKey = `${selectedLanguage} / ${selected}`;
    const selectedEmoji = libraryEmojiMap[combinedKey];
    setEmoji(selectedEmoji);
    console.log(`Library selected: ${selected}`);
    console.log(`Emoji set to: ${selectedEmoji}`);
  };

  // Function to handle key down events in the textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitWithEmoji();
    }
  };

  // Function to handle input change events in the textarea
  const handleInputChangeWithoutEmoji = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleInputChange(e);
  };

  // Function to concatenate the emoji and user's message
  const getConcatenatedMessage = () => {
    if (inputRef.current) {
      const message = `${emoji} ${inputRef.current.value.trim()}`;
      console.log(`Concatenated message: ${message}`);
      return message;
    }
    return '';
  };

  // Override handleSubmit to use getConcatenatedMessage
  const handleSubmitWithEmoji = () => {
    const concatenatedMessage = getConcatenatedMessage();
    console.log(`Submitting message: ${concatenatedMessage}`);
    handleSubmit({
      target: { value: concatenatedMessage },
      preventDefault: () => {}, // Mock function to satisfy TypeScript
    } as unknown as React.FormEvent<HTMLFormElement>);
  };

  // Function to render the message content
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

        {/* Language Dropdown */}
        <div className="pb-4">
          <select
            className="inline-flex items-center justify-center rounded-md text-sm font-medium text-[#030712] bg-white border border-[#e5e7eb] h-10 px-4 py-2"
            onChange={handleLanguageChange}
            value={selectedLanguage}
          >
            <option value="" disabled>Select Language</option>
            {Object.keys(languageOptions).map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
        </div>

        {/* Library Dropdown */}
        {selectedLanguage && (
          <div className="pb-4">
            <select
              className="inline-flex items-center justify-center rounded-md text-sm font-medium text-[#030712] bg-white border border-[#e5e7eb] h-10 px-4 py-2"
              onChange={handleLibraryChange}
              value={selectedLibrary}
            >
              <option value="" disabled>Select Library</option>
              {languageOptions[selectedLanguage].map((lib) => (
                <option key={lib} value={lib}>
                  {lib}
                </option>
              ))}
            </select>
          </div>
        )}

        <div
          ref={chatContainerRef}
          className="pr-4 h-[620px] overflow-y-auto"
          style={{ minWidth: '100%', display: 'block' }}
        >
          {messages.map((m, index) => (
            <div key={index} className="flex gap-3 my-4 text-black text-sm flex-1 break-words">
              <p className="leading-relaxed break-words">
                <span className="block font-bold text-black">{m.role === 'user' ? 'You' : 'Unit Test Assistant'}</span>
                {renderMessageContent(m.content)}
              </p>
            </div>
          ))}
        </div>

        {/* Input box */}
        <div className="flex items-center pt-0">
          <form className="flex items-center justify-center w-full space-x-2" onSubmit={(e) => { e.preventDefault(); handleSubmitWithEmoji(); }}>
            <textarea
              ref={inputRef} // Attach the ref to the textarea element
              className="flex h-20 w-full rounded-md border border-[#e5e7eb] px-3 py-2 text-sm placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#9ca3af] disabled:cursor-not-allowed disabled:opacity-50 text-[#030712] focus-visible:ring-offset-2"
              placeholder="Type your message"
              value={input} 
              onChange={handleInputChangeWithoutEmoji} // Use the new change handler
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
