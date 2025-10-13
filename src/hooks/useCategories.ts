import { useCallback, useMemo } from 'react';
import type { Category } from '../types';
import { configService } from '../services/config';
import { useConfig } from './useConfig';

/**
 * 分类管理 Hook
 */
export const useCategories = () => {
  const { config, updateConfig } = useConfig();

  // 获取所有分类
  const categories = useMemo(() => {
    const sorted = [...config.categories].sort((a, b) => a.order - b.order);
    const hasFrequent = sorted.some((cat) => cat.id === 'frequent');
    if (hasFrequent) {
      return sorted;
    }
    return [
      {
        id: 'frequent',
        name: '常用',
        icon: '⭐',
        color: '#FFB300',
        order: -1,
      },
      ...sorted,
    ];
  }, [config.categories]);

  // 获取当前激活的分类
  const activeCategory = config.settings.activeCategory;

  // 设置激活的分类
  const setActiveCategory = useCallback(
    (categoryId: string) => {
      configService.setActiveCategory(categoryId);
      updateConfig({ settings: { ...config.settings, activeCategory: categoryId } });
    },
    [config.settings, updateConfig]
  );

  // 添加分类
  const addCategory = useCallback(
    (category: Omit<Category, 'id' | 'order'>) => {
      const newCategory = configService.addCategory(category);
      if (newCategory) {
        updateConfig({ categories: configService.getCategories() });
      }
      return newCategory;
    },
    [updateConfig]
  );

  // 更新分类
  const updateCategory = useCallback(
    (id: string, updates: Partial<Category>) => {
      const success = configService.updateCategory(id, updates);
      if (success) {
        updateConfig({ categories: configService.getCategories() });
      }
      return success;
    },
    [updateConfig]
  );

  // 删除分类
  const deleteCategory = useCallback(
    (id: string) => {
      const success = configService.deleteCategory(id);
      if (success) {
        updateConfig({ categories: configService.getCategories() });
      }
      return success;
    },
    [updateConfig]
  );

  // 重新排序分类
  const reorderCategories = useCallback(
    (categoryIds: string[]) => {
      const success = configService.reorderCategories(categoryIds);
      if (success) {
        updateConfig({ categories: configService.getCategories() });
      }
      return success;
    },
    [updateConfig]
  );

  return {
    categories,
    activeCategory,
    setActiveCategory,
    addCategory,
  updateCategory,
  deleteCategory,
    reorderCategories,
  };
};
