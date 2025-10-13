import { useState, useEffect, useRef } from 'react';
import Modal from '../Modal';
import { useCategories } from '../../hooks/useCategories';
import { useWebsites } from '../../hooks/useWebsites';
import type { Website } from '../../types';
import { fetchAndCacheFavicon, getFaviconUrl, fileToBase64 } from '../../utils/favicon';
import { DEFAULT_LIGHT_COLOR } from '../../utils/colors';
import './AddWebsiteModal.less';

interface AddWebsiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingWebsite?: Website | null;
}

/**
 * 添加/编辑网站弹窗
 */
const AddWebsiteModal: React.FC<AddWebsiteModalProps> = ({ isOpen, onClose, editingWebsite }) => {
  const { categories } = useCategories();
  const { addWebsite, updateWebsite, deleteWebsite } = useWebsites();

  const [formData, setFormData] = useState({
    name: '',
    url: '',
    categoryId: 'all',
    icon: '',
    iconType: 'auto' as 'emoji' | 'base64' | 'url' | 'auto',
    color: DEFAULT_LIGHT_COLOR,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoadingFavicon, setIsLoadingFavicon] = useState(false);
  const [isColorModified, setIsColorModified] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 当编辑网站时，填充表单
  useEffect(() => {
    if (editingWebsite) {
      setFormData({
        name: editingWebsite.name,
        url: editingWebsite.url,
        categoryId: editingWebsite.categoryId,
        icon: editingWebsite.icon || '',
        iconType: editingWebsite.iconType || 'auto',
        color: editingWebsite.color || DEFAULT_LIGHT_COLOR,
      });
      setIsColorModified(!!editingWebsite.color);
      setErrors({});
      setIsLoadingFavicon(false);
    } else {
      // 重置表单
      setFormData({
        name: '',
        url: '',
        categoryId: 'all',
        icon: '',
        iconType: 'auto',
        color: DEFAULT_LIGHT_COLOR,
      });
      setIsColorModified(false);
      setErrors({});
      setIsLoadingFavicon(false);
    }
  }, [editingWebsite, isOpen]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // 标记颜色是否被修改
    if (field === 'color') {
      setIsColorModified(true);
    }
    // 清除该字段的错误
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // 获取 favicon
  const handleFetchFavicon = async () => {
    if (!formData.url) {
      setErrors({ ...errors, url: '请先输入网站地址' });
      return;
    }

    setIsLoadingFavicon(true);
    try {
      const faviconUrl = await fetchAndCacheFavicon(formData.url);
      if (faviconUrl) {
        // 保存为 URL 类型（避免 CORS 问题）
        setFormData((prev) => ({ ...prev, icon: faviconUrl, iconType: 'url' }));
      } else {
        setErrors({ ...errors, icon: '获取 favicon 失败' });
      }
    } catch (error) {
      console.error(error);
      setErrors({ ...errors, icon: '获取 favicon 失败' });
    } finally {
      setIsLoadingFavicon(false);
    }
  };

  // 上传图片
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      setErrors({ ...errors, icon: '请上传图片文件' });
      return;
    }

    // 验证文件大小 (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setErrors({ ...errors, icon: '图片大小不能超过 2MB' });
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      setFormData((prev) => ({ ...prev, icon: base64, iconType: 'base64' }));
    } catch (error) {
      console.error(error);
      setErrors({ ...errors, icon: '图片上传失败' });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '请输入网站名称';
    }

    if (!formData.url.trim()) {
      newErrors.url = '请输入网站地址';
    } else if (!/^https?:\/\/.+/.test(formData.url)) {
      newErrors.url = '请输入有效的网址（以 http:// 或 https:// 开头）';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const websiteData = {
      name: formData.name.trim(),
      url: formData.url.trim(),
      categoryId: formData.categoryId,
      icon: formData.icon.trim() || undefined,
      iconType: formData.iconType,
      color: isColorModified ? formData.color : undefined,
    };

    if (editingWebsite) {
      // 更新
      updateWebsite(editingWebsite.id, websiteData);
    } else {
      // 添加
      addWebsite(websiteData);
    }

    onClose();
  };

  const handleDelete = () => {
    if (editingWebsite && window.confirm('确定要删除这个网站吗？')) {
      deleteWebsite(editingWebsite.id);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingWebsite ? '编辑快捷方式' : '添加快捷方式'}>
      <form className="add-website-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">
            网站名称 <span className="required">*</span>
          </label>
          <input
            type="text"
            className={`form-input ${errors.name ? 'error' : ''}`}
            placeholder="例如：GitHub"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">
            网站地址 <span className="required">*</span>
          </label>
          <input
            type="text"
            className={`form-input ${errors.url ? 'error' : ''}`}
            placeholder="https://github.com"
            value={formData.url}
            onChange={(e) => handleChange('url', e.target.value)}
          />
          {errors.url && <span className="error-message">{errors.url}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">分类</label>
          <select
            className="form-select"
            value={formData.categoryId}
            onChange={(e) => handleChange('categoryId', e.target.value)}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* 图标设置 */}
        <div className="form-group">
          <label className="form-label">图标</label>
          <div className="icon-selector">
            <div className="icon-type-tabs">
              <button
                type="button"
                className={`tab-btn ${formData.iconType === 'auto' ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, iconType: 'auto', icon: '' })}
              >
                自动获取
              </button>
              <button
                type="button"
                className={`tab-btn ${formData.iconType === 'emoji' ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, iconType: 'emoji', icon: '' })}
              >
                Emoji
              </button>
              <button
                type="button"
                className={`tab-btn ${formData.iconType === 'base64' ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, iconType: 'base64' })}
              >
                上传图片
              </button>
            </div>

            <div className="icon-input-area">
              {formData.iconType === 'auto' && (
                <div className="auto-favicon-section">
                  <p className="hint-text">将自动从网站获取 Favicon（实时加载）</p>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleFetchFavicon}
                    disabled={!formData.url || isLoadingFavicon}
                  >
                    {isLoadingFavicon ? '获取中...' : '保存为固定图标'}
                  </button>
                  <span className="form-hint">点击"保存为固定图标"可将 favicon 固定，避免网站图标变化</span>
                  {formData.url && (
                    <div className="favicon-preview">
                      <img src={getFaviconUrl(formData.url)} alt="预览" onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }} />
                      <span>预览</span>
                    </div>
                  )}
                </div>
              )}

              {formData.iconType === 'emoji' && (
                <div className="emoji-input-section">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="输入 Emoji，例如：😀"
                    value={formData.icon}
                    onChange={(e) => handleChange('icon', e.target.value)}
                    maxLength={4}
                  />
                  {formData.icon && (
                    <div className="icon-preview">
                      <span className="preview-emoji">{formData.icon}</span>
                    </div>
                  )}
                </div>
              )}

              {formData.iconType === 'base64' && (
                <div className="upload-section">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                  <button
                    type="button"
                    className="btn btn-secondary upload-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16">
                      <path
                        fill="currentColor"
                        d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"
                      />
                    </svg>
                    选择图片
                  </button>
                  {formData.icon && (
                    <div className="icon-preview">
                      <img src={formData.icon} alt="预览" />
                    </div>
                  )}
                  <span className="form-hint">支持 PNG、JPG、SVG，不超过 2MB</span>
                </div>
              )}
            </div>
            {errors.icon && <span className="error-message">{errors.icon}</span>}
          </div>
        </div>

        {/* 颜色设置 */}
        <div className="form-group">
          <label className="form-label">背景颜色</label>
          
          {/* 快速颜色选择器 */}
          <div className="quick-color-picker">
            {[
              '#FFFFFF', // 白色
              '#000000', // 黑色
              '#E3F2FD', // 浅蓝
              '#E8F5E9', // 浅绿
              '#FFF3E0', // 浅橙
              '#FCE4EC', // 浅粉
              '#E0F2F1', // 浅青
              '#f7e9fb', // 浅紫
              '#f8e8e8', // 浅红
            ].map((color) => (
              <button
                key={color}
                type="button"
                className={`color-option ${formData.color === color ? 'active' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => handleChange('color', color)}
                title={color}
              />
            ))}
          </div>

          {/* 自定义颜色输入 */}
          <div className="color-input-wrapper">
            <input
              type="color"
              className="form-color"
              value={formData.color}
              onChange={(e) => handleChange('color', e.target.value)}
            />
            <input
              type="text"
              className="form-input color-text"
              value={formData.color}
              onChange={(e) => handleChange('color', e.target.value)}
              placeholder={DEFAULT_LIGHT_COLOR}
            />
          </div>
        </div>

        <div className="modal-footer">
          <div className="footer-left">
            {editingWebsite && (
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDelete}
              >
                删除
              </button>
            )}
          </div>
          <div className="footer-right">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              取消
            </button>
            <button type="submit" className="btn btn-primary">
              {editingWebsite ? '保存' : '添加'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddWebsiteModal;
