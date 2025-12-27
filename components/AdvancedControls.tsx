import React, { useState } from 'react';
import { Sliders, Shuffle, AlertCircle } from 'lucide-react';
import { RenderSettings } from '../types';

interface AdvancedControlsProps {
    settings: RenderSettings;
    onUpdate: (settings: RenderSettings) => void;
    disabled: boolean;
}

const AdvancedControls: React.FC<AdvancedControlsProps> = ({ settings, onUpdate, disabled }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleChange = (key: keyof RenderSettings, value: any) => {
        onUpdate({
            ...settings,
            [key]: value
        });
    };

    return (
        <div className="border-b border-[#333333]">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 hover:bg-[#1f1f1f] transition-colors"
            >
                <div className="flex items-center gap-3">
                    <Sliders className={`w-4 h-4 ${isOpen ? 'text-[#F6D883]' : 'text-[#666]'}`} />
                    <span className="text-[10px] font-bold tracking-widest text-[#F3F3EE] uppercase">Advanced Control</span>
                </div>
                <span className={`text-[10px] text-[#666] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {isOpen && (
                <div className="px-6 pb-6 space-y-6 bg-[#151515]">
                    {/* Creativity/Strength Slider */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider">
                            <span className="text-[#888]">Creativity / Transformation</span>
                            <span className="text-[#F6D883]">{Math.round(settings.creativityStrength * 100)}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            disabled={disabled}
                            value={settings.creativityStrength * 100}
                            onChange={(e) => handleChange('creativityStrength', parseInt(e.target.value) / 100)}
                            className="w-full h-1 bg-[#333333] rounded-lg appearance-none cursor-pointer accent-[#F6D883]"
                        />
                        <div className="flex justify-between text-[8px] uppercase tracking-widest text-[#444]">
                            <span>Exact Sketch</span>
                            <span>High AI Freedom</span>
                        </div>
                    </div>

                    {/* Negative Prompt */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider">
                            <span className="text-[#888]">Exclude Details</span>
                        </div>
                        <textarea
                            value={settings.negativePrompt}
                            onChange={(e) => handleChange('negativePrompt', e.target.value)}
                            disabled={disabled}
                            placeholder="e.g. people, cars, trees, bright colors, blurry..."
                            className="w-full bg-[#0F0F0F] border border-[#333] text-[#F3F3EE] text-xs p-3 focus:outline-none focus:border-[#F6D883] h-20 resize-none font-mono placeholder:text-[#333]"
                        />
                    </div>

                    {/* Seed */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider">
                            <span className="text-[#888]">Global Seed</span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={settings.seed === -1 ? '' : settings.seed}
                                placeholder="Random"
                                disabled={disabled}
                                onChange={(e) => handleChange('seed', e.target.value === '' ? -1 : parseInt(e.target.value))}
                                className="flex-1 bg-[#0F0F0F] border border-[#333] text-[#F3F3EE] text-xs p-3 focus:outline-none focus:border-[#F6D883] font-mono tracking-widest"
                            />
                            <button
                                onClick={() => handleChange('seed', Math.floor(Math.random() * 999999999))}
                                disabled={disabled}
                                className="p-3 border border-[#333] bg-[#1f1f1f] hover:bg-[#F6D883] hover:text-[#191919] hover:border-[#F6D883] transition-colors text-[#666]"
                                title="Randomize Seed"
                            >
                                <Shuffle size={14} />
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-2 items-start p-3 bg-[#111] border border-[#222]">
                        <AlertCircle className="w-3 h-3 text-[#555] mt-0.5" />
                        <p className="text-[9px] text-[#555] leading-relaxed">
                            Higher creativity values may alter geometry. Keep below 60% to strictly preserve SketchUp lines.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdvancedControls;
