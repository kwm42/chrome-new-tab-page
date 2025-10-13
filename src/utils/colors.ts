/**
 * 颜色工具类
 * 用于颜色处理和转换
 */

/**
 * 浅色调色板 - 适合作为图标背景
 * 这些颜色足够浅，不会遮挡深色或浅色的 favicon
 */
export const LIGHT_COLORS = [
  '#E3F2FD', // 浅蓝
  '#F3E5F5', // 浅紫
  '#E8F5E9', // 浅绿
  '#FFF3E0', // 浅橙
  '#FCE4EC', // 浅粉
  '#E0F2F1', // 浅青
  '#F9FBE7', // 浅黄绿
  '#FFF9C4', // 浅黄
  '#FFEBEE', // 浅红
  '#E1F5FE', // 天蓝
  '#F1F8E9', // 青绿
  '#FBE9E7', // 浅橘
];

/**
 * 默认浅色背景
 */
export const DEFAULT_LIGHT_COLOR = '#E3F2FD';

/**
 * 根据字符串生成一个固定的浅色
 * 同一个字符串总是返回同一个颜色
 */
export function getColorFromString(str: string): string {
  if (!str) return DEFAULT_LIGHT_COLOR;
  
  // 简单的哈希函数
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // 使用哈希值选择颜色
  const index = Math.abs(hash) % LIGHT_COLORS.length;
  return LIGHT_COLORS[index];
}

/**
 * 将任意颜色转换为浅色版本
 * 如果输入的是深色，会转换为对应的浅色
 */
export function toLightColor(color: string): string {
  // 如果已经是浅色调色板中的颜色，直接返回
  if (LIGHT_COLORS.includes(color.toUpperCase())) {
    return color;
  }
  
  try {
    // 解析颜色为 RGB
    const rgb = hexToRgb(color);
    if (!rgb) return DEFAULT_LIGHT_COLOR;
    
    // 计算亮度
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    
    // 如果颜色已经很亮（亮度 > 200），直接返回
    if (brightness > 200) {
      return color;
    }
    
    // 否则，转换为浅色版本（提高亮度和饱和度）
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    
    // 调整为浅色：高亮度(85-95%)，低饱和度(20-40%)
    const lightHsl = {
      h: hsl.h,
      s: Math.min(hsl.s, 40),
      l: Math.max(hsl.l, 85),
    };
    
    return hslToHex(lightHsl.h, lightHsl.s, lightHsl.l);
  } catch {
    return DEFAULT_LIGHT_COLOR;
  }
}

/**
 * Hex 转 RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * RGB 转 HSL
 */
function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: h * 360,
    s: s * 100,
    l: l * 100,
  };
}

/**
 * HSL 转 Hex
 */
function hslToHex(h: number, s: number, l: number): string {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * 随机获取一个浅色
 */
export function getRandomLightColor(): string {
  return LIGHT_COLORS[Math.floor(Math.random() * LIGHT_COLORS.length)];
}
