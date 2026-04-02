// Video/Image effects and filters system

export type EffectType =
  | "sepia"
  | "grayscale"
  | "blur"
  | "brightness"
  | "contrast"
  | "saturate"
  | "hueRotate"
  | "invert"
  | "none";

export type FilterPreset =
  | "none"
  | "vintage"
  | "coolBlue"
  | "warmGold"
  | "noir"
  | "vivid"
  | "soft";

export interface Effect {
  type: EffectType;
  value: number;
}

export interface FilterPresetConfig {
  name: FilterPreset;
  label: string;
  effects: Effect[];
  emoji: string;
}

export const filterPresets: Record<FilterPreset, FilterPresetConfig> = {
  none: {
    name: "none",
    label: "Original",
    effects: [],
    emoji: "📸",
  },
  vintage: {
    name: "vintage",
    label: "Vintage",
    effects: [
      { type: "sepia", value: 100 },
      { type: "saturate", value: 70 },
      { type: "brightness", value: 110 },
    ],
    emoji: "🎬",
  },
  coolBlue: {
    name: "coolBlue",
    label: "Cool Blue",
    effects: [
      { type: "hueRotate", value: 210 },
      { type: "saturate", value: 120 },
      { type: "contrast", value: 110 },
    ],
    emoji: "❄️",
  },
  warmGold: {
    name: "warmGold",
    label: "Warm Gold",
    effects: [
      { type: "hueRotate", value: 30 },
      { type: "saturate", value: 130 },
      { type: "brightness", value: 115 },
    ],
    emoji: "🌅",
  },
  noir: {
    name: "noir",
    label: "Noir",
    effects: [
      { type: "grayscale", value: 100 },
      { type: "contrast", value: 140 },
      { type: "brightness", value: 90 },
    ],
    emoji: "⬛",
  },
  vivid: {
    name: "vivid",
    label: "Vivid",
    effects: [
      { type: "saturate", value: 150 },
      { type: "contrast", value: 120 },
    ],
    emoji: "🎨",
  },
  soft: {
    name: "soft",
    label: "Soft",
    effects: [
      { type: "blur", value: 2 },
      { type: "brightness", value: 105 },
      { type: "saturate", value: 85 },
    ],
    emoji: "🌸",
  },
};

export function getFilterCSSString(effects: Effect[]): string {
  const filterArray: string[] = [];

  effects.forEach((effect) => {
    switch (effect.type) {
      case "sepia":
        filterArray.push(`sepia(${effect.value}%)`);
        break;
      case "grayscale":
        filterArray.push(`grayscale(${effect.value}%)`);
        break;
      case "blur":
        filterArray.push(`blur(${effect.value}px)`);
        break;
      case "brightness":
        filterArray.push(`brightness(${effect.value}%)`);
        break;
      case "contrast":
        filterArray.push(`contrast(${effect.value}%)`);
        break;
      case "saturate":
        filterArray.push(`saturate(${effect.value}%)`);
        break;
      case "hueRotate":
        filterArray.push(`hue-rotate(${effect.value}deg)`);
        break;
      case "invert":
        filterArray.push(`invert(${effect.value}%)`);
        break;
      default:
        break;
    }
  });

  return filterArray.join(" ");
}

export function applyFilterToCanvas(
  canvas: HTMLCanvasElement,
  effects: Effect[]
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  effects.forEach((effect) => {
    switch (effect.type) {
      case "grayscale":
        applyGrayscale(data, effect.value);
        break;
      case "sepia":
        applySepia(data, effect.value);
        break;
      case "brightness":
        applyBrightness(data, effect.value);
        break;
      case "contrast":
        applyContrast(data, effect.value);
        break;
      case "saturate":
        applySaturate(data, effect.value);
        break;
      case "invert":
        applyInvert(data, effect.value);
        break;
      default:
        break;
    }
  });

  ctx.putImageData(imageData, 0, 0);
}

function applyGrayscale(data: Uint8ClampedArray, value: number): void {
  const intensity = value / 100;
  for (let i = 0; i < data.length; i += 4) {
    const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
    data[i] = Math.round(data[i] * (1 - intensity) + gray * intensity);
    data[i + 1] = Math.round(data[i + 1] * (1 - intensity) + gray * intensity);
    data[i + 2] = Math.round(data[i + 2] * (1 - intensity) + gray * intensity);
  }
}

function applySepia(data: Uint8ClampedArray, value: number): void {
  const intensity = value / 100;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const sepiaR = r * 0.393 + g * 0.769 + b * 0.189;
    const sepiaG = r * 0.349 + g * 0.686 + b * 0.168;
    const sepiaB = r * 0.272 + g * 0.534 + b * 0.131;

    data[i] = Math.round(r * (1 - intensity) + sepiaR * intensity);
    data[i + 1] = Math.round(g * (1 - intensity) + sepiaG * intensity);
    data[i + 2] = Math.round(b * (1 - intensity) + sepiaB * intensity);
  }
}

function applyBrightness(data: Uint8ClampedArray, value: number): void {
  const factor = value / 100;
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, Math.round(data[i] * factor));
    data[i + 1] = Math.min(255, Math.round(data[i + 1] * factor));
    data[i + 2] = Math.min(255, Math.round(data[i + 2] * factor));
  }
}

function applyContrast(data: Uint8ClampedArray, value: number): void {
  const factor = (value - 50) / 50;
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, Math.max(0, Math.round((data[i] - 128) * (1 + factor) + 128)));
    data[i + 1] = Math.min(255, Math.max(0, Math.round((data[i + 1] - 128) * (1 + factor) + 128)));
    data[i + 2] = Math.min(255, Math.max(0, Math.round((data[i + 2] - 128) * (1 + factor) + 128)));
  }
}

function applySaturate(data: Uint8ClampedArray, value: number): void {
  const factor = value / 100;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const gray = r * 0.299 + g * 0.587 + b * 0.114;

    data[i] = Math.round(gray + (r - gray) * factor);
    data[i + 1] = Math.round(gray + (g - gray) * factor);
    data[i + 2] = Math.round(gray + (b - gray) * factor);
  }
}

function applyInvert(data: Uint8ClampedArray, value: number): void {
  const intensity = value / 100;
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.round(data[i] * (1 - intensity) + (255 - data[i]) * intensity);
    data[i + 1] = Math.round(data[i + 1] * (1 - intensity) + (255 - data[i + 1]) * intensity);
    data[i + 2] = Math.round(data[i + 2] * (1 - intensity) + (255 - data[i + 2]) * intensity);
  }
}
