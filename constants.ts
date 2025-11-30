import { HeadshotStyle, HeadshotStyleId, LightingType, EnvironmentType, Composition, CameraAngle, Preset } from './types';

// Legacy styles (kept for reference or quick-start templates)
export const HEADSHOT_STYLES: HeadshotStyle[] = [
  {
    id: HeadshotStyleId.CORPORATE,
    name: 'Corporate Classic',
    description: 'Standard LinkedIn-style. Polished, neutral background.',
    imageSrc: 'https://picsum.photos/id/1025/400/500', 
    prompt: 'Professional business headshot. Subject wearing formal suit/blouse. Neutral grey studio background. Soft, even lighting.'
  },
];

export const ENVIRONMENTS: { id: EnvironmentType; name: string; description: string; prompt: string }[] = [
  { id: 'studio_grey', name: 'Studio Grey', description: 'Clean, neutral backdrop', prompt: 'clean neutral grey studio background, seamless backdrop, professional studio setting' },
  { id: 'studio_color', name: 'Studio Color', description: 'Vibrant color pop', prompt: 'vibrant solid colored studio background, fashion editorial style' },
  { id: 'luxury_interior', name: 'Luxury Penthouse', description: 'High-end interior', prompt: 'blurred background of a luxury penthouse apartment, bokeh city lights out window, expensive furniture, interior design' },
  { id: 'urban_city', name: 'NYC Street', description: 'Busy city depth', prompt: 'busy New York City street background, yellow taxis blurred in distance, urban architecture, concrete jungle' },
  { id: 'nature_forest', name: 'Ethereal Forest', description: 'Soft nature greenery', prompt: 'lush green forest background, sun filtering through leaves, nature bokeh, organic feel' },
  { id: 'beach', name: 'Sunset Beach', description: 'Golden hour ocean', prompt: 'sunset beach background, ocean waves, golden sand, warm horizon, vacation vibes' },
  { id: 'cyberpunk_city', name: 'Neon City', description: 'Futuristic night vibes', prompt: 'futuristic cyberpunk city at night, neon signs, rain-slicked streets, blue and pink ambient light' },
];

export const LIGHTING_OPTIONS: { id: LightingType; name: string; description: string; prompt: string }[] = [
  { id: 'softbox', name: 'Softbox Studio', description: 'Flattering, soft light', prompt: 'soft diffused studio lighting, large softbox modifier, flattering for skin, catchlights in eyes, no harsh shadows' },
  { id: 'rembrandt', name: 'Rembrandt', description: 'Dramatic, moody', prompt: 'dramatic Rembrandt lighting, strong contrast (chiaroscuro), moody atmosphere, artistic shadow on one side of face' },
  { id: 'hard_sun', name: 'Hard Sunlight', description: 'Bright, crisp, contrast', prompt: 'direct hard sunlight, crisp shadows, high contrast, bright summer day feeling' },
  { id: 'natural_window', name: 'Window Light', description: 'Natural, soft directional', prompt: 'natural window light coming from side, soft falloff, indoor daylight ambiance' },
  { id: 'golden_hour', name: 'Golden Hour', description: 'Warm, low angle sun', prompt: 'warm golden hour sunlight, lens flare, backlighting, warm orange and yellow tones' },
  { id: 'neon', name: 'Neon Glow', description: 'Colored gel lighting', prompt: 'creative colored gel lighting, neon pink and blue rim light, cinematic club atmosphere' },
];

export const COMPOSITION_OPTIONS: { id: Composition; name: string; description: string; prompt: string }[] = [
  { id: 'center', name: 'Center Portrait', description: 'Classic, symmetrical', prompt: 'subject centered in frame, symmetrical composition, 85mm portrait lens' },
  { id: 'rule_of_thirds', name: 'Cinematic Thirds', description: 'Offset, storytelling', prompt: 'subject placed on rule of thirds, cinematic framing, negative space on side, storytelling composition' },
  { id: 'close_up', name: 'Tight Headshot', description: 'Focus on details', prompt: 'extreme close-up on face, detailed skin texture, macro details, intense eye contact' },
  { id: 'wide_shot', name: 'Full Body/Wide', description: 'Environmental context', prompt: 'wide angle shot, full body or 3/4 body visible, showing environment context, 35mm lens' },
];

export const PRESETS: Preset[] = [
  {
    id: 'linkedin_pro',
    name: 'LinkedIn Professional',
    description: 'The standard for business profiles. Clean, trustworthy, and polished.',
    config: { environment: 'studio_grey', lighting: 'softbox', composition: 'center' }
  },
  {
    id: 'vogue_editorial',
    name: 'Vogue Editorial',
    description: 'High-fashion aesthetic with dramatic hard lighting and color.',
    config: { environment: 'studio_color', lighting: 'hard_sun', composition: 'wide_shot' }
  },
  {
    id: 'cinematic_noir',
    name: 'Cinematic Noir',
    description: 'Moody, dark, and mysterious with city vibes.',
    config: { environment: 'urban_city', lighting: 'rembrandt', composition: 'rule_of_thirds' }
  },
  {
    id: 'casual_lifestyle',
    name: 'Casual Lifestyle',
    description: 'Relaxed, natural lighting in a comfortable setting.',
    config: { environment: 'luxury_interior', lighting: 'natural_window', composition: 'rule_of_thirds' }
  }
];