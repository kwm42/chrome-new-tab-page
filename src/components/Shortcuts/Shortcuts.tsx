import { useState, useRef } from 'react';
import { useConfig } from '../../hooks/useConfig';
import { useWebsites } from '../../hooks/useWebsites';
import ShortcutItem from '../ShortcutItem';
import type { Website } from '../../types';
import './Shortcuts.less';

const Shortcuts: React.FC = () => {
  const { config } = useConfig();
  console.log('[Shortcuts] useConfig 返回的 config:', config.settings);
  const { websites, reorderWebsites } = useWebsites(config.settings.activeCategory);
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const dragOverIdRef = useRef<string | null>(null);
  
  console.log('[Shortcuts] 渲染 - 当前分类:', config.settings.activeCategory, '网站数量:', websites.length);

  const handleEdit = (website: Website) => {
    // 触发编辑事件
    window.dispatchEvent(new CustomEvent('editWebsite', { detail: website }));
  };

  const handleAddClick = () => {
    // 触发添加网站事件
    window.dispatchEvent(new CustomEvent('openAddWebsiteModal'));
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    // 退出编辑模式时清理拖拽状态
    if (isEditMode) {
      setDraggedId(null);
      dragOverIdRef.current = null;
    }
  };

  const handleDragStart = (id: string) => {
    setDraggedId(id);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    dragOverIdRef.current = null;
  };

  const handleDragOver = (_e: React.DragEvent, targetId: string) => {
    if (!draggedId || draggedId === targetId) return;
    dragOverIdRef.current = targetId;
  };

  const handleDrop = (targetId: string) => {
    if (!draggedId || draggedId === targetId) return;

    // 获取所有网站（包括其他分类的）
    const allWebsites = config.websites;
    const draggedIndex = allWebsites.findIndex(w => w.id === draggedId);
    const targetIndex = allWebsites.findIndex(w => w.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    // 创建新的数组并交换位置
    const newWebsites = [...allWebsites];
    const [draggedItem] = newWebsites.splice(draggedIndex, 1);
    newWebsites.splice(targetIndex, 0, draggedItem);

    // 重新排序
    const websiteIds = newWebsites.map(w => w.id);
    reorderWebsites(websiteIds);

    setDraggedId(null);
    dragOverIdRef.current = null;
  };

  return (
    <div className="shortcuts-wrapper">
      {/* 编辑模式切换按钮 */}
      <button 
        className={`edit-mode-toggle ${isEditMode ? 'active' : ''}`}
        onClick={toggleEditMode}
        title={isEditMode ? '完成排序' : '排序'}
      >
        {isEditMode ? (
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M3 15h18v-2H3v2zm0 4h18v-2H3v2zm0-8h18V9H3v2zm0-6v2h18V5H3z" />
          </svg>
        )}
        <span>{isEditMode ? '完成' : '排序'}</span>
      </button>

      <div className="shortcuts-container">
        {websites.map((website) => (
          <ShortcutItem
            key={website.id}
            website={website}
            onEdit={handleEdit}
            isEditMode={isEditMode}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
        ))}

        {/* 添加快捷方式按钮 */}
        <div className="shortcut-item add-shortcut" onClick={handleAddClick} role="button" tabIndex={0}>
          <div className="shortcut-icon">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
            </svg>
          </div>
          <div className="shortcut-name">添加快捷方式</div>
        </div>
      </div>
    </div>
  );
};

export default Shortcuts;
