import './Header.less';

interface HeaderProps {
  gmailUrl?: string;
  profileImage?: string;
}

/**
 * 顶部导航栏
 */
const Header: React.FC<HeaderProps> = ({
  gmailUrl = 'https://mail.google.com',
  profileImage
}) => {
  return (
    <header className="header">
      <div className="header-left">
        {/* Reserved for potential left-side items */}
      </div>
      <div className="header-right">
        <a href={gmailUrl} className="header-link">
          Gmail
        </a>
        <a href="#" className="header-link">
          图片
        </a>
        <button className="apps-menu-btn" title="Google 应用">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M6,8c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM12,20c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM6,20c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM6,14c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM12,14c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM16,6c0,1.1 0.9,2 2,2s2,-0.9 2,-2 -0.9,-2 -2,-2 -2,0.9 -2,2zM12,8c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM18,14c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM18,20c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2z"></path>
          </svg>
        </button>
        <button className="profile-btn" title="Google 账号">
          {profileImage ? (
            <img src={profileImage} alt="Profile" />
          ) : (
            <div className="profile-placeholder">
              <svg viewBox="0 0 24 24" width="32" height="32">
                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
              </svg>
            </div>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
