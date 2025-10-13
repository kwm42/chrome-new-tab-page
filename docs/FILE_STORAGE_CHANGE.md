# 文件存储方式变更说明

## 问题描述

之前的实现使用 `URL.createObjectURL()` 创建 blob URL 来处理上传的图片和视频文件。这种方式虽然不占用 localStorage 空间，但存在以下问题：

```html
<!-- 旧的实现会生成这样的 URL -->
<div class="background" style="background-image: url('blob:null/10c496c8-921a-4a84-b00b-7eea81db2921')"></div>
```

**主要问题：**
- ❌ blob URL 是临时的，只在当前会话有效
- ❌ 刷新页面后 blob URL 失效，背景图片/视频无法显示
- ❌ 无法持久化保存用户上传的背景
- ❌ 导出/导入配置时无法保存文件背景

## 解决方案

改用 **Data URL (Base64 编码)** 方式存储文件：

```typescript
// 新的实现
const reader = new FileReader();
reader.onload = () => {
  const dataUrl = reader.result as string; 
  // 例如: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...
  setFileBackground(dataUrl);
};
reader.readAsDataURL(file);
```

## 技术变更

### 1. useBackground Hook (`src/hooks/useBackground.ts`)

**变更前：**
```typescript
const fileUrl = URL.createObjectURL(file);
const success = isVideo ? setVideoBackground(fileUrl) : setFileBackground(fileUrl);
```

**变更后：**
```typescript
const dataUrl = await new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result as string);
  reader.onerror = () => reject(new Error('文件读取失败'));
  reader.readAsDataURL(file);
});

const success = isVideo ? setVideoBackground(dataUrl) : setFileBackground(dataUrl);
```

### 2. SettingsModal 组件 (`src/components/SettingsModal/SettingsModal.tsx`)

**变更前：**
```typescript
const fileUrl = URL.createObjectURL(file);
setFileBackground(fileUrl);
```

**变更后：**
```typescript
const result = await uploadBackgroundFile(file, false);
if (result.success) {
  // 成功
}
```

### 3. BackgroundSettingsModal 组件

同样的变更应用到这个组件（虽然目前未使用）。

## 优势

✅ **持久化保存**
- 文件内容转换为 Base64 字符串保存到 localStorage
- 刷新页面后背景仍然可用
- 导出/导入配置时可以完整保存文件背景

✅ **跨会话可用**
- 关闭浏览器后重新打开，背景依然存在
- 不依赖浏览器内存

✅ **配置完整性**
- 配置导出为 JSON 时包含完整的文件数据
- 可以在不同设备间迁移配置

## 权衡与注意事项

### 存储空间
- ⚠️ Base64 编码会增加约 33% 的文件大小
- ⚠️ localStorage 总容量通常为 5-10MB
- ⚠️ 过大的文件可能导致 QuotaExceededError

### 建议文件大小
- **图片背景**: 2-3MB 以内
- **视频背景**: 3-5MB 以内（压缩后）

### 文件优化建议

**图片：**
- 使用在线压缩工具（如 TinyPNG、Squoosh）
- 推荐分辨率：1920x1080 或更低
- 推荐格式：WebP（更小体积）或 JPG

**视频：**
- 使用短循环视频（5-10秒）
- 降低分辨率（720p 或更低）
- 使用视频压缩工具（如 HandBrake）
- 推荐格式：WebM（更高压缩率）

### 错误处理

如果遇到存储配额超限：
```
QuotaExceededError: Failed to execute 'setItem' on 'Storage'
```

**解决方案：**
1. 使用更小的文件
2. 切换到渐变背景（不占用额外空间）
3. 删除其他不必要的配置数据

## 相关文件

已更新的文件：
- ✅ `src/hooks/useBackground.ts` - 文件处理逻辑
- ✅ `src/components/SettingsModal/SettingsModal.tsx` - 主设置弹窗
- ✅ `src/components/BackgroundSettingsModal/BackgroundSettingsModal.tsx` - 背景设置弹窗（已废弃但保持同步）
- ✅ `docs/BACKGROUND_SYSTEM.md` - 背景系统文档

## 测试检查清单

- [x] 上传图片后可以正常显示
- [x] 上传视频后可以正常播放
- [x] 刷新页面后背景依然存在
- [x] 导出配置包含文件背景数据
- [x] 导入配置可以恢复文件背景
- [x] TypeScript 编译无错误
- [x] 生产构建成功

## 总结

这次变更解决了 blob URL 的临时性问题，使用户上传的背景可以持久化保存。虽然会占用 localStorage 空间，但对于主要使用场景（Chrome 新标签页）来说，这是一个合理的权衡。用户可以根据需要选择：

- **渐变背景**：最轻量，永久保存
- **图片背景**：中等大小，持久化保存
- **视频背景**：较大文件，持久化保存但需注意存储空间

建议用户在上传大文件前先进行压缩优化，以避免存储配额问题。
