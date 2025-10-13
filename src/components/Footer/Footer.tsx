import './Footer.less';

const Footer: React.FC = () => {
  const handleCustomize = () => {
    console.log('Customize clicked');
  };

  return (
    <footer className="footer">
      <div className="footer-left">
        <a href="#" className="footer-credit">
          Stay Flo by Luc Jordan
        </a>
      </div>
      <div className="footer-right">
        <button className="customize-btn" onClick={handleCustomize}>
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path>
          </svg>
        </button>
      </div>
    </footer>
  );
};

export default Footer;
