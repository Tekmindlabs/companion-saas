"use client";

import { useState } from 'react';
import { Image as ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MultimodalService } from '@/lib/ai/multimodal-service';

interface ImageUploadProps {
  onImageAnalysis: (result: string) => void;
}

export function ImageUpload({ onImageAnalysis }: ImageUploadProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const multimodalService = new MultimodalService();

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    try {
      setIsAnalyzing(true);
      const result = await multimodalService.analyzeImage(
        selectedImage,
        "Describe this image in detail and identify any relevant information."
      );
      onImageAnalysis(result);
    } finally {
      setIsAnalyzing(false);
      setSelectedImage(null);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => document.getElementById('image-upload')?.click()}
      >
        <ImageIcon className="h-5 w-5" />
      </Button>
      
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageSelect}
      />

      {selectedImage && (
        <div className="flex items-center gap-2">
          <span className="text-sm">{selectedImage.name}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedImage(null)}
          >
            <X className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            onClick={analyzeImage}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze'}
          </Button>
        </div>
      )}
    </div>
  );
}