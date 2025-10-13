import { useState } from 'react';
import type { Website } from '../../types';
import { getFaviconUrl, isEmoji, isBase64Image, isUrl } from '../../utils/favicon';
import { getColorFromString, DEFAULT_LIGHT_COLOR } from '../../utils/colors';
import { useConfig } from '../../hooks/useConfig';
import './ShortcutItem.less';

interface ShortcutItemProps {
  website: Website;
  onEdit: (website: Website) => void;
  isEditMode?: boolean;
  onDragStart?: (id: string) => void;
  onDragEnd?: () => void;
  onDragOver?: (e: React.DragEvent, id: string) => void;
  onDrop?: (id: string) => void;
}

/**
 * 快捷方式项组件（右键编辑，支持拖拽排序）
 */
const ShortcutItem: React.FC<ShortcutItemProps> = ({ 
  website, 
  onEdit,
  isEditMode = false,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
}) => {
  const { config, updateConfig } = useConfig();
  const [isDragging, setIsDragging] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  
  const websiteNameColor = config.settings.websiteNameColor || 'rgba(0, 0, 0, 0.87)';

  const getInitials = (name: string): string => {
    // 如果是 emoji 或特殊字符，直接返回
    if (/[\u{1F300}-\u{1F9FF}]/u.test(name)) {
      return name;
    }

    const words = name.split(' ');
    if (words.length > 1) {
      return words
        .map((w) => w[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();
    }
    return name.substring(0, 1).toUpperCase();
  };

  const handleClick = () => {
    // 编辑模式下不触发打开网站
    if (isEditMode) return;
    
    if (website.url && website.url !== '#') {
      const updatedWebsites = config.websites.map((site) => {
        if (site.id === website.id) {
          return {
            ...site,
            clickCount: (site.clickCount || 0) + 1,
          };
        }
        return site;
      });
      updateConfig({ websites: updatedWebsites });
      window.location.href = website.url;
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onEdit(website);
  };

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', website.id);
    if (onDragStart) {
      onDragStart(website.id);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    if (onDragEnd) {
      onDragEnd();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
    if (onDragOver) {
      onDragOver(e, website.id);
    }
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (onDrop) {
      onDrop(website.id);
    }
  };

  return (
    <div
      className={`shortcut-item ${isEditMode ? 'edit-mode' : ''} ${isDragging ? 'dragging' : ''} ${isDragOver ? 'drag-over' : ''}`}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      draggable={isEditMode}
      onDragStart={isEditMode ? handleDragStart : undefined}
      onDragEnd={isEditMode ? handleDragEnd : undefined}
      onDragOver={isEditMode ? handleDragOver : undefined}
      onDragLeave={isEditMode ? handleDragLeave : undefined}
      onDrop={isEditMode ? handleDrop : undefined}
      role="button"
      tabIndex={0}
    >
      <div className="shortcut-icon" style={{ 
        backgroundColor: website.color || getColorFromString(website.name) || DEFAULT_LIGHT_COLOR 
      }}>
        {(() => {
          const { icon, iconType, url } = website;
          
          // 根据 iconType 或自动检测显示图标
          if (iconType === 'emoji' || (!iconType && icon && isEmoji(icon))) {
            // Emoji
            return <span className="shortcut-emoji">{icon}</span>;
          } else if (iconType === 'base64' || (!iconType && icon && isBase64Image(icon))) {
            // Base64 图片
            return <img src={icon} alt={website.name} className="shortcut-favicon" />;
          } else if (iconType === 'url' || (!iconType && icon && isUrl(icon))) {
            // 自定义 URL
            return <img src={icon} alt={website.name} className="shortcut-favicon" />;
          } else if (iconType === 'auto' || !icon) {
            // 自动获取 favicon
            const faviconUrl = getFaviconUrl(url);
            return faviconUrl ? (
              <img src={faviconUrl} alt={website.name} className="shortcut-favicon" />
            ) : (
              <span className="shortcut-initials">{getInitials(website.name)}</span>
            );
          } else {
            // 兑底：显示首字母
            return <span className="shortcut-initials">{getInitials(website.name)}</span>;
          }
        })()}
      </div>
      <div className="shortcut-name" style={{ color: websiteNameColor }}>{website.name}</div>
    </div>
  );
};

export default ShortcutItem;
