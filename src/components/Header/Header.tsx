import React from 'react';
import { useConfig } from '../../hooks/useConfig';
import './header.less';

/**
 * 顶部导航栏
 */
const Header: React.FC = () => {
  const { config } = useConfig();
  const headerTextColor = config.settings.headerTextColor || 'rgba(0, 0, 0, 0.87)';
  const headerLinks = config.settings.headerLinks || [];

  return (
    <header className="header" style={{ color: headerTextColor }}>
      <div className="header-left">
        {headerLinks.map((link) => (
          <a
            key={link.id}
            href={link.url}
            className="header-link"
            style={{ color: headerTextColor }}
            target="_self"
            rel="noopener noreferrer"
          >
            <img src={link.icon} alt={link.name} className="link-favicon" />
            <span>{link.name}</span>
          </a>
        ))}
      </div>
      <div className="header-right">
        <div className="header-links" style={{ color: headerTextColor }}>
          <a href="https://mail.google.com" className="header-link" style={{ color: headerTextColor }}>Gmail</a>
          <a href="https://images.google.com" className="header-link" style={{ color: headerTextColor }}>图片</a>
        </div>
        <div className="header-actions">
          <button className="apps-menu-btn" style={{ color: headerTextColor }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6,8c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM12,20c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM6,20c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM6,14c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM12,14c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM16,6c0,1.1 0.9,2 2,2s2,-0.9 2,-2 -0.9,-2 -2,-2 -2,0.9 -2,2zM12,8c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM18,14c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM18,20c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2z" />
            </svg>
          </button>
          {/* <button className="profile-btn" style={{ color: headerTextColor }}>
            <div className="profile-placeholder" style={{ color: headerTextColor }}></div>
          </button> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
