import React from 'react';
import { ENVIRONMENTS, getIcon } from '../constants';
import { EnvironmentPreset } from '../types';

interface EnvironmentSelectorProps {
  selectedEnv: EnvironmentPreset;
  onSelect: (env: EnvironmentPreset) => void;
  disabled: boolean;
}

const EnvironmentSelector: React.FC<EnvironmentSelectorProps> = ({ selectedEnv, onSelect, disabled }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        {ENVIRONMENTS.map((env) => {
          const isSelected = selectedEnv.id === env.id;
          return (
            <button
              key={env.id}
              onClick={() => onSelect(env)}
              disabled={disabled}
              className={`
                group relative flex flex-col items-start p-4 border transition-all duration-200 h-24 justify-between
                ${isSelected 
                  ? 'bg-[#FCD5D3] border-[#FCD5D3]' 
                  : 'bg-transparent border-[#333] hover:border-[#F3F3EE]'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className={`transition-colors duration-200 ${isSelected ? 'text-[#191919]' : 'text-[#666] group-hover:text-[#F3F3EE]'}`}>
                {/* Clone the icon element to add custom classes if needed, or just wrap it */}
                <div className="[&>svg]:w-5 [&>svg]:h-5 [&>svg]:stroke-[1.5]">
                   {React.cloneElement(getIcon(env.iconStr) as React.ReactElement<{ className?: string }>, { className: isSelected ? 'text-[#191919]' : 'text-current' })}
                </div>
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest text-left leading-tight ${isSelected ? 'text-[#191919]' : 'text-[#888] group-hover:text-[#F3F3EE]'}`}>
                {env.name}
              </span>
            </button>
          );
        })}
      </div>
      <div className="pt-2 border-t border-[#333] mt-2">
        <p className="text-[10px] text-[#666] uppercase tracking-widest">
          Info <span className="text-[#F3F3EE] ml-2">{selectedEnv.description}</span>
        </p>
      </div>
    </div>
  );
};

export default EnvironmentSelector;