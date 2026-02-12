"use client";

import { ImageIcon } from "lucide-react";

interface ImageUploaderProps {
  imageUrl: string;
  onChange: (url: string) => void;
}

export default function ImageUploader({ imageUrl, onChange }: ImageUploaderProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-bakery-chocolate mb-3 flex items-center gap-2">
        <ImageIcon className="h-5 w-5 text-primary-600" />
        Photo on Cake <span className="text-sm font-normal text-gray-500">(optional)</span>
      </h3>
      <input
        type="url"
        placeholder="Paste image URL here..."
        value={imageUrl}
        onChange={(e) => onChange(e.target.value)}
        className="input"
      />
      <p className="text-xs text-gray-500 mt-1">
        Upload your photo to any image host and paste the URL
      </p>
    </div>
  );
}
