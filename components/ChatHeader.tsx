'use client';
import { useState } from 'react';
import { Bot, ChevronDown } from 'lucide-react';

const models = [
  { name: 'GPT-4o', value: 'gpt-4o' },
  { name: 'Gemini Pro', value: 'gemini-pro' },
];

export default function ChatHeader({
  onModelChange,
  currentModel,
}: {
  onModelChange: (model: string) => void;
  currentModel: string;
}) {
  const [open, setOpen] = useState(false);

  const handleSelect = (model: string) => {
    onModelChange(model);
    setOpen(false);
  };

  return (
    <div className="flex items-center justify-between bg-warm-ivory border-b border-gray-200 px-4 py-3 rounded-t-xl font-body">
      <div className="flex items-center gap-2 text-charcoal-navy">
        <Bot className="w-5 h-5" />
        <span className="font-semibold">AI Legal Assistant</span>
      </div>
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1 text-sm text-dusty-mauve hover:text-garnet"
        >
          {models.find((m) => m.value === currentModel)?.name || 'Select Model'}
          <ChevronDown className="w-4 h-4" />
        </button>
        {open && (
          <ul className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-10">
            {models.map((model) => (
              <li
                key={model.value}
                onClick={() => handleSelect(model.value)}
                className="px-3 py-2 hover:bg-warm-ivory cursor-pointer text-sm"
              >
                {model.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}