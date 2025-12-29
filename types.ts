export type RenderCategory = 'exterior' | 'interior';

export interface EnvironmentPreset {
  id: string;
  name: string;
  description: string;
  promptModifier: string;
  iconStr: string; // Using string representation for icons to keep types simple
  colorFrom: string;
  colorTo: string;
  category: RenderCategory;
}

export interface RenderState {
  originalImage: string | null; // Base64
  generatedImage: string | null; // Base64
  isGenerating: boolean;
  error: string | null;
}

export enum ViewMode {
  Split = 'SPLIT',
  Compare = 'COMPARE',
  Result = 'RESULT'
}

export interface RenderSettings {
  creativityStrength: number; // 0.0 to 1.0
  negativePrompt: string;
  seed: number; // -1 for random
}
