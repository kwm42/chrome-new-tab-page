import { useEffect, useState } from 'react';
import Modal from '../Modal';
import { useConfig } from '../../hooks/useConfig';
import { useBackground } from '../../hooks/useBackground';
import { LIGHT_COLORS } from '../../utils/colors';
import { getDefaultConfig } from '../../data/default-config';
import './SettingsModal.less';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_IMAGE_PATHS = [
  './image/001.jpg',
  './image/002.jpg',
  './image/003.jpg',
  './image/004.jpg',
  './image/005.jpg',
  './image/006.jpg',
  './image/007.jpg',
  './image/008.jpg',
];
const IMAGE_HISTORY_STORAGE_KEY = 'chrome-tab-image-history';
const VIDEO_HISTORY_STORAGE_KEY = 'chrome-tab-video-history';
const HISTORY_LIMIT = 7;

const loadHistory = (storageKey: string): string[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === 'string').slice(0, HISTORY_LIMIT);
    }
    return [];
  } catch (error) {
    console.warn('加载历史记录失败:', error);
    return [];
  }
};

const saveHistory = (storageKey: string, value: string): string[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return loadHistory(storageKey);
  }
  const current = loadHistory(storageKey).filter((item) => item !== trimmed);
  current.unshift(trimmed);
  const next = current.slice(0, HISTORY_LIMIT);
  try {
    localStorage.setItem(storageKey, JSON.stringify(next));
  } catch (error) {
    console.warn('保存历史记录失败:', error);
  }
  return next;
};

/**
 * 设置弹窗 - 配置管理 + 背景设置
 */
const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { config, updateConfig, exportConfig, importConfig, resetWebsitesConfig } = useConfig();
  const { background, setGradientBackground, setFileBackground, setVideoBackground, updateBackgroundEffects } = useBackground();
  
  const [activeTab, setActiveTab] = useState<'config' | 'background' | 'appearance'>('config');
  const [importText, setImportText] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // 背景相关状态
  const [backgroundType, setBackgroundType] = useState<'gradient' | 'image' | 'video'>(
    background.type === 'gradient' ? 'gradient' : background.type === 'video' ? 'video' : 'image'
  );
  const [gradientColors, setGradientColors] = useState<string[]>(
    background.gradient?.colors || ['#E3F2FD', '#F3E5F5']
  );
  const [gradientAngle, setGradientAngle] = useState(background.gradient?.angle || 135);
  const [effects, setEffects] = useState(background.effects);
  const [imagePath, setImagePath] = useState(background.type === 'file' ? background.value || '' : '');
  const [videoPath, setVideoPath] = useState(background.type === 'video' ? background.value || '' : '');
  const [pathError, setPathError] = useState('');
  
  // 外观设置
  const [websiteNameColor, setWebsiteNameColor] = useState(config.settings.websiteNameColor || '#000000');
  const [recentImagePaths, setRecentImagePaths] = useState<string[]>([]);
  const [recentVideoPaths, setRecentVideoPaths] = useState<string[]>([]);

  const previewImageSrc = imagePath.trim() || (background.type === 'file' ? background.value || '' : '');
  const previewVideoSrc = videoPath.trim() || (background.type === 'video' ? background.value || '' : '');

  useEffect(() => {
    if (isOpen) {
      setRecentImagePaths(
        loadHistory(IMAGE_HISTORY_STORAGE_KEY).filter((path) => !PRESET_IMAGE_PATHS.includes(path))
      );
      setRecentVideoPaths(loadHistory(VIDEO_HISTORY_STORAGE_KEY));
    }
  }, [isOpen]);

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
      '确定要重置网站配置吗？\n\n这将删除所有自定义的分类和网站，恢复到默认配置。\n背景设置和外观设置将保留。\n此操作不可撤销！'
    );
    if (confirmed) {
      resetWebsitesConfig();
      setMessage({ type: 'success', text: '网站配置已重置！页面将刷新...' });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  // ===== 背景设置相关 =====
  
  // 添加渐变颜色
  const handleAddColor = () => {
    if (gradientColors.length < 5) {
      setGradientColors([...gradientColors, LIGHT_COLORS[0]]);
    }
  };

  // 删除渐变颜色
  const handleRemoveColor = (index: number) => {
    if (gradientColors.length > 2) {
      setGradientColors(gradientColors.filter((_, i) => i !== index));
    }
  };

  // 更新渐变颜色
  const handleColorChange = (index: number, color: string) => {
    const newColors = [...gradientColors];
    newColors[index] = color;
    setGradientColors(newColors);
  };

  // 保存渐变背景
  const handleSaveGradient = () => {
    setGradientBackground(gradientColors);
    updateBackgroundEffects(effects);
    setMessage({ type: 'success', text: '背景已保存！' });
    setTimeout(() => setMessage(null), 3000);
  };

  // 保存图片背景路径
  const handleSaveImagePath = () => {
    const trimmed = imagePath.trim();
    if (!trimmed) {
      setPathError('请输入图片文件路径');
      return;
    }
    
    setPathError('');
    setImagePath(trimmed);
    setFileBackground(trimmed);
    updateBackgroundEffects(effects);
    if (!PRESET_IMAGE_PATHS.includes(trimmed)) {
      const nextHistory = saveHistory(IMAGE_HISTORY_STORAGE_KEY, trimmed);
      setRecentImagePaths(nextHistory.filter((path) => !PRESET_IMAGE_PATHS.includes(path)));
    }
    setMessage({ type: 'success', text: '背景已保存！' });
    setTimeout(() => setMessage(null), 3000);
  };

  // 保存视频背景路径
  const handleSaveVideoPath = () => {
    const trimmed = videoPath.trim();
    if (!trimmed) {
      setPathError('请输入视频文件路径');
      return;
    }
    
    setPathError('');
    setVideoPath(trimmed);
    setVideoBackground(trimmed);
    updateBackgroundEffects(effects);
    const nextHistory = saveHistory(VIDEO_HISTORY_STORAGE_KEY, trimmed);
    setRecentVideoPaths(nextHistory);
    setMessage({ type: 'success', text: '视频背景已保存！' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handlePresetImageSelect = (path: string) => {
    setBackgroundType('image');
    setImagePath(path);
    setPathError('');
  };

  const handleRecentImageSelect = (path: string) => {
    setBackgroundType('image');
    setImagePath(path);
    setPathError('');
  };

  const handleRecentVideoSelect = (path: string) => {
    setBackgroundType('video');
    setVideoPath(path);
    setPathError('');
  };

  // 保存外观设置
  const handleSaveAppearance = () => {
    updateConfig({
      settings: {
        ...config.settings,
        websiteNameColor,
      },
    });
    setMessage({ type: 'success', text: '外观设置已保存！' });
    setTimeout(() => setMessage(null), 3000);
  };

  // 重置外观设置（只重置外观，保留网站和背景设置）
  const handleResetAppearance = () => {
    const confirmed = window.confirm(
      '确定要重置外观设置吗？\n\n网站名称颜色将恢复为默认黑色。\n网站配置和背景设置将保留。'
    );
    if (confirmed) {
      const defaultColor = 'rgba(0, 0, 0, 0.87)';
      setWebsiteNameColor(defaultColor);
      updateConfig({
        settings: {
          ...config.settings,
          websiteNameColor: defaultColor,
        },
      });
      setMessage({ type: 'success', text: '外观设置已重置！' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // 更新效果
  const handleEffectChange = (key: keyof typeof effects, value: number) => {
    const newEffects = { ...effects, [key]: value };
    setEffects(newEffects);
  };

  // 应用效果
  const handleApplyEffects = () => {
    updateBackgroundEffects(effects);
    setMessage({ type: 'success', text: '效果已应用！' });
    setTimeout(() => setMessage(null), 3000);
  };

  // 重置为默认背景（只重置背景，保留网站和外观设置）
  const handleResetBackground = () => {
    const confirmed = window.confirm(
      '确定要重置背景设置吗？\n\n这将恢复到默认背景配置。\n网站配置和外观设置将保留。'
    );
    if (confirmed) {
      const defaultConfig = getDefaultConfig();
      const defaultBackground = defaultConfig.background;
      
      // 根据默认配置的类型进行重置
      if (defaultBackground.type === 'gradient') {
        setGradientBackground(defaultBackground.gradient?.colors || ['#E3F2FD', '#F3E5F5', '#E8F5E9']);
        setGradientColors(defaultBackground.gradient?.colors || ['#E3F2FD', '#F3E5F5', '#E8F5E9']);
        setBackgroundType('gradient');
      } else if (defaultBackground.type === 'file') {
        setFileBackground(defaultBackground.value || '');
        setImagePath(defaultBackground.value || '');
        setBackgroundType('image');
      } else if (defaultBackground.type === 'video') {
        setVideoBackground(defaultBackground.value || '');
        setVideoPath(defaultBackground.value || '');
        setBackgroundType('video');
      }
      
      // 重置效果
      const defaultEffects = defaultBackground.effects || { blur: 0, brightness: 100, opacity: 100 };
      updateBackgroundEffects(defaultEffects);
      setEffects(defaultEffects);
      
      setMessage({ type: 'success', text: '背景设置已重置！' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="设置" width={600}>
      <div className="settings-content">
        {/* Tab 切换 */}
        <div className="settings-tabs">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'config' ? 'active' : ''}`}
            onClick={() => setActiveTab('config')}
          >
            配置管理
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'background' ? 'active' : ''}`}
            onClick={() => setActiveTab('background')}
          >
            背景设置
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'appearance' ? 'active' : ''}`}
            onClick={() => setActiveTab('appearance')}
          >
            外观设置
          </button>
        </div>

        {/* 配置管理 Tab */}
        {activeTab === 'config' && (
          <div className="tab-content config-tab">
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
              <h3 className="section-title">🔄 重置网站配置</h3>
              <p className="section-desc danger">
                ⚠️ 将删除所有自定义的分类和网站，恢复到默认配置。背景设置和外观设置将保留。此操作不可撤销！
              </p>
              <button className="btn btn-danger" onClick={handleReset}>
                重置网站配置
              </button>
            </section>
          </div>
        )}

        {/* 背景设置 Tab */}
        {activeTab === 'background' && (
          <div className="tab-content background-tab">
            {/* 背景类型选择 */}
            <div className="background-type-tabs">
              <button
                type="button"
                className={`type-btn ${backgroundType === 'gradient' ? 'active' : ''}`}
                onClick={() => setBackgroundType('gradient')}
              >
                渐变背景
              </button>
              <button
                type="button"
                className={`type-btn ${backgroundType === 'image' ? 'active' : ''}`}
                onClick={() => setBackgroundType('image')}
              >
                图片背景
              </button>
              <button
                type="button"
                className={`type-btn ${backgroundType === 'video' ? 'active' : ''}`}
                onClick={() => setBackgroundType('video')}
              >
                视频背景
              </button>
            </div>

            {/* 渐变背景设置 */}
            {backgroundType === 'gradient' && (
              <div className="gradient-section">
                <div className="section-label">渐变颜色 ({gradientColors.length}/5)</div>
                <div className="gradient-colors">
                  {gradientColors.map((color, index) => (
                    <div key={index} className="color-item">
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => handleColorChange(index, e.target.value)}
                        className="color-input"
                      />
                      <input
                        type="text"
                        value={color}
                        onChange={(e) => handleColorChange(index, e.target.value)}
                        className="color-text-input"
                        placeholder="#FFFFFF"
                      />
                      {gradientColors.length > 2 && (
                        <button
                          type="button"
                          className="remove-btn"
                          onClick={() => handleRemoveColor(index)}
                          title="删除"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {gradientColors.length < 5 && (
                  <button type="button" className="add-color-btn" onClick={handleAddColor}>
                    + 添加颜色
                  </button>
                )}

                <div className="gradient-preview">
                  <div className="preview-label">预览</div>
                  <div
                    className="preview-box"
                    style={{
                      background: `linear-gradient(${gradientAngle}deg, ${gradientColors.join(', ')})`,
                    }}
                  />
                </div>

                <div className="angle-control">
                  <label className="control-label">
                    角度: {gradientAngle}°
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={gradientAngle}
                    onChange={(e) => setGradientAngle(Number(e.target.value))}
                    className="slider"
                  />
                </div>

                <button type="button" className="btn btn-primary" onClick={handleSaveGradient}>
                  保存渐变背景
                </button>
              </div>
            )}

            {/* 图片背景设置 */}
            {backgroundType === 'image' && (
              <div className="image-section">
                <div className="path-input-group">
                  <label className="input-label">图片文件路径</label>
                  <input
                    type="text"
                    className="path-input"
                    placeholder="例如: file:///C:/Users/YourName/Pictures/background.jpg"
                    value={imagePath}
                    onChange={(e) => setImagePath(e.target.value)}
                  />
                  <p className="hint-text">输入本地图片文件的完整路径（支持 file:// 协议）</p>
                  {pathError && <p className="error-message">{pathError}</p>}
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSaveImagePath}
                  >
                    保存图片背景
                  </button>
                </div>

                <div className="preset-wrapper">
                  <div className="section-label">预设图片</div>
                  <div className="preset-grid">
                    {PRESET_IMAGE_PATHS.map((path) => (
                      <button
                        key={path}
                        type="button"
                        className={`preset-card ${imagePath === path ? 'active' : ''}`}
                        onClick={() => handlePresetImageSelect(path)}
                        title={path}
                      >
                        <img src={path} alt="预设背景" />
                      </button>
                    ))}
                  </div>
                </div>

                {recentImagePaths.length > 0 && (
                  <div className="recent-list">
                    <div className="section-label">最近使用</div>
                    <div className="recent-tags">
                      {recentImagePaths.map((path) => {
                        const fileName = path.split(/[\\/]/).pop() || path;
                        return (
                          <button
                            key={path}
                            type="button"
                            className="recent-btn"
                            onClick={() => handleRecentImageSelect(path)}
                            title={path}
                          >
                            {fileName}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {previewImageSrc && (
                  <div className="image-preview">
                    <img src={previewImageSrc} alt="背景预览" />
                  </div>
                )}
              </div>
            )}

            {/* 视频背景设置 */}
            {backgroundType === 'video' && (
              <div className="video-section">
                <div className="path-input-group">
                  <label className="input-label">视频文件路径</label>
                  <input
                    type="text"
                    className="path-input"
                    placeholder="例如: file:///C:/Users/YourName/Videos/background.mp4"
                    value={videoPath}
                    onChange={(e) => setVideoPath(e.target.value)}
                  />
                  <p className="hint-text">输入本地视频文件的完整路径（支持 file:// 协议）</p>
                  {pathError && <p className="error-message">{pathError}</p>}
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSaveVideoPath}
                  >
                    保存视频背景
                  </button>
                </div>

                {recentVideoPaths.length > 0 && (
                  <div className="recent-list">
                    <div className="section-label">最近使用</div>
                    <div className="recent-tags">
                      {recentVideoPaths.map((path) => {
                        const fileName = path.split(/[\\/]/).pop() || path;
                        return (
                          <button
                            key={path}
                            type="button"
                            className="recent-btn"
                            onClick={() => handleRecentVideoSelect(path)}
                            title={path}
                          >
                            {fileName}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {previewVideoSrc && (
                  <div className="video-preview">
                    <video src={previewVideoSrc} controls muted loop />
                  </div>
                )}
              </div>
            )}

            {/* 背景效果 */}
            <div className="effects-section">
              <div className="section-label">背景效果</div>

              {backgroundType !== 'video' && (
                <>
                  <div className="effect-control">
                    <label className="control-label">
                      模糊: {effects.blur}px
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      value={effects.blur}
                      onChange={(e) => handleEffectChange('blur', Number(e.target.value))}
                      className="slider"
                    />
                  </div>

                  <div className="effect-control">
                    <label className="control-label">
                      亮度: {effects.brightness}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={effects.brightness}
                      onChange={(e) => handleEffectChange('brightness', Number(e.target.value))}
                      className="slider"
                    />
                  </div>
                </>
              )}

              <div className="effect-control">
                <label className="control-label">
                  透明度: {effects.opacity}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={effects.opacity}
                  onChange={(e) => handleEffectChange('opacity', Number(e.target.value))}
                  className="slider"
                />
              </div>

              <button type="button" className="apply-effects-btn" onClick={handleApplyEffects}>
                应用效果
              </button>
            </div>

            {/* 重置背景 */}
            <div className="reset-background-section">
              <p className="section-desc">
                重置将恢复到默认背景配置，网站配置和外观设置将保留。
              </p>
              <button type="button" className="btn btn-secondary" onClick={handleResetBackground}>
                重置背景设置
              </button>
            </div>
          </div>
        )}

        {/* 外观设置 Tab */}
        {activeTab === 'appearance' && (
          <div className="tab-content appearance-tab">
            <section className="settings-section">
              <h3 className="section-title">🎨 网站名称颜色</h3>
              <p className="section-desc">自定义网站名称的文字颜色</p>
              
              <div className="color-picker-group">
                <div className="color-picker-row">
                  <label className="color-label">网站名称颜色</label>
                  <div className="color-picker-wrapper">
                    <input
                      type="color"
                      value={websiteNameColor}
                      onChange={(e) => setWebsiteNameColor(e.target.value)}
                      className="color-picker"
                    />
                    <input
                      type="text"
                      value={websiteNameColor}
                      onChange={(e) => setWebsiteNameColor(e.target.value)}
                      className="color-input"
                      placeholder="#000000"
                    />
                  </div>
                </div>
                
                <div className="color-preview">
                  <div className="preview-label">预览效果</div>
                  <div className="preview-website">
                    <div className="preview-icon"></div>
                    <div className="preview-name" style={{ color: websiteNameColor }}>
                      示例网站
                    </div>
                  </div>
                </div>

                <div className="button-group">
                  <button type="button" className="btn btn-primary" onClick={handleSaveAppearance}>
                    保存设置
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={handleResetAppearance}>
                    重置为默认
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

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
