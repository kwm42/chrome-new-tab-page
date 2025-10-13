import { useConfig } from '../../hooks/useConfig';
import { useWebsites } from '../../hooks/useWebsites';
import './Shortcuts.less';

const Shortcuts: React.FC = () => {
  const { config } = useConfig();
  console.log('[Shortcuts] useConfig 返回的 config:', config.settings);
  const { websites } = useWebsites(config.settings.activeCategory);
  
  console.log('[Shortcuts] 渲染 - 当前分类:', config.settings.activeCategory, '网站数量:', websites.length);
  
  const getInitials = (name: string): string => {
    // 如果是 emoji 或特殊字符，直接返回
    if (/[\u{1F300}-\u{1F9FF}]/u.test(name)) {
      return name;
    }
    
    const words = name.split(' ');
    if (words.length > 1) {
      return words.map(w => w[0]).join('').substring(0, 2).toUpperCase();
    }
    return name.substring(0, 1).toUpperCase();
  };

  const handleShortcutClick = (url: string) => {
    if (url && url !== '#') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleAddClick = () => {
    console.log('Add shortcut clicked');
    // TODO: 打开添加网站弹窗
  };

  return (
    <div className="shortcuts-container">
      {websites.map((website) => (
        <div
          key={website.id}
          className="shortcut-item"
          onClick={() => handleShortcutClick(website.url)}
          role="button"
          tabIndex={0}
        >
          <div
            className="shortcut-icon"
            style={{ backgroundColor: website.color || '#5DADE2' }}
          >
            {website.icon ? (
              // 如果是 emoji 或者 URL
              /^https?:\/\//.test(website.icon) ? (
                <img src={website.icon} alt={website.name} />
              ) : (
                <span className="shortcut-emoji">{website.icon}</span>
              )
            ) : (
              <span className="shortcut-initials">{getInitials(website.name)}</span>
            )}
          </div>
          <div className="shortcut-name">{website.name}</div>
        </div>
      ))}
      
      {/* 添加快捷方式按钮 */}
      <div
        className="shortcut-item add-shortcut"
        onClick={handleAddClick}
        role="button"
        tabIndex={0}
      >
        <div className="shortcut-icon">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
          </svg>
        </div>
        <div className="shortcut-name">添加快捷方式</div>
      </div>
    </div>
  );
};

export default Shortcuts;
