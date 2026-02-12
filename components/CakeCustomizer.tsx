"use client";

import { useState } from "react";
import { Type, ImageIcon } from "lucide-react";

interface CakeCustomizerProps {
  customText: string;
  customImage: string;
  onCustomTextChange: (text: string) => void;
  onCustomImageChange: (url: string) => void;
}

export default function CakeCustomizer({
  customText,
  customImage,
  onCustomTextChange,
  onCustomImageChange,
}: CakeCustomizerProps) {
  const [showCustomization, setShowCustomization] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setShowCustomization(!showCustomization)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <span className="flex items-center gap-2">
          <Type className="h-4 w-4 text-primary-600" />
          Personalize This Cake
        </span>
        <span className="text-xs text-gray-400">
          {showCustomization ? "Hide" : "Optional"}
        </span>
      </button>

      {showCustomization && (
        <div className="p-4 border-t border-gray-200 space-y-4 bg-gray-50">
          {/* Custom Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message on Cake
            </label>
            <input
              type="text"
              maxLength={50}
              placeholder="e.g. Happy Birthday Sarah!"
              value={customText}
              onChange={(e) => onCustomTextChange(e.target.value)}
              className="input text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">{customText.length}/50 characters</p>
          </div>

          {/* Custom Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <span className="flex items-center gap-1">
                <ImageIcon className="h-3 w-3" />
                Photo on Cake (URL)
              </span>
            </label>
            <input
              type="url"
              placeholder="https://example.com/photo.jpg"
              value={customImage}
              onChange={(e) => onCustomImageChange(e.target.value)}
              className="input text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              Upload your photo and paste the URL here
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
