import { useState } from 'react';
import './SearchBar.less';

const SearchBar: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      window.location.href = `https://www.google.com/search?q=${encodeURIComponent(searchValue)}`;
    }
  };

  const handleVoiceSearch = () => {
    // Voice search functionality placeholder
    console.log('Voice search clicked');
  };

  const handleLensSearch = () => {
    // Google Lens functionality placeholder
    console.log('Lens search clicked');
  };

  return (
    <div className="search-bar-container">
      <form className="search-bar" onSubmit={handleSearch}>
        <div className="search-icon">
          <svg focusable="false" viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
          </svg>
        </div>
        <input
          type="text"
          className="search-input"
          placeholder="在 Google 中搜索或输入网址"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          autoComplete="off"
        />
        <div className="search-actions">
          <button
            type="button"
            className="search-action-btn"
            onClick={handleVoiceSearch}
            title="语音搜索"
          >
            <svg focusable="false" viewBox="0 0 24 24" width="24" height="24">
              <path fill="#4285f4" d="m12 15c1.66 0 3-1.31 3-2.97v-7.02c0-1.66-1.34-3.01-3-3.01s-3 1.34-3 3.01v7.02c0 1.66 1.34 2.97 3 2.97z"></path>
              <path fill="#34a853" d="m11 18.08h2v3.92h-2z"></path>
              <path fill="#fbbc04" d="m7.05 16.87c-1.27-1.33-2.05-2.83-2.05-4.87h2c0 1.45 0.56 2.42 1.47 3.38v0.32l-1.15 1.18z"></path>
              <path fill="#ea4335" d="m12 16.93a4.97 5.25 0 0 1 -3.54 -1.55l-1.41 1.49c1.26 1.34 3.02 2.13 4.95 2.13 3.87 0 6.99-2.92 6.99-7h-1.99c0 2.92-2.24 4.93-5 4.93z"></path>
            </svg>
          </button>
          <button
            type="button"
            className="search-action-btn"
            onClick={handleLensSearch}
            title="Google 智能镜头搜索"
          >
            <svg focusable="false" viewBox="0 0 24 24" width="24" height="24">
              <path fill="#4285f4" d="M12,8 C9.79,8 8,9.79 8,12 C8,14.21 9.79,16 12,16 C14.21,16 16,14.21 16,12 C16,9.79 14.21,8 12,8 Z M12,14 C10.9,14 10,13.1 10,12 C10,10.9 10.9,10 12,10 C13.1,10 14,10.9 14,12 C14,13.1 13.1,14 12,14 Z"></path>
              <path fill="#34a853" d="M3,12 C3,7.03 7.03,3 12,3 L12,5 C8.13,5 5,8.13 5,12 L3,12 Z"></path>
              <path fill="#fbbc04" d="M12,3 C16.97,3 21,7.03 21,12 L19,12 C19,8.13 15.87,5 12,5 L12,3 Z"></path>
              <path fill="#ea4335" d="M21,12 C21,16.97 16.97,21 12,21 L12,19 C15.87,19 19,15.87 19,12 L21,12 Z"></path>
              <path fill="#4285f4" d="M12,21 C7.03,21 3,16.97 3,12 L5,12 C5,15.87 8.13,19 12,19 L12,21 Z"></path>
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
