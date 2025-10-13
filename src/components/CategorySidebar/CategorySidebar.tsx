import { useState } from 'react';
import { useCategories } from '../../hooks/useCategories';
import { useConfig } from '../../hooks/useConfig';
import './CategorySidebar.less';

const CategorySidebar: React.FC = () => {
  const { categories } = useCategories();
  const { config, updateConfig } = useConfig();
  const [isCollapsed, setIsCollapsed] = useState(false);

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

  return (
    <aside className={`category-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button className="collapse-btn" onClick={toggleCollapse} title={isCollapsed ? '展开' : '收起'}>
        {isCollapsed ? '›' : '‹'}
      </button>

      <div className="category-list">
        {categories.map((category) => (
          <div
            key={category.id}
            className={`category-item ${
              config.settings.activeCategory === category.id ? 'active' : ''
            }`}
            onClick={() => handleCategoryClick(category.id)}
            role="button"
            tabIndex={0}
            style={
              config.settings.activeCategory === category.id && category.color
                ? { borderLeftColor: category.color }
                : undefined
            }
          >
            {category.icon && <span className="category-icon">{category.icon}</span>}
            {!isCollapsed && <span className="category-name">{category.name}</span>}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default CategorySidebar;
