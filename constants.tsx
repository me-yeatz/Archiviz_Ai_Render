import { EnvironmentPreset } from './types';
import { Sun, Moon, CloudRain, Sunset, CloudFog, Leaf } from 'lucide-react';
import React from 'react';

// We export the icons as components for usage, but data structure keeps things serializable if needed
export const ENVIRONMENTS: EnvironmentPreset[] = [
  {
    id: 'sunny_day',
    name: 'Sunny Day',
    description: 'Clear blue skies, sharp shadows, high contrast.',
    promptModifier: 'sunny day, clear blue sky, bright natural lighting, sharp shadows, realistic summer atmosphere',
    iconStr: 'Sun',
    colorFrom: 'from-blue-400',
    colorTo: 'to-yellow-300'
  },
  {
    id: 'golden_hour',
    name: 'Golden Hour',
    description: 'Warm sunset lighting, long shadows, dramatic mood.',
    promptModifier: 'golden hour, sunset, warm orange and purple lighting, long dramatic shadows, cinematic lighting, evening atmosphere',
    iconStr: 'Sunset',
    colorFrom: 'from-orange-500',
    colorTo: 'to-purple-600'
  },
  {
    id: 'modern_night',
    name: 'Urban Night',
    description: 'Night time, artificial lighting, interior glow.',
    promptModifier: 'night time, dark sky with stars, interior lights glowing warm yellow, exterior accent lighting, wet pavement reflections, urban night atmosphere',
    iconStr: 'Moon',
    colorFrom: 'from-indigo-900',
    colorTo: 'to-slate-800'
  },
  {
    id: 'overcast',
    name: 'Overcast / Soft',
    description: 'Diffused light, soft shadows, neutral tones.',
    promptModifier: 'overcast sky, diffused soft lighting, no harsh shadows, neutral white balance, minimalist architectural photography style',
    iconStr: 'CloudFog',
    colorFrom: 'from-gray-400',
    colorTo: 'to-slate-300'
  },
  {
    id: 'rainy',
    name: 'Rainy Mood',
    description: 'Wet surfaces, reflections, moody atmosphere.',
    promptModifier: 'rainy weather, wet surfaces, puddles with reflections, mist, moody blue tones, cold atmosphere, rain drops',
    iconStr: 'CloudRain',
    colorFrom: 'from-slate-700',
    colorTo: 'to-blue-900'
  },
  {
    id: 'nature',
    name: 'Eco / Forest',
    description: 'Surrounded by lush vegetation and nature.',
    promptModifier: 'surrounded by lush green forest, nature integration, sunlight filtering through trees, organic atmosphere, landscaping focus',
    iconStr: 'Leaf',
    colorFrom: 'from-emerald-600',
    colorTo: 'to-green-400'
  }
];

export const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'Sun': return <Sun className="w-6 h-6 text-white" />;
    case 'Sunset': return <Sunset className="w-6 h-6 text-white" />;
    case 'Moon': return <Moon className="w-6 h-6 text-white" />;
    case 'CloudFog': return <CloudFog className="w-6 h-6 text-white" />;
    case 'CloudRain': return <CloudRain className="w-6 h-6 text-white" />;
    case 'Leaf': return <Leaf className="w-6 h-6 text-white" />;
    default: return <Sun className="w-6 h-6 text-white" />;
  }
};