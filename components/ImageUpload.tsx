import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';

interface ImageUploadProps {
  currentImage: string | null;
  onImageUpload: (base64: string) => void;
  onClear: () => void;
  disabled: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ currentImage, onImageUpload, onClear, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.match('image.*')) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onImageUpload(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  if (currentImage) {
    return (
      <div className="relative group w-full h-full bg-[#111] border border-[#333]">
        <img 
          src={currentImage} 
          alt="Original Model" 
          className="w-full h-full object-contain opacity-80 group-hover:opacity-40 transition-opacity duration-300"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={onClear}
            disabled={disabled}
            className="bg-[#FCD5D3] text-[#191919] px-6 py-3 font-bold uppercase tracking-wider text-xs hover:bg-[#fff] transition-colors"
          >
            Remove
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        relative w-full h-full border transition-all duration-300 flex flex-col items-center justify-center
        ${isDragging
          ? 'border-[#FCD5D3] bg-[#FCD5D3]/5'
          : 'border-[#333] hover:border-[#666] bg-[#111]'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleFileChange}
        disabled={disabled}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10" 
      />
      
      <div className={`p-4 mb-2 transition-colors duration-300 ${isDragging ? 'text-[#FCD5D3]' : 'text-[#444]'}`}>
        <Upload strokeWidth={1} className="w-10 h-10" />
      </div>
      
      <h3 className="text-sm font-bold text-[#F3F3EE] uppercase tracking-wider mb-2">Upload Sketch</h3>
      <p className="text-[10px] text-[#666] font-mono uppercase tracking-widest">
        Drag & drop or click
      </p>
    </div>
  );
};

export default ImageUpload;