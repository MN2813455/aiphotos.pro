
export enum HeadshotStyleId {
  CORPORATE = 'CORPORATE',
  CREATIVE = 'CREATIVE',
  EDITORIAL = 'EDITORIAL',
  PARIS = 'PARIS',
  NYC_STREET = 'NYC_STREET',
  CYBERPUNK = 'CYBERPUNK',
  GOLDEN_HOUR = 'GOLDEN_HOUR'
}

export interface HeadshotStyle {
  id: HeadshotStyleId;
  name: string;
  description: string;
  imageSrc: string;
  prompt: string;
}

export interface UploadedImage {
  base64: string;
  mimeType: string;
  previewUrl: string;
}

// --- New Professional Studio Types ---

export type LightingType = 'softbox' | 'natural_window' | 'hard_sun' | 'studio_strobe' | 'neon' | 'rembrandt' | 'golden_hour';
export type CameraAngle = 'eye_level' | 'low_angle' | 'high_angle' | 'dutch_angle';
export type Composition = 'center' | 'rule_of_thirds' | 'close_up' | 'wide_shot';
export type EnvironmentType = 'studio_grey' | 'studio_color' | 'urban_city' | 'nature_forest' | 'luxury_interior' | 'beach' | 'cyberpunk_city';

export type AssetType = 'subject' | 'garment' | 'background' | 'prop' | 'reference';

// New Fine-Tuned Lighting Types
export type LightDirection = 'front' | 'left' | 'right' | 'back' | 'overhead' | 'bottom' | 'top-left' | 'top-right';
export type LightIntensity = 'dim' | 'soft' | 'natural' | 'hard' | 'intense';
export type LightColor = 'warm' | 'neutral' | 'cool' | 'neon_blue' | 'neon_pink' | 'golden';

export interface LightingSettings {
  direction: LightDirection;
  intensity: LightIntensity;
  color: LightColor;
}

export interface PhotoAsset {
  id: string;
  image: UploadedImage;
  type: AssetType;
  description?: string; // e.g. "Red silk dress" or "My vintage car"
}

export interface PhotoConfiguration {
  assets: PhotoAsset[]; // Replaces fixed subjectImage/clothingImage
  environment: EnvironmentType;
  lighting: LightingType; // Base style
  lightingSettings: LightingSettings; // Fine-tuning
  composition: Composition;
  promptModifiers: string[]; 
  customPrompt?: string;
  
  // Step-specific context prompts
  assetContext?: string;
  environmentContext?: string;
  lightingContext?: string;
}

export interface GeneratedImage {
  id: string;
  url: string;
  timestamp: number;
  config: PhotoConfiguration;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  coverImage?: string; // URL of the last generated image
  images: GeneratedImage[];
}

export interface GenerationResult {
  imageUrl: string;
  timestamp: number;
}

export interface HistoryItem {
  id: string;
  generatedImage: string;
  styleId: HeadshotStyleId;
  timestamp: number;
  clothingImage?: string; 
}

export interface Preset {
  id: string;
  name: string;
  description: string;
  imageSrc?: string;
  config: Partial<PhotoConfiguration>;
}

export interface EditorSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  grayscale: number;
  sepia: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}
