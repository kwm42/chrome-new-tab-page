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
  clickCount?: number; // 用户点击次数
}

/**
 * 背景配置接口
 */
export interface BackgroundConfig {
  type: 'gradient' | 'local-path' | 'file' | 'video';
  value?: string; // 本地路径、文件 URL 或视频 URL
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
export interface HeaderLink {
  id: string;
  name: string;
  url: string;
  icon: string;
}

export interface Settings {
  activeCategory: string;
  theme: 'light' | 'dark' | 'auto';
  language: string;
  websiteNameColor?: string; // 网站名称文字颜色
  headerTextColor?: string; // Header 文字颜色
  headerLinks?: HeaderLink[]; // Header 左侧链接
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
