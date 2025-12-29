import React, { useState } from 'react';
import { EXTERIOR_ENVIRONMENTS, INTERIOR_ENVIRONMENTS, getIcon } from '../constants';
import { EnvironmentPreset, RenderCategory } from '../types';
import { Building2, Home } from 'lucide-react';

interface EnvironmentSelectorProps {
  selectedEnv: EnvironmentPreset;
  onSelect: (env: EnvironmentPreset) => void;
  disabled: boolean;
}

const EnvironmentSelector: React.FC<EnvironmentSelectorProps> = ({ selectedEnv, onSelect, disabled }) => {
  const [activeCategory, setActiveCategory] = useState<RenderCategory>(selectedEnv.category || 'exterior');

  const environments = activeCategory === 'exterior' ? EXTERIOR_ENVIRONMENTS : INTERIOR_ENVIRONMENTS;

  const handleCategoryChange = (category: RenderCategory) => {
    setActiveCategory(category);
    const envs = category === 'exterior' ? EXTERIOR_ENVIRONMENTS : INTERIOR_ENVIRONMENTS;
    if (envs.length > 0 && selectedEnv.category !== category) {
      onSelect(envs[0]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Category Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => handleCategoryChange('exterior')}
          disabled={disabled}
          className={`
            flex-1 flex items-center justify-center gap-2 py-3 px-4 text-[10px] font-bold uppercase tracking-widest transition-all duration-200 border
            ${activeCategory === 'exterior'
              ? 'bg-[#F6D883] text-[#191919] border-[#F6D883]'
              : 'bg-transparent text-[#888] border-[#333] hover:border-[#F3F3EE] hover:text-[#F3F3EE]'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <Building2 className="w-4 h-4" />
          Exterior
        </button>
        <button
          onClick={() => handleCategoryChange('interior')}
          disabled={disabled}
          className={`
            flex-1 flex items-center justify-center gap-2 py-3 px-4 text-[10px] font-bold uppercase tracking-widest transition-all duration-200 border
            ${activeCategory === 'interior'
              ? 'bg-[#FCD5D3] text-[#191919] border-[#FCD5D3]'
              : 'bg-transparent text-[#888] border-[#333] hover:border-[#F3F3EE] hover:text-[#F3F3EE]'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <Home className="w-4 h-4" />
          Interior
        </button>
      </div>

      {/* Environment Grid */}
      <div className="grid grid-cols-2 gap-2">
        {environments.map((env) => {
          const isSelected = selectedEnv.id === env.id;
          return (
            <button
              key={env.id}
              onClick={() => onSelect(env)}
              disabled={disabled}
              className={`
                group relative flex flex-col items-start p-4 border transition-all duration-200 h-24 justify-between
                ${isSelected
                  ? activeCategory === 'exterior'
                    ? 'bg-[#F6D883] border-[#F6D883]'
                    : 'bg-[#FCD5D3] border-[#FCD5D3]'
                  : 'bg-transparent border-[#333] hover:border-[#F3F3EE]'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className={`transition-colors duration-200 ${isSelected ? 'text-[#191919]' : 'text-[#666] group-hover:text-[#F3F3EE]'}`}>
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

      {/* Info Section */}
      <div className="pt-2 border-t border-[#333] mt-2">
        <p className="text-[10px] text-[#666] uppercase tracking-widest">
          <span className={activeCategory === 'exterior' ? 'text-[#F6D883]' : 'text-[#FCD5D3]'}>
            {activeCategory}
          </span>
          <span className="mx-2">|</span>
          <span className="text-[#F3F3EE]">{selectedEnv.description}</span>
        </p>
      </div>
    </div>
  );
};

export default EnvironmentSelector;
