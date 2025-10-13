import type { AppConfig, Category, Website, BackgroundConfig, Settings } from '../types';
import { storageService } from './storage';

/**
 * 配置服务类
 * 提供配置的 CRUD 操作
 */
class ConfigService {
  /**
   * 获取完整配置
   */
  getConfig(): AppConfig {
    return storageService.load();
  }

  /**
   * 更新配置（深度合并）
   */
  updateConfig(partialConfig: Partial<AppConfig>): boolean {
    const currentConfig = this.getConfig();
    console.log('[configService] 当前配置:', currentConfig.settings);
    console.log('[configService] 更新内容:', partialConfig);
    const newConfig: AppConfig = {
      ...currentConfig,
      ...partialConfig,
      // 深度合并嵌套对象
      settings: partialConfig.settings
        ? { ...currentConfig.settings, ...partialConfig.settings }
        : currentConfig.settings,
      background: partialConfig.background
        ? { ...currentConfig.background, ...partialConfig.background }
        : currentConfig.background,
    };
    console.log('[configService] 新配置:', newConfig.settings);
    const result = storageService.save(newConfig);
    console.log('[configService] 保存结果:', result);
    return result;
  }

  // ==================== 分类管理 ====================

  /**
   * 获取所有分类
   */
  getCategories(): Category[] {
    const config = this.getConfig();
    return config.categories.sort((a, b) => a.order - b.order);
  }

  /**
   * 添加分类
   */
  addCategory(category: Omit<Category, 'id' | 'order'>): Category | null {
    const config = this.getConfig();
    const maxOrder = Math.max(...config.categories.map((c) => c.order), -1);
    const newCategory: Category = {
      ...category,
      id: `cat_${Date.now()}`,
      order: maxOrder + 1,
    };
    config.categories.push(newCategory);
    const saved = storageService.save(config);
    if (!saved) {
      return null;
    }
    return newCategory;
  }

  /**
   * 更新分类
   */
  updateCategory(id: string, updates: Partial<Category>): boolean {
    const config = this.getConfig();
    const index = config.categories.findIndex((c) => c.id === id);
    if (index === -1) return false;

    config.categories[index] = { ...config.categories[index], ...updates };
    return storageService.save(config);
  }

  /**
   * 删除分类
   */
  deleteCategory(id: string): boolean {
    if (id === 'all') {
      console.warn('无法删除"全部"分类');
      return false;
    }

    const config = this.getConfig();
    config.categories = config.categories.filter((c) => c.id !== id);
    // 将该分类下的网站移到"全部"
    config.websites.forEach((site) => {
      if (site.categoryId === id) {
        site.categoryId = 'all';
      }
    });
    return storageService.save(config);
  }

  /**
   * 重新排序分类
   */
  reorderCategories(categoryIds: string[]): boolean {
    const config = this.getConfig();
    categoryIds.forEach((id, index) => {
      const category = config.categories.find((c) => c.id === id);
      if (category) {
        category.order = index;
      }
    });
    return storageService.save(config);
  }

  // ==================== 网站管理 ====================

  /**
   * 获取所有网站
   */
  getWebsites(categoryId?: string): Website[] {
    const config = this.getConfig();
    let websites = config.websites;

    if (categoryId && categoryId !== 'all') {
      websites = websites.filter((site) => site.categoryId === categoryId);
    }

    return websites.sort((a, b) => a.order - b.order);
  }

  /**
   * 添加网站
   */
  addWebsite(website: Omit<Website, 'id' | 'order'>): boolean {
    const config = this.getConfig();
    const maxOrder = Math.max(
      ...config.websites.filter((w) => w.categoryId === website.categoryId).map((w) => w.order),
      -1
    );
    const newWebsite: Website = {
      ...website,
      id: `site_${Date.now()}`,
      order: maxOrder + 1,
      clickCount: 0,
    };
    config.websites.push(newWebsite);
    return storageService.save(config);
  }

  /**
   * 更新网站
   */
  updateWebsite(id: string, updates: Partial<Website>): boolean {
    const config = this.getConfig();
    const index = config.websites.findIndex((w) => w.id === id);
    if (index === -1) return false;

    config.websites[index] = { ...config.websites[index], ...updates };
    return storageService.save(config);
  }

  /**
   * 删除网站
   */
  deleteWebsite(id: string): boolean {
    const config = this.getConfig();
    config.websites = config.websites.filter((w) => w.id !== id);
    return storageService.save(config);
  }

  /**
   * 重新排序网站
   */
  reorderWebsites(websiteIds: string[]): boolean {
    const config = this.getConfig();
    websiteIds.forEach((id, index) => {
      const website = config.websites.find((w) => w.id === id);
      if (website) {
        website.order = index;
      }
    });
    return storageService.save(config);
  }

  // ==================== 背景管理 ====================

  /**
   * 获取背景配置
   */
  getBackground(): BackgroundConfig {
    const config = this.getConfig();
    return config.background;
  }

  /**
   * 更新背景配置
   */
  updateBackground(background: Partial<BackgroundConfig>): boolean {
    const config = this.getConfig();
    config.background = { ...config.background, ...background };
    return storageService.save(config);
  }

  // ==================== 设置管理 ====================

  /**
   * 获取设置
   */
  getSettings(): Settings {
    const config = this.getConfig();
    return config.settings;
  }

  /**
   * 更新设置
   */
  updateSettings(settings: Partial<Settings>): boolean {
    const config = this.getConfig();
    config.settings = { ...config.settings, ...settings };
    return storageService.save(config);
  }

  /**
   * 设置当前激活的分类
   */
  setActiveCategory(categoryId: string): boolean {
    return this.updateSettings({ activeCategory: categoryId });
  }
}

// 导出单例实例
export const configService = new ConfigService();
