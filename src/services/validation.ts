import type { AppConfig, ValidationResult } from '../types';

/**
 * 验证配置数据结构
 */
export const validateConfig = (config: unknown): ValidationResult => {
  const errors: string[] = [];

  // 检查基本结构
  if (!config || typeof config !== 'object') {
    errors.push('配置必须是一个对象');
    return { valid: false, errors };
  }

  const cfg = config as Record<string, unknown>;

  // 检查版本
  if (!cfg.version || typeof cfg.version !== 'string') {
    errors.push('缺少有效的 version 字段');
  }

  // 检查分类
  if (!Array.isArray(cfg.categories)) {
    errors.push('categories 必须是数组');
  } else {
    cfg.categories.forEach((cat: unknown, index: number) => {
      const category = cat as Record<string, unknown>;
      if (!category.id || typeof category.id !== 'string') {
        errors.push(`分类 ${index}: 缺少有效的 id`);
      }
      if (!category.name || typeof category.name !== 'string') {
        errors.push(`分类 ${index}: 缺少有效的 name`);
      }
      if (typeof category.order !== 'number') {
        errors.push(`分类 ${index}: order 必须是数字`);
      }
    });
  }

  // 检查网站
  if (!Array.isArray(cfg.websites)) {
    errors.push('websites 必须是数组');
  } else {
    cfg.websites.forEach((site: unknown, index: number) => {
      const website = site as Record<string, unknown>;
      if (!website.id || typeof website.id !== 'string') {
        errors.push(`网站 ${index}: 缺少有效的 id`);
      }
      if (!website.name || typeof website.name !== 'string') {
        errors.push(`网站 ${index}: 缺少有效的 name`);
      }
      if (!website.url || typeof website.url !== 'string') {
        errors.push(`网站 ${index}: 缺少有效的 url`);
      }
      if (!website.categoryId || typeof website.categoryId !== 'string') {
        errors.push(`网站 ${index}: 缺少有效的 categoryId`);
      }
      if (typeof website.order !== 'number') {
        errors.push(`网站 ${index}: order 必须是数字`);
      }
    });
  }

  // 检查背景
  if (!cfg.background || typeof cfg.background !== 'object') {
    errors.push('缺少有效的 background 配置');
  } else {
    const bg = cfg.background as Record<string, unknown>;
    const validTypes = ['gradient', 'local-path', 'base64'];
    if (!validTypes.includes(bg.type as string)) {
      errors.push('background.type 必须是 gradient、local-path 或 base64');
    }
    if (!bg.effects || typeof bg.effects !== 'object') {
      errors.push('缺少 background.effects 配置');
    }
  }

  // 检查设置
  if (!cfg.settings || typeof cfg.settings !== 'object') {
    errors.push('缺少有效的 settings 配置');
  } else {
    const settings = cfg.settings as Record<string, unknown>;
    if (!settings.activeCategory || typeof settings.activeCategory !== 'string') {
      errors.push('settings.activeCategory 必须是字符串');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * 验证 URL 格式
 */
export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * 验证颜色格式
 */
export const validateColor = (color: string): boolean => {
  const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  const rgbPattern = /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/;
  const rgbaPattern = /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/;
  
  return hexPattern.test(color) || rgbPattern.test(color) || rgbaPattern.test(color);
};

/**
 * 清理和规范化配置数据
 */
export const sanitizeConfig = (config: AppConfig): AppConfig => {
  return {
    ...config,
    categories: config.categories.map((cat) => ({
      ...cat,
      order: Math.max(0, cat.order),
    })),
    websites: config.websites.map((site) => ({
      ...site,
      order: Math.max(0, site.order),
    })),
    background: {
      ...config.background,
      effects: {
        blur: Math.max(0, Math.min(20, config.background.effects.blur)),
        brightness: Math.max(0, Math.min(200, config.background.effects.brightness)),
        opacity: Math.max(0, Math.min(100, config.background.effects.opacity)),
      },
    },
  };
};
