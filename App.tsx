import React, { useState } from 'react';
import { Layers, Wand2, AlertCircle, ArrowDownRight, Settings } from 'lucide-react';
import ImageUpload from './components/ImageUpload';
import AdvancedControls from './components/AdvancedControls';
import EnvironmentSelector from './components/EnvironmentSelector';
import ResultViewer from './components/ResultViewer';
import SettingsModal, { AISettings } from './components/SettingsModal';
import { ENVIRONMENTS } from './constants';
import { EnvironmentPreset, RenderSettings } from './types';
import { generateRender, checkAIHealth } from './services/localAIService';

// Load saved AI settings from localStorage
const loadAISettings = (): AISettings => {
  const saved = localStorage.getItem('archiviz-ai-settings');
  if (saved) {
    return JSON.parse(saved);
  }
  return {
    provider: 'huggingface',
    baseUrl: 'https://api-inference.huggingface.co/models',
    model: 'stabilityai/stable-diffusion-xl-base-1.0',
    apiKey: '',
  };
};

// Save AI settings to localStorage
const saveAISettings = (settings: AISettings) => {
  localStorage.setItem('archiviz-ai-settings', JSON.stringify(settings));
};

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedEnv, setSelectedEnv] = useState<EnvironmentPreset>(ENVIRONMENTS[0]);
  const [renderSettings, setRenderSettings] = useState<RenderSettings>({
    creativityStrength: 0.75,
    negativePrompt: '',
    seed: -1
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiStatus, setAiStatus] = useState<{ available: boolean; provider: string; message: string } | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [aiSettings, setAiSettings] = useState<AISettings>(loadAISettings());
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Check AI health on mount
  React.useEffect(() => {
    checkAIHealth().then(setAiStatus).catch(() => {
      setAiStatus({ available: false, provider: 'Unknown', message: 'Failed to check AI status' });
    });
  }, []);

  const handleImageUpload = (base64: string) => {
    setOriginalImage(base64);
    setGeneratedImage(null); // Reset result on new upload
    setError(null);
  };

  const handleClear = () => {
    setOriginalImage(null);
    setGeneratedImage(null);
    setError(null);
  };

  const handleSaveAISettings = (settings: AISettings) => {
    setAiSettings(settings);
    saveAISettings(settings);
    // Re-check AI health with new settings
    checkAIHealth().then(setAiStatus).catch(() => {
      setAiStatus({ available: false, provider: 'Unknown', message: 'Failed to check AI status' });
    });
  };

  const handleNavClick = (section: string) => {
    setActiveSection(section === activeSection ? null : section);
  };

  const handleGenerate = async () => {
    if (!originalImage) return;

    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const result = await generateRender(originalImage, selectedEnv, renderSettings);
      setGeneratedImage(result);
    } catch (err: any) {
      setError(err.message || "Something went wrong during generation.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-[#191919] text-[#F3F3EE] selection:bg-[#FCD5D3] selection:text-[#191919] flex flex-col overflow-hidden">
      {/* Unified One-Line Header */}
      <header className="flex-none border-b border-[#333333] h-16 md:h-20 bg-[#191919] z-50">
        <div className="h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/Logo_Icon.png" alt="ARCHIVIZ Logo" className="w-10 h-10 md:w-12 md:h-12 object-contain" />
            <div className="flex flex-col">
              <h1 className="text-xl md:text-2xl font-black tracking-tighter text-[#FCD5D3]">
                ARCHIVIZ<sup className="text-[10px] md:text-sm font-bold ml-0.5">®</sup>
              </h1>
              <span className="text-[8px] md:text-[9px] italic text-[#555] tracking-wide">by: yeatz</span>
            </div>
            <div className="hidden md:block w-px h-10 bg-[#333333] ml-2"></div>
            <h2 className="hidden md:block text-2xl font-black uppercase tracking-tighter text-[#F3F3EE]">
              Render Studio
            </h2>
          </div>

          <nav className="flex items-center gap-4 md:gap-6 text-[10px] md:text-xs font-bold tracking-widest uppercase">
            <button
              onClick={() => handleNavClick('work')}
              className={`transition-colors ${activeSection === 'work' ? 'text-[#FCD5D3]' : 'text-[#888] hover:text-[#F3F3EE]'}`}
            >
              Work
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className={`transition-colors hidden sm:block ${activeSection === 'about' ? 'text-[#FCD5D3]' : 'text-[#888] hover:text-[#F3F3EE]'}`}
            >
              About
            </button>
            <button
              onClick={() => handleNavClick('news')}
              className={`transition-colors hidden sm:block ${activeSection === 'news' ? 'text-[#FCD5D3]' : 'text-[#888] hover:text-[#F3F3EE]'}`}
            >
              News
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="text-[#888] hover:text-[#F6D883] transition-colors flex items-center gap-1"
              title="AI Settings"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden md:inline">Settings</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area - Fills remaining height */}
      <main className="flex-1 flex overflow-hidden">

        {/* Left Column: Controls (Scrollable if needed on small screens) */}
        <div className="w-full lg:w-[450px] xl:w-[500px] border-r border-[#333333] flex flex-col bg-[#191919] flex-none overflow-y-auto">

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-500/10 border-b border-red-500/20 flex items-start gap-3 flex-none">
              <AlertCircle className="text-red-500 w-4 h-4 mt-0.5" />
              <div>
                <h3 className="text-red-400 font-bold uppercase text-[10px] tracking-wider mb-1">Error</h3>
                <p className="text-red-300 text-xs">{error}</p>
              </div>
            </div>
          )}

          {/* Step 1: Upload */}
          <div className="p-6 border-b border-[#333333] flex-none">
            <div className="flex items-baseline justify-between mb-4">
              <span className="text-[10px] font-bold tracking-widest text-[#666] uppercase">01 / Input</span>
              <span className="text-[10px] font-bold tracking-widest text-[#FCD5D3] uppercase">Sketch Model</span>
            </div>
            <div className="h-40 lg:h-48">
              <ImageUpload
                currentImage={originalImage}
                onImageUpload={handleImageUpload}
                onClear={handleClear}
                disabled={isGenerating}
              />
            </div>
          </div>

          {/* Step 2: Environment */}
          <div className="p-6 border-b border-[#333333] flex-none">
            <div className="flex items-baseline justify-between mb-4">
              <span className="text-[10px] font-bold tracking-widest text-[#666] uppercase">02 / Atmosphere</span>
              <span className="text-[10px] font-bold tracking-widest text-[#FCD5D3] uppercase">Style Preset</span>
            </div>
            <EnvironmentSelector
              selectedEnv={selectedEnv}
              onSelect={setSelectedEnv}
              disabled={isGenerating}
            />
          </div>

          {/* Step 3: Advanced Controls */}
          <AdvancedControls
            settings={renderSettings}
            onUpdate={setRenderSettings}
            disabled={isGenerating}
          />

          {/* Step 4: Action (Pushed to bottom) */}
          <div className="p-6 mt-auto flex-none bg-[#191919] sticky bottom-0 border-t border-[#333333]">
            <div className="flex items-baseline justify-between mb-3">
              <span className="text-[10px] font-bold tracking-widest text-[#666] uppercase">04 / Process</span>
            </div>
            <button
              onClick={handleGenerate}
              disabled={!originalImage || isGenerating}
              className={`
                w-full h-16 text-lg font-black uppercase tracking-wider flex items-center justify-between px-6 transition-all duration-300
                ${!originalImage || isGenerating
                  ? 'bg-[#222] text-[#444] cursor-not-allowed'
                  : 'bg-[#F6D883] text-[#191919] hover:bg-[#FCD5D3]'}
              `}
            >
              <span className="flex items-center gap-3">
                {isGenerating ? 'Rendering...' : 'Generate Render'}
              </span>
              {isGenerating ? (
                <div className="w-5 h-5 border-2 border-[#191919]/30 border-t-[#191919] rounded-full animate-spin"></div>
              ) : (
                <ArrowDownRight className="w-6 h-6" />
              )}
            </button>
            <div className="mt-4 flex justify-between items-center text-[9px] uppercase tracking-widest font-bold">
              <span className={aiStatus?.available ? 'text-[#F6D883]' : 'text-red-500'}>
                {aiStatus ? `${aiStatus.provider} ${aiStatus.available ? '●' : '○'}` : 'Checking AI...'}
              </span>
              <span className="text-[#444]">Local AI Rendering</span>
            </div>
          </div>
        </div>

        {/* Right Column: Visualization (Fills remaining space) */}
        <div className="flex-1 bg-[#191919] flex flex-col min-w-0">
          <div className="h-14 border-b border-[#333333] flex items-center justify-between px-6 flex-none">
            <span className="text-[10px] font-bold tracking-widest text-[#666] uppercase">04 / Visualization Output</span>
            {generatedImage && (
              <span className="text-[10px] font-bold text-[#F6D883] uppercase tracking-wider animate-pulse flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F6D883]"></span>
                Complete
              </span>
            )}
          </div>

          <div className="flex-1 p-6 relative bg-[#111] overflow-hidden">
            <div className="absolute inset-6"> {/* Constrain height to padding box */}
              <ResultViewer
                originalImage={originalImage}
                generatedImage={generatedImage}
                isGenerating={isGenerating}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex-none h-10 border-t border-[#333333] bg-[#191919] flex items-center justify-center px-6">
        <p className="text-[9px] text-[#444] tracking-widest uppercase">
          <span className="text-[#666]">Where Sketches Become Reality</span>
          <span className="mx-3 text-[#333]">|</span>
          <span className="italic text-[#555]">by yeatz 2025</span>
        </p>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={aiSettings}
        onSave={handleSaveAISettings}
      />

      {/* Info Panel Overlay for Work/About/News */}
      {activeSection && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setActiveSection(null)}
          />
          <div className="relative bg-[#191919] border border-[#333] w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-8">
              <h2 className="text-2xl font-black uppercase tracking-tighter text-[#FCD5D3] mb-6">
                {activeSection === 'work' && 'Our Work'}
                {activeSection === 'about' && 'About ARCHIVIZ'}
                {activeSection === 'news' && 'Latest News'}
              </h2>

              {activeSection === 'work' && (
                <div className="space-y-4 text-[#888]">
                  <p className="text-sm leading-relaxed">
                    ARCHIVIZ® Render Studio transforms architectural sketches and 3D models into
                    photorealistic visualizations using cutting-edge AI technology.
                  </p>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="aspect-video bg-[#111] border border-[#333] flex items-center justify-center">
                      <span className="text-[10px] text-[#444] uppercase tracking-widest">Project 01</span>
                    </div>
                    <div className="aspect-video bg-[#111] border border-[#333] flex items-center justify-center">
                      <span className="text-[10px] text-[#444] uppercase tracking-widest">Project 02</span>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'about' && (
                <div className="space-y-4 text-[#888]">
                  <p className="text-sm leading-relaxed">
                    ARCHIVIZ® is an AI-powered architectural visualization tool designed for architects,
                    designers, and visualization artists.
                  </p>
                  <p className="text-sm leading-relaxed">
                    Our mission is to bridge the gap between conceptual design and photorealistic
                    presentation, enabling rapid iteration and creative exploration.
                  </p>

                  {/* Setup Guide */}
                  <div className="mt-6 p-4 bg-[#111] border border-[#333]">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#F6D883] mb-3">
                      Quick Setup Guide
                    </p>
                    <div className="space-y-3 text-xs">
                      <div className="flex gap-3">
                        <span className="text-[#FCD5D3] font-bold">1.</span>
                        <p className="text-[#888]">
                          Go to <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-[#F6D883] hover:underline">huggingface.co/settings/tokens</a>
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <span className="text-[#FCD5D3] font-bold">2.</span>
                        <p className="text-[#888]">Create a new token with "Read" permission</p>
                      </div>
                      <div className="flex gap-3">
                        <span className="text-[#FCD5D3] font-bold">3.</span>
                        <p className="text-[#888]">Click <span className="text-[#F6D883]">Settings</span> button (top right) and paste your API key</p>
                      </div>
                      <div className="flex gap-3">
                        <span className="text-[#FCD5D3] font-bold">4.</span>
                        <p className="text-[#888]">Upload a sketch and click Generate!</p>
                      </div>
                    </div>
                  </div>

                  {/* Recommended Models */}
                  <div className="p-4 bg-[#111] border border-[#333]">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#F6D883] mb-3">
                      Recommended Models
                    </p>
                    <div className="space-y-2 text-xs text-[#666]">
                      <p><span className="text-[#888]">Text-to-Image:</span> stabilityai/stable-diffusion-xl-base-1.0</p>
                      <p><span className="text-[#888]">Image-to-Image:</span> timbrooks/instruct-pix2pix</p>
                      <p><span className="text-[#888]">Architecture:</span> stabilityai/stable-diffusion-2-1</p>
                    </div>
                  </div>

                  {/* Tech Stack */}
                  <div className="p-4 bg-[#111] border border-[#333]">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#F6D883] mb-2">
                      Technology Stack
                    </p>
                    <p className="text-xs text-[#666]">
                      React + TypeScript + Tailwind CSS + Hugging Face Inference API
                    </p>
                  </div>
                </div>
              )}

              {activeSection === 'news' && (
                <div className="space-y-4 text-[#888]">
                  <div className="border-b border-[#333] pb-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#F6D883] mb-1">
                      Dec 2024
                    </p>
                    <p className="text-sm">Launch of ARCHIVIZ® Render Studio v1.0</p>
                  </div>
                  <div className="border-b border-[#333] pb-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#F6D883] mb-1">
                      Coming Soon
                    </p>
                    <p className="text-sm">Batch processing and project management features</p>
                  </div>
                </div>
              )}

              <button
                onClick={() => setActiveSection(null)}
                className="mt-8 w-full py-3 border border-[#333] text-[#888] font-bold uppercase tracking-wider text-xs hover:border-[#666] hover:text-[#F3F3EE] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;