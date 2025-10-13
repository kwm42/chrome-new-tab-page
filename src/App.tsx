import { useState, useEffect } from 'react';
import './App.less';
import Background from './components/Background';
import Header from './components/Header';
import Logo from './components/Logo';
import SearchBar from './components/SearchBar';
import CategorySidebar from './components/CategorySidebar';
import Shortcuts from './components/Shortcuts';
import Footer from './components/Footer';
import AddWebsiteModal from './components/AddWebsiteModal';
import SettingsModal from './components/SettingsModal';
import type { Website } from './types';

function App() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [editingWebsite, setEditingWebsite] = useState<Website | null>(null);

  // 监听打开添加网站弹窗事件
  useEffect(() => {
    const handleOpenAddModal = () => {
      setEditingWebsite(null);
      setIsAddModalOpen(true);
    };

    const handleEditWebsite = (e: Event) => {
      const customEvent = e as CustomEvent<Website>;
      setEditingWebsite(customEvent.detail);
      setIsAddModalOpen(true);
    };

    const handleOpenSettings = () => {
      setIsSettingsModalOpen(true);
    };

    window.addEventListener('openAddWebsiteModal', handleOpenAddModal);
    window.addEventListener('editWebsite', handleEditWebsite as EventListener);
    window.addEventListener('openSettingsModal', handleOpenSettings);

    return () => {
      window.removeEventListener('openAddWebsiteModal', handleOpenAddModal);
      window.removeEventListener('editWebsite', handleEditWebsite as EventListener);
      window.removeEventListener('openSettingsModal', handleOpenSettings);
    };
  }, []);

  return (
    <div className="app">
      <Background />
      <Header />
      <main className="main-content">
        <div className="content-top">
          <Logo />
          <SearchBar />
        </div>
        <div className="content-bottom">
          <CategorySidebar />
          <Shortcuts />
        </div>
      </main>
      <Footer />

      {/* 弹窗 */}
      <AddWebsiteModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        editingWebsite={editingWebsite}
      />
      <SettingsModal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} />
    </div>
  );
}

export default App;
