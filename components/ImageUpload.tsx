'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  currentImage: string;
  onImageChange: (imageUrl: string) => void;
  label?: string;
}

export default function ImageUpload({
  currentImage,
  onImageChange,
  label = 'Product Image',
}: ImageUploadProps) {
  const [uploadMethod, setUploadMethod] = useState<'emoji' | 'file' | 'url'>('emoji');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || '🍰');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Upload failed');
      }

      const data = await response.json();
      onImageChange(data.imageUrl);
      setPreview(data.imageUrl);
      alert('Image uploaded successfully!');
    } catch (error: any) {
      alert(error.message || 'Failed to upload image');
      setPreview(currentImage);
    } finally {
      setUploading(false);
    }
  };

  const handleUrlSubmit = () => {
    if (!imageUrl) {
      alert('Please enter an image URL');
      return;
    }
    onImageChange(imageUrl);
    setPreview(imageUrl);
    alert('Image URL saved!');
  };

  const handleEmojiChange = (emoji: string) => {
    onImageChange(emoji);
    setPreview(emoji);
  };

  const isEmoji = (str: string | undefined | null) => {
    if (!str) return false;
    return str.length <= 4 && !/^https?:\/\//.test(str) && !/^\//.test(str);
  };
  const isImageUrl = (str: string | undefined | null) => {
    if (!str) return false;
    return /^https?:\/\//.test(str) || /^\//.test(str);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      {/* Preview */}
      <div className="flex items-center gap-4">
        <div className="w-32 h-32 border-2 border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden">
          {isEmoji(preview) ? (
            <span className="text-6xl">{preview}</span>
          ) : isImageUrl(preview) ? (
            <Image
              src={preview}
              alt="Preview"
              width={128}
              height={128}
              className="object-cover w-full h-full"
              onError={() => setPreview('🍰')}
            />
          ) : (
            <span className="text-6xl">🍰</span>
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-2">
            Choose how to add your product image:
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setUploadMethod('emoji')}
              className={`px-3 py-1 rounded text-sm ${
                uploadMethod === 'emoji'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Emoji
            </button>
            <button
              type="button"
              onClick={() => setUploadMethod('file')}
              className={`px-3 py-1 rounded text-sm ${
                uploadMethod === 'file'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Upload File
            </button>
            <button
              type="button"
              onClick={() => setUploadMethod('url')}
              className={`px-3 py-1 rounded text-sm ${
                uploadMethod === 'url'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Image URL
            </button>
          </div>
        </div>
      </div>

      {/* Upload Method Content */}
      {uploadMethod === 'emoji' && (
        <div>
          <input
            type="text"
            value={isEmoji(currentImage) ? currentImage : '🍰'}
            onChange={(e) => handleEmojiChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="🍰"
            maxLength={4}
          />
          <p className="mt-2 text-sm text-gray-500">
            Common bakery emojis: 🍰 🎂 🧁 🥐 🍞 🥖 🥨 🍪 🍩
          </p>
        </div>
      )}

      {uploadMethod === 'file' && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading...' : 'Choose File'}
          </button>
          <p className="mt-2 text-sm text-gray-500">
            Supported formats: JPEG, PNG, GIF, WebP (Max 5MB)
          </p>
        </div>
      )}

      {uploadMethod === 'url' && (
        <div>
          <div className="flex gap-2">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="https://example.com/image.jpg"
            />
            <button
              type="button"
              onClick={handleUrlSubmit}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Use URL
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Enter a direct link to an image file
          </p>
        </div>
      )}
    </div>
  );
}
