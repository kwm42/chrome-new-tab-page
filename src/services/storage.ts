import type { AppConfig } from '../types';
import { getDefaultConfig } from '../data/default-config';
import { validateConfig, sanitizeConfig } from './validation';

/**
 * LocalStorage 键名
 */
const STORAGE_KEY = 'chrome-tab-config';

/**
 * LocalStorage 服务类
 */
class StorageService {
  /**
   * 加载配置
   */
  load(): AppConfig {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        return getDefaultConfig();
      }

      const config = JSON.parse(data) as AppConfig;
      const validation = validateConfig(config);

      if (!validation.valid) {
        console.warn('配置验证失败，使用默认配置:', validation.errors);
        return getDefaultConfig();
      }

      return sanitizeConfig(config);
    } catch (error) {
      console.error('加载配置失败:', error);
      return getDefaultConfig();
    }
  }

  /**
   * 保存配置
   */
  save(config: AppConfig): boolean {
    try {
      const validation = validateConfig(config);
      if (!validation.valid) {
        console.error('配置验证失败:', validation.errors);
        return false;
      }

      const sanitized = sanitizeConfig(config);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
      return true;
    } catch (error) {
      console.error('保存配置失败:', error);
      return false;
    }
  }

  /**
   * 导出配置为 JSON 字符串
   */
  export(): string {
    const config = this.load();
    return JSON.stringify(config, null, 2);
  }

  /**
   * 导入配置从 JSON 字符串
   */
  import(jsonString: string): { success: boolean; error?: string } {
    try {
      const config = JSON.parse(jsonString);
      const validation = validateConfig(config);

      if (!validation.valid) {
        return {
          success: false,
          error: '配置格式无效：' + validation.errors.join(', '),
        };
      }

      const success = this.save(config);
      return {
        success,
        error: success ? undefined : '保存配置失败',
      };
    } catch (error) {
      return {
        success: false,
        error: 'JSON 解析失败：' + (error as Error).message,
      };
    }
  }

  /**
   * 重置为默认配置
   */
  reset(): void {
    const defaultConfig = getDefaultConfig();
    this.save(defaultConfig);
  }

  /**
   * 清除所有配置
   */
  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  /**
   * 检查是否有保存的配置
   */
  hasConfig(): boolean {
    return localStorage.getItem(STORAGE_KEY) !== null;
  }
}

// 导出单例实例
export const storageService = new StorageService();
