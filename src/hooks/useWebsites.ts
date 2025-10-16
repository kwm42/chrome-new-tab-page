import { useCallback, useMemo } from 'react';
import type { Website } from '../types';
import { configService } from '../services/config';
import { useConfig } from './useConfig';

/**
 * 网站管理 Hook
 */
export const useWebsites = (categoryId?: string) => {
  const { config, updateConfig } = useConfig();

  // 获取网站列表（根据分类过滤）
  const websites = useMemo(() => {
    const allSites = [...config.websites];

    if (categoryId === 'frequent') {
      return allSites
        .filter((site) => (site.clickCount || 0) > 0)
        .sort((a, b) => {
          const countDiff = (b.clickCount || 0) - (a.clickCount || 0);
          if (countDiff !== 0) {
            return countDiff;
          }
          return a.order - b.order;
        })
        .slice(0, 13);
    }

    let sites = allSites;
    if (categoryId && categoryId !== 'all') {
      sites = sites.filter((site) => site.categoryId === categoryId);
    }
    return [...sites].sort((a, b) => a.order - b.order);
  }, [config.websites, categoryId]);

  // 添加网站
  const addWebsite = useCallback(
    (website: Omit<Website, 'id' | 'order'>) => {
      const success = configService.addWebsite(website);
      if (success) {
        updateConfig({ websites: configService.getWebsites() });
      }
      return success;
    },
    [updateConfig]
  );

  // 更新网站
  const updateWebsite = useCallback(
    (id: string, updates: Partial<Website>) => {
      const success = configService.updateWebsite(id, updates);
      if (success) {
        updateConfig({ websites: configService.getWebsites() });
      }
      return success;
    },
    [updateConfig]
  );

  // 删除网站
  const deleteWebsite = useCallback(
    (id: string) => {
      const success = configService.deleteWebsite(id);
      if (success) {
        updateConfig({ websites: configService.getWebsites() });
      }
      return success;
    },
    [updateConfig]
  );

  // 重新排序网站
  const reorderWebsites = useCallback(
    (websiteIds: string[]) => {
      const success = configService.reorderWebsites(websiteIds);
      if (success) {
        updateConfig({ websites: configService.getWebsites() });
      }
      return success;
    },
    [updateConfig]
  );

  return {
    websites,
    addWebsite,
    updateWebsite,
    deleteWebsite,
    reorderWebsites,
  };
};
