"use client";

import { Type } from "lucide-react";

interface MessageInputProps {
  message: string;
  onChange: (msg: string) => void;
}

export default function MessageInput({ message, onChange }: MessageInputProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-bakery-chocolate mb-3 flex items-center gap-2">
        <Type className="h-5 w-5 text-primary-600" />
        Cake Message
      </h3>
      <input
        type="text"
        maxLength={50}
        placeholder="e.g. Happy Birthday Sarah!"
        value={message}
        onChange={(e) => onChange(e.target.value)}
        className="input"
      />
      <p className="text-xs text-gray-500 mt-1">{message.length}/50 characters</p>
    </div>
  );
}
