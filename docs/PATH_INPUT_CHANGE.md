# 背景文件路径输入方式变更

## 变更概述

将图片和视频背景的设置方式从**文件上传**改为**路径输入**，用户直接输入本地文件的完整路径，不再需要选择和上传文件。

## 变更原因

### 之前的问题（Base64 方案）

1. ❌ Base64 编码文件体积增加约 33%
2. ❌ localStorage 有 5-10MB 容量限制
3. ❌ 大文件会导致 QuotaExceededError
4. ❌ 编码/解码耗时，影响性能
5. ❌ 配置文件变得很大，难以编辑

### 路径输入方案的优势

1. ✅ 无文件大小限制
2. ✅ 不占用 localStorage 空间（只存储路径字符串）
3. ✅ 配置文件小巧简洁
4. ✅ 即时生效，无需等待文件处理
5. ✅ 可以轻松切换不同背景文件
6. ✅ 适合 Chrome 扩展和本地应用场景

## 技术实现

### UI 变更

**变更前（文件上传）：**
```tsx
<input type="file" accept="image/*" onChange={handleFileUpload} />
<button onClick={() => fileInputRef.current?.click()}>选择图片</button>
```

**变更后（路径输入）：**
```tsx
<input 
  type="text" 
  placeholder="例如: file:///C:/Users/YourName/Pictures/background.jpg"
  value={imagePath}
  onChange={(e) => setImagePath(e.target.value)}
/>
<button onClick={handleSaveImagePath}>保存图片背景</button>
```

### 逻辑变更

#### 1. `src/hooks/useBackground.ts`

**移除：**
```typescript
// 不再需要 handleFileUpload 方法
const handleFileUpload = useCallback(async (file: File, isVideo = false) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  // ... Base64 处理逻辑
}, []);
```

**保留：**
```typescript
// 直接设置路径
const setFileBackground = useCallback((fileUrl: string) => {
  return updateBackground({
    type: 'file',
    value: fileUrl,
  });
}, [updateBackground]);

const setVideoBackground = useCallback((fileUrl: string) => {
  return updateBackground({
    type: 'video',
    value: fileUrl,
  });
}, [updateBackground]);
```

#### 2. `src/components/SettingsModal/SettingsModal.tsx`

**状态变更：**
```typescript
// 移除
const [uploadError, setUploadError] = useState('');
const [isUploading, setIsUploading] = useState(false);
const fileInputRef = useRef<HTMLInputElement>(null);

// 添加
const [imagePath, setImagePath] = useState('');
const [videoPath, setVideoPath] = useState('');
const [pathError, setPathError] = useState('');
```

**处理函数变更：**
```typescript
// 图片背景
const handleSaveImagePath = () => {
  if (!imagePath.trim()) {
    setPathError('请输入图片文件路径');
    return;
  }
  
  setPathError('');
  setFileBackground(imagePath);
  updateBackgroundEffects(effects);
  setMessage({ type: 'success', text: '背景已保存！' });
};

// 视频背景
const handleSaveVideoPath = () => {
  if (!videoPath.trim()) {
    setPathError('请输入视频文件路径');
    return;
  }
  
  setPathError('');
  setVideoBackground(videoPath);
  updateBackgroundEffects(effects);
  setMessage({ type: 'success', text: '视频背景已保存！' });
};
```

### 样式变更

在 `SettingsModal.less` 中添加：

```less
.path-input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;

  .input-label {
    font-size: 14px;
    font-weight: 500;
    color: #333;
  }

  .path-input {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-size: 14px;
    font-family: monospace;
    transition: all 0.2s;

    &:focus {
      outline: none;
      border-color: #42a5f5;
      box-shadow: 0 0 0 2px rgba(66, 165, 245, 0.1);
    }
  }

  .hint-text {
    font-size: 12px;
    color: #999;
  }

  .error-message {
    font-size: 12px;
    color: #f44336;
  }
}
```

## 使用指南

### 图片背景设置

1. 打开设置 → 背景设置 → 图片背景
2. 在输入框中输入图片路径：
   ```
   file:///C:/Users/YourName/Pictures/background.jpg
   ```
   或
   ```
   D:/Images/wallpaper.png
   ```
3. 点击"保存图片背景"

### 视频背景设置

1. 打开设置 → 背景设置 → 视频背景
2. 在输入框中输入视频路径：
   ```
   file:///C:/Users/YourName/Videos/background.mp4
   ```
   或
   ```
   D:/Videos/wallpaper.mp4
   ```
3. 点击"保存视频背景"

### 路径格式说明

支持以下格式：

1. **file:// 协议（推荐）：**
   - Windows: `file:///C:/path/to/file.jpg`
   - 注意三个斜杠 `///`

2. **绝对路径：**
   - Windows: `C:/path/to/file.jpg` 或 `C:\path\to\file.jpg`
   - 建议使用正斜杠 `/` 以避免转义问题

3. **路径示例：**
   ```
   ✅ file:///C:/Users/Admin/Pictures/bg.jpg
   ✅ C:/Users/Admin/Pictures/bg.jpg
   ✅ D:/Wallpapers/nature.png
   ✅ file:///D:/Videos/ambient.mp4
   ```

## 注意事项

### ✅ 优势

1. **无大小限制**：可以使用任意大小的文件
2. **不占空间**：localStorage 只存储路径字符串（几十字节）
3. **即时切换**：更改路径即可切换背景，无需重新上传
4. **配置简洁**：导出的配置文件小巧，易于编辑和分享

### ⚠️ 注意

1. **文件位置**：
   - 确保文件存在于指定路径
   - 不要移动或删除背景文件
   - 建议创建专门的背景文件夹

2. **浏览器权限**：
   - 某些浏览器可能限制 `file://` 协议访问
   - Chrome 扩展通常有本地文件访问权限
   - 如果无法显示，检查浏览器的文件访问设置

3. **路径格式**：
   - 使用正确的路径分隔符
   - Windows 路径建议使用 `/` 而不是 `\`
   - 使用 `file://` 协议时注意三个斜杠

4. **配置迁移**：
   - 导出配置到其他设备时，需要确保文件在相同路径存在
   - 或在导入后手动修改为新的文件路径

## 兼容性

- ✅ Chrome 扩展
- ✅ Electron 应用
- ✅ 本地 HTML 文件（需要正确的文件访问权限）
- ⚠️ Web 服务器环境（可能受同源策略限制）

## 迁移指南

如果你之前使用 Base64 方案，迁移步骤：

1. **导出当前配置**（可选，作为备份）
2. **更新代码**到新版本
3. **重新设置背景**：
   - 打开背景设置
   - 输入图片/视频文件的本地路径
   - 保存设置
4. **测试**：刷新页面确认背景正常显示

## 文件清单

变更涉及的文件：

- ✅ `src/hooks/useBackground.ts` - 移除 handleFileUpload 方法
- ✅ `src/components/SettingsModal/SettingsModal.tsx` - UI 改为路径输入
- ✅ `src/components/SettingsModal/SettingsModal.less` - 新增路径输入样式
- ✅ `src/components/BackgroundSettingsModal/BackgroundSettingsModal.tsx` - 同步更新（已废弃）
- ✅ `docs/BACKGROUND_SYSTEM.md` - 更新文档

## 测试清单

- [x] 输入图片路径可以正常显示
- [x] 输入视频路径可以正常播放
- [x] 刷新页面后背景依然存在
- [x] 路径保存到配置文件
- [x] 导出配置包含路径信息
- [x] 导入配置可以恢复路径
- [x] TypeScript 编译无错误
- [x] 生产构建成功

## 总结

这次变更将背景设置从文件上传改为路径输入，完美解决了 localStorage 空间限制问题，使得用户可以使用任意大小的背景文件。对于 Chrome 扩展和本地应用场景，这是最简单高效的方案。

用户只需要将背景文件放在固定位置，输入路径即可，无需担心文件大小和存储空间。
