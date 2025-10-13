/**
 * 分类接口
 */
export interface Category {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  order: number;
}

/**
 * 网站接口
 */
export interface Website {
  id: string;
  name: string;
  url: string;
  categoryId: string;
  order: number;
  icon?: string; // Emoji、Base64 或图标 URL
  iconType?: 'emoji' | 'base64' | 'url' | 'auto'; // 图标类型
  color?: string;
}

/**
 * 背景配置接口
 */
export interface BackgroundConfig {
  type: 'gradient' | 'local-path' | 'base64';
  value?: string; // 本地路径或 base64
  gradient?: {
    colors: string[];
    angle?: number;
  };
  effects: {
    blur: number; // 0-20
    brightness: number; // 0-200
    opacity: number; // 0-100
  };
}

/**
 * 应用设置接口
 */
export interface Settings {
  activeCategory: string;
  theme: 'light' | 'dark' | 'auto';
  language: string;
}

/**
 * 应用配置接口
 */
export interface AppConfig {
  version: string;
  categories: Category[];
  websites: Website[];
  background: BackgroundConfig;
  settings: Settings;
}

/**
 * 配置验证结果
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}
