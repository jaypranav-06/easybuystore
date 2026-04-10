'use client';

import { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
}

export default function TagInput({ tags, onChange, placeholder = 'Type and press Enter to add tags', maxTags }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Handle Enter key to add tag
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
    // Handle Backspace to remove last tag when input is empty
    else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const addTag = () => {
    const trimmedValue = inputValue.trim();

    // Don't add empty tags
    if (!trimmedValue) return;

    // Check if tag already exists (case-insensitive)
    if (tags.some(tag => tag.toLowerCase() === trimmedValue.toLowerCase())) {
      setInputValue('');
      return;
    }

    // Check max tags limit
    if (maxTags && tags.length >= maxTags) {
      alert(`Maximum ${maxTags} tags allowed`);
      return;
    }

    // Add the tag
    onChange([...tags, trimmedValue]);
    setInputValue('');
  };

  const removeTag = (indexToRemove: number) => {
    onChange(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="space-y-3">
      {/* Tags Display */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 text-sm font-medium transition-all hover:bg-gray-200"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="text-gray-500 hover:text-red-600 transition-colors"
                aria-label={`Remove ${tag}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input Field */}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
        placeholder={placeholder}
      />

      <p className="text-xs text-gray-500">
        Press <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs font-mono">Enter</kbd> to add tags.
        Tags help customers find products through search.
        {maxTags && ` (Maximum ${maxTags} tags)`}
      </p>
    </div>
  );
}
