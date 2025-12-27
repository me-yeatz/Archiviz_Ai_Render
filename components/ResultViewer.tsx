import React, { useState } from 'react';
import { Download, ArrowRightLeft, Image as ImageIcon } from 'lucide-react';
import { ViewMode } from '../types';

interface ResultViewerProps {
  originalImage: string | null;
  generatedImage: string | null;
  isGenerating: boolean;
}

const ResultViewer: React.FC<ResultViewerProps> = ({ originalImage, generatedImage, isGenerating }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Compare);

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = 'archiviz-render.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (isGenerating) {
    return (
      <div className="w-full h-full min-h-[500px] border border-[#333] bg-[#111] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center">
           <span className="text-[100px] font-black text-[#191919] select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 uppercase tracking-tighter w-full text-center">
             Processing
           </span>
           <div className="w-16 h-1 bg-[#F6D883] animate-pulse mb-8"></div>
           <p className="text-[#F3F3EE] font-bold uppercase tracking-widest text-xs">
            Applying Generative Textures
           </p>
        </div>
      </div>
    );
  }

  if (!originalImage || !generatedImage) {
    return (
      <div className="w-full h-full min-h-[500px] border border-[#333] bg-[#111] flex flex-col items-center justify-center text-[#444]">
        <div className="mb-4 opacity-20">
          <ImageIcon strokeWidth={0.5} size={64} />
        </div>
        <p className="font-bold uppercase tracking-widest text-xs text-[#666]">Waiting for render</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full border border-[#333]">
      {/* Viewer Area */}
      <div className="flex-1 relative overflow-hidden bg-[#000] min-h-[500px]">
        {viewMode === ViewMode.Result && (
          <img 
            src={generatedImage} 
            alt="Render Result" 
            className="w-full h-full object-contain"
          />
        )}

        {viewMode === ViewMode.Compare && (
          <div className="relative w-full h-full select-none cursor-ew-resize group"
               onMouseMove={(e) => {
                 const rect = e.currentTarget.getBoundingClientRect();
                 const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
                 setSliderPosition((x / rect.width) * 100);
               }}
               onTouchMove={(e) => {
                 const rect = e.currentTarget.getBoundingClientRect();
                 const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
                 setSliderPosition((x / rect.width) * 100);
               }}
          >
            {/* Background (Generated/After) */}
            <img 
              src={generatedImage} 
              alt="After" 
              className="absolute inset-0 w-full h-full object-contain"
            />

            {/* Foreground (Original/Before) - Clipped */}
            <div 
              className="absolute inset-0 overflow-hidden border-r border-[#F6D883]"
              style={{ width: `${sliderPosition}%` }}
            >
              <img 
                src={originalImage} 
                alt="Before" 
                className="absolute inset-0 w-full h-full object-contain max-w-none"
                style={{ width: '100vw' }}
              />
            </div>

            {/* Slider Handle */}
            <div 
              className="absolute top-0 bottom-0 w-px bg-[#F6D883] cursor-ew-resize z-20"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-[#F6D883] flex items-center justify-center">
                <ArrowRightLeft size={12} className="text-[#191919]" />
              </div>
            </div>

            {/* Overlay Text */}
            <div className="absolute bottom-6 left-6 text-xs font-bold uppercase tracking-widest text-white drop-shadow-md">Sketch</div>
            <div className="absolute bottom-6 right-6 text-xs font-bold uppercase tracking-widest text-[#F6D883] drop-shadow-md">Render</div>
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex justify-between items-center p-4 bg-[#191919] border-t border-[#333]">
        <div className="flex gap-4">
          <button 
            onClick={() => setViewMode(ViewMode.Compare)}
            className={`text-xs font-bold uppercase tracking-wider hover:text-[#F3F3EE] transition-colors ${viewMode === ViewMode.Compare ? 'text-[#F6D883] underline underline-offset-4' : 'text-[#666]'}`}
          >
            Comparison
          </button>
          <button 
            onClick={() => setViewMode(ViewMode.Result)}
            className={`text-xs font-bold uppercase tracking-wider hover:text-[#F3F3EE] transition-colors ${viewMode === ViewMode.Result ? 'text-[#F6D883] underline underline-offset-4' : 'text-[#666]'}`}
          >
            Full Result
          </button>
        </div>

        <button 
          onClick={handleDownload}
          className="flex items-center gap-2 px-6 py-2 bg-[#F3F3EE] hover:bg-white text-[#191919] text-xs font-bold uppercase tracking-widest transition-colors"
        >
          <Download size={14} />
          Download
        </button>
      </div>
    </div>
  );
};

export default ResultViewer;