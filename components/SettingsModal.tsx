import React, { useState, useEffect } from 'react';
import { X, Settings, Key, Server, Cpu } from 'lucide-react';

export interface AISettings {
  provider: 'ollama' | 'lmstudio' | 'huggingface';
  baseUrl: string;
  model: string;
  apiKey: string;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AISettings;
  onSave: (settings: AISettings) => void;
}

const defaultSettings: Record<string, Partial<AISettings>> = {
  ollama: {
    baseUrl: 'http://localhost:11434',
    model: 'llava:13b',
  },
  lmstudio: {
    baseUrl: 'http://localhost:1234',
    model: 'llava-v1.6-34b',
  },
  huggingface: {
    baseUrl: 'https://api-inference.huggingface.co/models',
    model: 'stabilityai/stable-diffusion-xl-base-1.0',
  },
};

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState<AISettings>(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleProviderChange = (provider: AISettings['provider']) => {
    setLocalSettings({
      ...localSettings,
      provider,
      baseUrl: defaultSettings[provider].baseUrl || '',
      model: defaultSettings[provider].model || '',
    });
  };

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#191919] border border-[#333] w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#333]">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-[#FCD5D3]" />
            <h2 className="text-lg font-black uppercase tracking-wider text-[#F3F3EE]">
              AI Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#666] hover:text-[#F3F3EE] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Provider Selection */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#666] mb-3">
              AI Provider
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['ollama', 'lmstudio', 'huggingface'] as const).map((provider) => (
                <button
                  key={provider}
                  onClick={() => handleProviderChange(provider)}
                  className={`
                    p-3 border text-center transition-all duration-200
                    ${localSettings.provider === provider
                      ? 'border-[#FCD5D3] bg-[#FCD5D3]/10 text-[#FCD5D3]'
                      : 'border-[#333] hover:border-[#666] text-[#888] hover:text-[#F3F3EE]'}
                  `}
                >
                  <Cpu className="w-4 h-4 mx-auto mb-2" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    {provider === 'huggingface' ? 'HF' : provider}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Base URL */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#666] mb-2">
              <Server className="w-3 h-3 inline mr-2" />
              API Endpoint
            </label>
            <input
              type="text"
              value={localSettings.baseUrl}
              onChange={(e) => setLocalSettings({ ...localSettings, baseUrl: e.target.value })}
              placeholder="http://localhost:11434"
              className="w-full bg-[#111] border border-[#333] px-4 py-3 text-sm text-[#F3F3EE] placeholder-[#444] focus:border-[#FCD5D3] focus:outline-none transition-colors"
            />
          </div>

          {/* Model */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#666] mb-2">
              <Cpu className="w-3 h-3 inline mr-2" />
              Model Name
            </label>
            <input
              type="text"
              value={localSettings.model}
              onChange={(e) => setLocalSettings({ ...localSettings, model: e.target.value })}
              placeholder="llava:13b"
              className="w-full bg-[#111] border border-[#333] px-4 py-3 text-sm text-[#F3F3EE] placeholder-[#444] focus:border-[#FCD5D3] focus:outline-none transition-colors"
            />
          </div>

          {/* API Key (for Hugging Face) */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#666] mb-2">
              <Key className="w-3 h-3 inline mr-2" />
              API Key {localSettings.provider !== 'huggingface' && <span className="text-[#444]">(Optional)</span>}
            </label>
            <input
              type="password"
              value={localSettings.apiKey}
              onChange={(e) => setLocalSettings({ ...localSettings, apiKey: e.target.value })}
              placeholder={localSettings.provider === 'huggingface' ? 'hf_xxxxxxxxxxxxx' : 'Not required for local AI'}
              className="w-full bg-[#111] border border-[#333] px-4 py-3 text-sm text-[#F3F3EE] placeholder-[#444] focus:border-[#FCD5D3] focus:outline-none transition-colors"
            />
            {localSettings.provider === 'huggingface' && (
              <p className="mt-2 text-[9px] text-[#666] uppercase tracking-wider">
                Get your API key from huggingface.co/settings/tokens
              </p>
            )}
          </div>

          {/* Provider Info */}
          <div className="p-4 bg-[#111] border border-[#333]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#F6D883] mb-2">
              {localSettings.provider === 'ollama' && 'Ollama Setup'}
              {localSettings.provider === 'lmstudio' && 'LM Studio Setup'}
              {localSettings.provider === 'huggingface' && 'Hugging Face Setup'}
            </p>
            <p className="text-xs text-[#888] leading-relaxed">
              {localSettings.provider === 'ollama' &&
                'Install Ollama and run: ollama pull llava:13b. Ensure Ollama is running on localhost:11434.'}
              {localSettings.provider === 'lmstudio' &&
                'Download LM Studio and load a vision model. Start the local server on port 1234.'}
              {localSettings.provider === 'huggingface' &&
                'Create an account at huggingface.co and generate an API token with inference permissions.'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#333] flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-[#333] text-[#888] font-bold uppercase tracking-wider text-xs hover:border-[#666] hover:text-[#F3F3EE] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 bg-[#F6D883] text-[#191919] font-bold uppercase tracking-wider text-xs hover:bg-[#FCD5D3] transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
