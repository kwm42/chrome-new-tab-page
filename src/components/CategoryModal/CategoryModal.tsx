import { useEffect, useMemo, useState } from 'react';
import Modal from '../Modal';
import './CategoryModal.less';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: { name: string; icon?: string; color?: string }) => void;
  onDelete?: () => void;
  initialData?: {
    name: string;
    icon?: string;
    color?: string;
  };
  isDeleteDisabled?: boolean;
}

const QUICK_COLORS = [
  '#FFFFFF',
  '#E3F2FD',
  '#E8F5E9',
  '#FFF3E0',
  '#FCE4EC',
  '#E0F2F1',
  '#f7e9fb',
  '#f8e8e8',
  '#42A5F5',
  '#26A69A',
];

const QUICK_EMOJIS = ['📚', '💻', '🎮', '🎬', '🧰', '🚀', '🛒', '🎵', '📈', '❤️'];

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  initialData,
  isDeleteDisabled = false,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    icon: '',
    color: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: initialData?.name || '',
        icon: initialData?.icon || '',
        color: initialData?.color || '',
      });
      setErrors({});
    }
  }, [initialData, isOpen]);

  const modalTitle = useMemo(() => (initialData ? '编辑分类' : '新增分类'), [initialData]);

  const handleChange = (field: 'name' | 'icon' | 'color', value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const nextErrors = { ...prev };
        delete nextErrors[field];
        return nextErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      setErrors({ name: '请输入分类名称' });
      return;
    }

    onSubmit({
      name: trimmedName,
      icon: formData.icon.trim() || undefined,
      color: formData.color.trim() || undefined,
    });
  };

  const handleDelete = () => {
    if (!onDelete || isDeleteDisabled) {
      return;
    }
    if (window.confirm('删除后该分类下的网站将移动到“全部”，确定继续吗？')) {
      onDelete();
    }
  };

  const handleQuickColor = (color: string) => {
    handleChange('color', color);
  };

  const handleClearColor = () => {
    handleChange('color', '');
  };

  return (
  <Modal isOpen={isOpen} onClose={onClose} title={modalTitle} width={500}>
      <form className="category-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">
            分类名称 <span className="required">*</span>
          </label>
          <input
            type="text"
            className={`form-input ${errors.name ? 'error' : ''}`}
            placeholder="例如：学习资料"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            maxLength={24}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">图标</label>
          <input
            type="text"
            className="form-input"
            placeholder="输入 Emoji，例如：📚"
            value={formData.icon}
            onChange={(e) => handleChange('icon', e.target.value)}
            maxLength={4}
          />
          <div className="emoji-options">
            {QUICK_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                className={`emoji-btn ${formData.icon === emoji ? 'active' : ''}`}
                onClick={() => handleChange('icon', emoji)}
                title={emoji}
              >
                {emoji}
              </button>
            ))}
            <button type="button" className="emoji-btn clear" onClick={() => handleChange('icon', '')}>
              无
            </button>
          </div>
          <span className="form-hint">支持 Emoji 或留空</span>
        </div>

        <div className="form-group">
          <label className="form-label">标记颜色</label>
          <div className="quick-color-picker">
            {QUICK_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                className={`color-option ${formData.color === color ? 'active' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => handleQuickColor(color)}
                title={color}
              />
            ))}
          </div>
          <div className="color-input-wrapper">
            <input
              type="color"
              className="form-color"
              value={formData.color || '#FFFFFF'}
              onChange={(e) => handleChange('color', e.target.value)}
            />
            <input
              type="text"
              className="form-input color-text"
              placeholder="#42A5F5"
              value={formData.color}
              onChange={(e) => handleChange('color', e.target.value)}
              maxLength={18}
            />
            <button type="button" className="btn btn-secondary" onClick={handleClearColor}>
              清除
            </button>
          </div>
          <span className="form-hint">颜色用于高亮当前分类，可留空</span>
        </div>

        <div className="modal-footer">
          <div className="footer-left">
            {onDelete && !isDeleteDisabled && (
              <button type="button" className="btn btn-danger" onClick={handleDelete}>
                删除
              </button>
            )}
            {onDelete && isDeleteDisabled && (
              <button type="button" className="btn btn-danger" disabled>
                无法删除
              </button>
            )}
          </div>
          <div className="footer-right">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              取消
            </button>
            <button type="submit" className="btn btn-primary">
              {initialData ? '保存' : '添加'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default CategoryModal;
