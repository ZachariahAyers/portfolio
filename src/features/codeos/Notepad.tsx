import { useState } from 'react';

const STARTER = `Ayers Software Repair
Software Services & AI Development

ayers.repair
info@ayers.repair

Use this space for your notes. Notes are not saved when you close the desktop.`;

export function Notepad() {
  const [text, setText] = useState(STARTER);
  const lines = text.split('\n').length;
  return (
    <div className="flex h-full flex-col">
      <div
        className="flex gap-4 border-b border-gray-300 bg-gray-100 p-2 text-xs dark:border-gray-700 dark:bg-gray-800"
        aria-hidden
      >
        <span>File</span>
        <span>Edit</span>
        <span>Format</span>
        <span>View</span>
        <span>Help</span>
      </div>
      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        aria-label="Notepad"
        spellCheck={false}
        className="flex-1 resize-none bg-white p-4 font-mono text-sm text-gray-800 outline-hidden dark:bg-gray-900 dark:text-gray-300"
      />
      <div className="flex h-6 items-center bg-gray-100 px-2 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
        <span>{lines} lines</span>
        <span className="ml-auto">UTF-8</span>
      </div>
    </div>
  );
}
