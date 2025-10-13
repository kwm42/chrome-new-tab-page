import { useState } from 'react';
import Modal from '../Modal';
import { useBackground } from '../../hooks/useBackground';
import { LIGHT_COLORS } from '../../utils/colors';
import './BackgroundSettingsModal.less';

interface BackgroundSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 背景设置弹窗
 */
const BackgroundSettingsModal: React.FC<BackgroundSettingsModalProps> = ({ isOpen, onClose }) => {
  const { background, setGradientBackground, setFileBackground, updateBackgroundEffects } = useBackground();

  const [activeTab, setActiveTab] = useState<'gradient' | 'image'>('gradient');
  const [gradientColors, setGradientColors] = useState<string[]>(
    background.gradient?.colors || ['#E3F2FD', '#F3E5F5']
  );
  const [gradientAngle, setGradientAngle] = useState(background.gradient?.angle || 135);
  const [effects, setEffects] = useState(background.effects);
  const [imagePath, setImagePath] = useState(background.type === 'file' ? background.value || '' : '');
  const [pathError, setPathError] = useState('');

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
    onClose();
  };

  // 保存图片背景路径
  const handleSaveImagePath = () => {
    if (!imagePath.trim()) {
      setPathError('请输入图片文件路径');
      return;
    }
    
    setPathError('');
    setFileBackground(imagePath);
    updateBackgroundEffects(effects);
    onClose();
  };

  // 更新效果
  const handleEffectChange = (key: keyof typeof effects, value: number) => {
    const newEffects = { ...effects, [key]: value };
    setEffects(newEffects);
  };

  // 应用效果
  const handleApplyEffects = () => {
    updateBackgroundEffects(effects);
  };

  // 重置为默认背景
  const handleReset = () => {
    const defaultColors = ['#E3F2FD', '#F3E5F5', '#E8F5E9'];
    setGradientBackground(defaultColors);
    const defaultEffects = { blur: 0, brightness: 100, opacity: 100 };
    updateBackgroundEffects(defaultEffects);
    setGradientColors(defaultColors);
    setEffects(defaultEffects);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="背景设置">
      <div className="background-settings">
        {/* 选项卡 */}
        <div className="tabs">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'gradient' ? 'active' : ''}`}
            onClick={() => setActiveTab('gradient')}
          >
            渐变背景
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'image' ? 'active' : ''}`}
            onClick={() => setActiveTab('image')}
          >
            图片背景
          </button>
        </div>

        {/* 渐变背景设置 */}
        {activeTab === 'gradient' && (
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
          </div>
        )}

        {/* 图片背景设置 */}
        {activeTab === 'image' && (
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

            {background.type === 'file' && background.value && (
              <div className="image-preview">
                <img src={background.value} alt="背景预览" />
              </div>
            )}
          </div>
        )}

        {/* 背景效果 */}
        <div className="effects-section">
          <div className="section-label">背景效果</div>

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

        {/* 底部按钮 */}
        <div className="modal-footer">
          <div className="footer-left">
            <button type="button" className="btn btn-secondary" onClick={handleReset}>
              重置为默认
            </button>
          </div>
          <div className="footer-right">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              取消
            </button>
            {activeTab === 'gradient' && (
              <button type="button" className="btn btn-primary" onClick={handleSaveGradient}>
                保存
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default BackgroundSettingsModal;
