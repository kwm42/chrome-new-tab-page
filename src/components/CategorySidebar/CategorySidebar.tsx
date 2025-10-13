import type { MouseEvent } from 'react';
import { useState } from 'react';
import { useCategories } from '../../hooks/useCategories';
import { useConfig } from '../../hooks/useConfig';
import CategoryModal from '../CategoryModal';
import './CategorySidebar.less';

const CategorySidebar: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  const { config, updateConfig } = useConfig();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  const activeCategoryId = config.settings.activeCategory;
  const editingCategory =
    editingCategoryId !== null
      ? categories.find((item) => item.id === editingCategoryId) ?? null
      : null;

  const handleCategoryClick = (categoryId: string) => {
    console.log('切换分类:', categoryId);
    updateConfig({
      settings: {
        ...config.settings,
        activeCategory: categoryId,
      },
    });
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleAddCategory = () => {
    setEditingCategoryId(null);
    setIsCategoryModalOpen(true);
  };

  const closeCategoryModal = () => {
    setIsCategoryModalOpen(false);
    setEditingCategoryId(null);
  };

  const handleCategoryContextMenu = (event: MouseEvent, categoryId: string) => {
    event.preventDefault();
    if (categoryId === 'frequent') {
      return;
    }
    setEditingCategoryId(categoryId);
    setIsCategoryModalOpen(true);
  };

  const handleCategorySubmit = (payload: { name: string; icon?: string; color?: string }) => {
    if (editingCategoryId && editingCategory) {
      const success = updateCategory(editingCategoryId, payload);
      if (success) {
        closeCategoryModal();
      }
      return;
    }
    const newCategory = addCategory(payload);
    if (newCategory) {
      updateConfig({
        settings: {
          ...config.settings,
          activeCategory: newCategory.id,
        },
      });
      closeCategoryModal();
    }
  };

  const handleCategoryDelete = () => {
    if (!editingCategoryId) {
      return;
    }
    const success = deleteCategory(editingCategoryId);
    if (success) {
      if (activeCategoryId === editingCategoryId) {
        updateConfig({
          settings: {
            ...config.settings,
            activeCategory: 'all',
          },
        });
      }
      closeCategoryModal();
    }
  };

  return (
    <aside className={`category-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button className="collapse-btn" onClick={toggleCollapse} title={isCollapsed ? '展开' : '收起'}>
        {isCollapsed ? '›' : '‹'}
      </button>

      <div className="category-list">
        {categories.map((category) => {
          const isActive = activeCategoryId === category.id;
          return (
            <div
              key={category.id}
              className={`category-item ${isActive ? 'active' : ''}`}
              onClick={() => handleCategoryClick(category.id)}
              onContextMenu={(event) => handleCategoryContextMenu(event, category.id)}
              role="button"
              tabIndex={0}
              style={isActive && category.color ? { borderLeftColor: category.color } : undefined}
              title={category.id === 'frequent' ? '常用分类无法编辑' : '右键编辑分类'}
            >
              {category.icon && <span className="category-icon">{category.icon}</span>}
              {!isCollapsed && <span className="category-name">{category.name}</span>}
            </div>
          );
        })}
        <button type="button" className="category-item add-category" onClick={handleAddCategory} title="新增分类">
          <span className="category-icon">＋</span>
          {!isCollapsed && <span className="category-name">新增分类</span>}
        </button>
      </div>

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={closeCategoryModal}
        onSubmit={handleCategorySubmit}
        onDelete={editingCategoryId ? handleCategoryDelete : undefined}
        initialData={editingCategory ? {
          name: editingCategory.name,
          icon: editingCategory.icon,
          color: editingCategory.color,
        } : undefined}
        isDeleteDisabled={editingCategoryId === 'all'}
      />
    </aside>
  );
};

export default CategorySidebar;
