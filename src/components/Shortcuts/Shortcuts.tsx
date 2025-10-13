import './Shortcuts.less';

export interface Shortcut {
  id: string;
  name: string;
  url: string;
  icon?: string;
  color?: string;
}

interface ShortcutsProps {
  shortcuts?: Shortcut[];
}

const defaultShortcuts: Shortcut[] = [
  {
    id: '1',
    name: '我的应用',
    url: '#',
    color: '#5DADE2',
  },
  {
    id: '2',
    name: '转录宇宙',
    url: '#',
    color: '#5DADE2',
  },
  {
    id: '3',
    name: 'Trello - View',
    url: '#',
    color: '#2C3E50',
  },
  {
    id: '4',
    name: '学习空间',
    url: '#',
    color: '#5DADE2',
  },
  {
    id: '5',
    name: 'dribbble',
    url: '#',
    color: '#E8E8E8',
  },
  {
    id: '6',
    name: '分词',
    url: '#',
    color: '#2ECC71',
  },
  {
    id: '7',
    name: '添加快捷方式',
    url: '#',
    color: '#E8E8E8',
  },
];

const Shortcuts: React.FC<ShortcutsProps> = ({ shortcuts = defaultShortcuts }) => {
  const getInitials = (name: string): string => {
    const words = name.split(' ');
    if (words.length > 1) {
      return words.map(w => w[0]).join('').substring(0, 2).toUpperCase();
    }
    return name.substring(0, 1).toUpperCase();
  };

  const handleShortcutClick = (url: string, name: string) => {
    if (name === '添加快捷方式') {
      console.log('Add shortcut clicked');
      return;
    }
    if (url && url !== '#') {
      window.location.href = url;
    }
  };

  return (
    <div className="shortcuts-container">
      {shortcuts.map((shortcut) => (
        <div
          key={shortcut.id}
          className="shortcut-item"
          onClick={() => handleShortcutClick(shortcut.url, shortcut.name)}
          role="button"
          tabIndex={0}
        >
          <div
            className="shortcut-icon"
            style={{ backgroundColor: shortcut.color }}
          >
            {shortcut.icon ? (
              <img src={shortcut.icon} alt={shortcut.name} />
            ) : shortcut.name === '添加快捷方式' ? (
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
              </svg>
            ) : (
              <span className="shortcut-initials">{getInitials(shortcut.name)}</span>
            )}
          </div>
          <div className="shortcut-name">{shortcut.name}</div>
        </div>
      ))}
    </div>
  );
};

export default Shortcuts;
