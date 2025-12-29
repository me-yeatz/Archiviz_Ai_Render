import { EnvironmentPreset } from './types';
import { Sun, Moon, CloudRain, Sunset, CloudFog, Leaf, Lamp, Sofa, UtensilsCrossed, Bath, BedDouble, Building2 } from 'lucide-react';
import React from 'react';

// EXTERIOR ENVIRONMENTS
export const EXTERIOR_ENVIRONMENTS: EnvironmentPreset[] = [
  {
    id: 'sunny_day',
    name: 'Sunny Day',
    description: 'Clear blue skies, sharp shadows, high contrast.',
    promptModifier: 'exterior architectural photograph, sunny day, clear blue sky, bright natural lighting, sharp shadows, realistic summer atmosphere, building facade, outdoor view',
    iconStr: 'Sun',
    colorFrom: 'from-blue-400',
    colorTo: 'to-yellow-300',
    category: 'exterior'
  },
  {
    id: 'golden_hour',
    name: 'Golden Hour',
    description: 'Warm sunset lighting, long shadows, dramatic mood.',
    promptModifier: 'exterior architectural photograph, golden hour, sunset, warm orange and purple lighting, long dramatic shadows, cinematic lighting, evening atmosphere, building exterior',
    iconStr: 'Sunset',
    colorFrom: 'from-orange-500',
    colorTo: 'to-purple-600',
    category: 'exterior'
  },
  {
    id: 'modern_night',
    name: 'Urban Night',
    description: 'Night time, artificial lighting, interior glow.',
    promptModifier: 'exterior architectural photograph, night time, dark sky with stars, interior lights glowing warm yellow, exterior accent lighting, wet pavement reflections, urban night atmosphere, building at night',
    iconStr: 'Moon',
    colorFrom: 'from-indigo-900',
    colorTo: 'to-slate-800',
    category: 'exterior'
  },
  {
    id: 'overcast',
    name: 'Overcast / Soft',
    description: 'Diffused light, soft shadows, neutral tones.',
    promptModifier: 'exterior architectural photograph, overcast sky, diffused soft lighting, no harsh shadows, neutral white balance, minimalist architectural photography style, building facade',
    iconStr: 'CloudFog',
    colorFrom: 'from-gray-400',
    colorTo: 'to-slate-300',
    category: 'exterior'
  },
  {
    id: 'rainy',
    name: 'Rainy Mood',
    description: 'Wet surfaces, reflections, moody atmosphere.',
    promptModifier: 'exterior architectural photograph, rainy weather, wet surfaces, puddles with reflections, mist, moody blue tones, cold atmosphere, rain drops, building in rain',
    iconStr: 'CloudRain',
    colorFrom: 'from-slate-700',
    colorTo: 'to-blue-900',
    category: 'exterior'
  },
  {
    id: 'nature',
    name: 'Eco / Forest',
    description: 'Surrounded by lush vegetation and nature.',
    promptModifier: 'exterior architectural photograph, surrounded by lush green forest, nature integration, sunlight filtering through trees, organic atmosphere, landscaping focus, green building',
    iconStr: 'Leaf',
    colorFrom: 'from-emerald-600',
    colorTo: 'to-green-400',
    category: 'exterior'
  }
];

// INTERIOR ENVIRONMENTS
export const INTERIOR_ENVIRONMENTS: EnvironmentPreset[] = [
  {
    id: 'bright_modern',
    name: 'Bright Modern',
    description: 'Clean white walls, natural daylight, minimal furniture.',
    promptModifier: 'interior architectural photograph, bright modern interior, natural daylight streaming through large windows, clean white walls, minimal scandinavian furniture, wooden floors, airy atmosphere',
    iconStr: 'Sun',
    colorFrom: 'from-white',
    colorTo: 'to-gray-200',
    category: 'interior'
  },
  {
    id: 'warm_evening',
    name: 'Warm Evening',
    description: 'Cozy warm lighting, ambient lamps, evening atmosphere.',
    promptModifier: 'interior architectural photograph, warm evening lighting, cozy ambient atmosphere, table lamps and pendant lights on, warm yellow orange glow, comfortable living space, wooden accents',
    iconStr: 'Lamp',
    colorFrom: 'from-amber-400',
    colorTo: 'to-orange-600',
    category: 'interior'
  },
  {
    id: 'living_room',
    name: 'Living Room',
    description: 'Comfortable seating area, natural light, homey feel.',
    promptModifier: 'interior architectural photograph, modern living room, comfortable sofa and armchairs, coffee table, natural light, indoor plants, artwork on walls, cozy residential interior',
    iconStr: 'Sofa',
    colorFrom: 'from-stone-400',
    colorTo: 'to-amber-200',
    category: 'interior'
  },
  {
    id: 'kitchen_dining',
    name: 'Kitchen & Dining',
    description: 'Modern kitchen, dining area, functional elegance.',
    promptModifier: 'interior architectural photograph, modern kitchen and dining area, marble countertops, pendant lights over island, dining table with chairs, stainless steel appliances, functional elegant design',
    iconStr: 'UtensilsCrossed',
    colorFrom: 'from-stone-500',
    colorTo: 'to-slate-300',
    category: 'interior'
  },
  {
    id: 'bedroom',
    name: 'Bedroom',
    description: 'Peaceful bedroom, soft lighting, relaxing ambiance.',
    promptModifier: 'interior architectural photograph, modern bedroom, comfortable bed with premium bedding, soft ambient lighting, bedside tables with lamps, peaceful relaxing atmosphere, neutral color palette',
    iconStr: 'BedDouble',
    colorFrom: 'from-indigo-300',
    colorTo: 'to-purple-200',
    category: 'interior'
  },
  {
    id: 'bathroom',
    name: 'Bathroom',
    description: 'Clean spa-like bathroom, marble, premium fixtures.',
    promptModifier: 'interior architectural photograph, luxury modern bathroom, marble tiles, freestanding bathtub, rainfall shower, premium chrome fixtures, spa-like atmosphere, clean minimal design',
    iconStr: 'Bath',
    colorFrom: 'from-cyan-300',
    colorTo: 'to-blue-200',
    category: 'interior'
  }
];

// Combined for backward compatibility
export const ENVIRONMENTS: EnvironmentPreset[] = [
  ...EXTERIOR_ENVIRONMENTS,
  ...INTERIOR_ENVIRONMENTS
];

export const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'Sun': return <Sun className="w-6 h-6 text-white" />;
    case 'Sunset': return <Sunset className="w-6 h-6 text-white" />;
    case 'Moon': return <Moon className="w-6 h-6 text-white" />;
    case 'CloudFog': return <CloudFog className="w-6 h-6 text-white" />;
    case 'CloudRain': return <CloudRain className="w-6 h-6 text-white" />;
    case 'Leaf': return <Leaf className="w-6 h-6 text-white" />;
    case 'Lamp': return <Lamp className="w-6 h-6 text-white" />;
    case 'Sofa': return <Sofa className="w-6 h-6 text-white" />;
    case 'UtensilsCrossed': return <UtensilsCrossed className="w-6 h-6 text-white" />;
    case 'Bath': return <Bath className="w-6 h-6 text-white" />;
    case 'BedDouble': return <BedDouble className="w-6 h-6 text-white" />;
    case 'Building2': return <Building2 className="w-6 h-6 text-white" />;
    default: return <Sun className="w-6 h-6 text-white" />;
  }
};
