import { useState } from 'react';
import Modal from '../Modal';
import { useConfig } from '../../hooks/useConfig';
import './SettingsModal.less';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 设置弹窗 - 导入/导出/重置配置
 */
const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { exportConfig, importConfig, resetConfig } = useConfig();
  const [importText, setImportText] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleExport = () => {
    const jsonString = exportConfig();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chrome-tab-config-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setMessage({ type: 'success', text: '配置已导出！' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleImport = () => {
    if (!importText.trim()) {
      setMessage({ type: 'error', text: '请粘贴配置 JSON 内容' });
      return;
    }

    const result = importConfig(importText);
    if (result.success) {
      setMessage({ type: 'success', text: '配置导入成功！页面将刷新...' });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else {
      setMessage({ type: 'error', text: result.error || '导入失败' });
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setImportText(content);
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    const confirmed = window.confirm(
      '确定要重置所有配置吗？\n\n这将删除所有自定义的分类和网站，恢复到默认配置。\n此操作不可撤销！'
    );
    if (confirmed) {
      resetConfig();
      setMessage({ type: 'success', text: '配置已重置！页面将刷新...' });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="设置" width={600}>
      <div className="settings-content">
        {/* 导出配置 */}
        <section className="settings-section">
          <h3 className="section-title">📤 导出配置</h3>
          <p className="section-desc">将当前配置导出为 JSON 文件，可用于备份或在其他设备导入。</p>
          <button className="btn btn-primary" onClick={handleExport}>
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path
                fill="currentColor"
                d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2v9.67z"
              />
            </svg>
            导出配置文件
          </button>
        </section>

        {/* 导入配置 */}
        <section className="settings-section">
          <h3 className="section-title">📥 导入配置</h3>
          <p className="section-desc">从 JSON 文件或文本导入配置，将覆盖当前所有设置。</p>

          <div className="import-methods">
            <div className="import-method">
              <label className="file-input-label">
                <input type="file" accept=".json" onChange={handleImportFile} />
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path
                    fill="currentColor"
                    d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z"
                  />
                </svg>
                选择文件
              </label>
              <span className="or-text">或</span>
            </div>

            <textarea
              className="import-textarea"
              placeholder="粘贴配置 JSON 内容..."
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              rows={8}
            />

            <button
              className="btn btn-primary"
              onClick={handleImport}
              disabled={!importText.trim()}
            >
              导入配置
            </button>
          </div>
        </section>

        {/* 重置配置 */}
        <section className="settings-section">
          <h3 className="section-title">🔄 重置配置</h3>
          <p className="section-desc danger">
            ⚠️ 将删除所有自定义内容，恢复到默认配置。此操作不可撤销！
          </p>
          <button className="btn btn-danger" onClick={handleReset}>
            重置为默认配置
          </button>
        </section>

        {/* 消息提示 */}
        {message && (
          <div className={`message-toast ${message.type}`}>
            {message.type === 'success' ? '✓ ' : '✕ '}
            {message.text}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default SettingsModal;
