# 拖拽排序功能实现文档

## 📝 功能概述

实现快捷方式的拖拽排序功能，用户可以通过拖拽快捷方式卡片来调整它们的显示顺序。

## 🎯 功能特性

### 核心功能
1. **拖拽操作**：长按并拖动快捷方式卡片
2. **视觉反馈**：拖拽时卡片半透明，目标位置有高亮提示
3. **实时排序**：放下卡片后立即保存新的顺序
4. **持久化存储**：排序结果自动保存到 LocalStorage

### 交互细节
- **拖拽手势**：鼠标按住卡片拖动
- **光标变化**：拖拽时光标变为 `grabbing`
- **拖拽状态**：
  - 被拖拽的卡片：透明度降低到 40%
  - 目标位置卡片：放大 5%，蓝色边框高亮
- **跨分类限制**：只能在当前分类内调整顺序

## 🔧 技术实现

### 1. 数据层（已有）

**useWebsites Hook** 已提供 `reorderWebsites` 方法：

```typescript
const reorderWebsites = useCallback(
  (websiteIds: string[]) => {
    const success = configService.reorderWebsites(websiteIds);
    if (success) {
      updateConfig({ websites: configService.getWebsites() });
    }
    return success;
  },
  [updateConfig]
);
```

**configService** 已实现重新排序逻辑：

```typescript
reorderWebsites(websiteIds: string[]): boolean {
  const config = this.getConfig();
  const websiteMap = new Map(config.websites.map(w => [w.id, w]));
  
  const reorderedWebsites = websiteIds
    .map(id => websiteMap.get(id))
    .filter((w): w is Website => w !== undefined)
    .map((w, index) => ({ ...w, order: index }));
  
  this.updateConfig({ websites: reorderedWebsites });
  return true;
}
```

### 2. ShortcutItem 组件改造

#### 新增属性接口

```typescript
interface ShortcutItemProps {
  website: Website;
  onEdit: (website: Website) => void;
  onDragStart?: (id: string) => void;      // 开始拖拽
  onDragEnd?: () => void;                  // 结束拖拽
  onDragOver?: (e: React.DragEvent, id: string) => void;  // 拖拽悬停
  onDrop?: (id: string) => void;           // 放下
}
```

#### 状态管理

```typescript
const [isDragging, setIsDragging] = useState(false);    // 当前卡片是否被拖拽
const [isDragOver, setIsDragOver] = useState(false);    // 是否有卡片悬停在上面
```

#### 拖拽事件处理

```typescript
// 开始拖拽
const handleDragStart = (e: React.DragEvent) => {
  setIsDragging(true);
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', website.id);
  if (onDragStart) {
    onDragStart(website.id);
  }
};

// 结束拖拽
const handleDragEnd = () => {
  setIsDragging(false);
  if (onDragEnd) {
    onDragEnd();
  }
};

// 拖拽悬停
const handleDragOver = (e: React.DragEvent) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  setIsDragOver(true);
  if (onDragOver) {
    onDragOver(e, website.id);
  }
};

// 离开悬停区域
const handleDragLeave = () => {
  setIsDragOver(false);
};

// 放下
const handleDrop = (e: React.DragEvent) => {
  e.preventDefault();
  setIsDragOver(false);
  if (onDrop) {
    onDrop(website.id);
  }
};
```

#### DOM 属性

```tsx
<div
  className={`shortcut-item ${isDragging ? 'dragging' : ''} ${isDragOver ? 'drag-over' : ''}`}
  draggable                        // 设置为可拖拽
  onDragStart={handleDragStart}
  onDragEnd={handleDragEnd}
  onDragOver={handleDragOver}
  onDragLeave={handleDragLeave}
  onDrop={handleDrop}
>
```

### 3. Shortcuts 组件实现

#### 状态管理

```typescript
const [draggedId, setDraggedId] = useState<string | null>(null);  // 当前被拖拽的卡片 ID
const dragOverIdRef = useRef<string | null>(null);                // 悬停目标 ID（使用 ref 避免频繁渲染）
```

#### 拖拽逻辑

```typescript
const handleDragStart = (id: string) => {
  setDraggedId(id);
};

const handleDragEnd = () => {
  setDraggedId(null);
  dragOverIdRef.current = null;
};

const handleDragOver = (_e: React.DragEvent, targetId: string) => {
  if (!draggedId || draggedId === targetId) return;
  dragOverIdRef.current = targetId;
};

const handleDrop = (targetId: string) => {
  if (!draggedId || draggedId === targetId) return;

  // 获取所有网站（包括其他分类的）
  const allWebsites = config.websites;
  const draggedIndex = allWebsites.findIndex(w => w.id === draggedId);
  const targetIndex = allWebsites.findIndex(w => w.id === targetId);

  if (draggedIndex === -1 || targetIndex === -1) return;

  // 创建新的数组并交换位置
  const newWebsites = [...allWebsites];
  const [draggedItem] = newWebsites.splice(draggedIndex, 1);
  newWebsites.splice(targetIndex, 0, draggedItem);

  // 重新排序
  const websiteIds = newWebsites.map(w => w.id);
  reorderWebsites(websiteIds);

  setDraggedId(null);
  dragOverIdRef.current = null;
};
```

#### 传递拖拽处理器

```tsx
{websites.map((website) => (
  <ShortcutItem
    key={website.id}
    website={website}
    onEdit={handleEdit}
    onDragStart={handleDragStart}
    onDragEnd={handleDragEnd}
    onDragOver={handleDragOver}
    onDrop={handleDrop}
  />
))}
```

### 4. 样式设计

```less
.shortcut-item {
  cursor: move;  // 指示可以拖拽
  transition: transform 0.2s, opacity 0.2s;

  // 拖拽中的样式
  &.dragging {
    opacity: 0.4;
    cursor: grabbing;
  }

  // 拖拽悬停目标的样式
  &.drag-over {
    transform: scale(1.05);
    
    .shortcut-icon {
      box-shadow: 0 0 0 2px #42a5f5, 0 4px 8px rgba(0, 0, 0, 0.2);
    }
  }
}
```

## ✅ 工作流程

### 用户操作流程

```
1. 用户按住鼠标左键拖动卡片
   ↓
2. 卡片变为半透明，光标变为 grabbing
   ↓
3. 拖动到目标位置
   ↓
4. 目标位置卡片放大并显示蓝色边框
   ↓
5. 释放鼠标
   ↓
6. 卡片移动到目标位置，顺序立即保存
```

### 数据流程

```
拖拽开始
  ↓
handleDragStart → setDraggedId(卡片ID)
  ↓
拖拽悬停到目标
  ↓
handleDragOver → dragOverIdRef.current = 目标ID
  ↓
放下
  ↓
handleDrop → 重新计算顺序 → reorderWebsites(新顺序)
  ↓
configService.reorderWebsites → 更新 order 字段 → 保存到 LocalStorage
  ↓
触发 config 更新事件 → 所有组件重新渲染
```

## 🎨 视觉效果

### 正常状态
- 光标：`move`（四向箭头）
- 卡片：正常显示

### 拖拽中（被拖拽的卡片）
- 光标：`grabbing`（手抓状态）
- 卡片：透明度 40%
- 提示：用户正在拖拽

### 目标位置（被悬停的卡片）
- 卡片：放大 105%
- 边框：2px 蓝色高亮 + 阴影
- 提示：这是将要放置的位置

### 过渡动画
- 所有状态变化：200ms 平滑过渡
- 包括：透明度、缩放、阴影

## 📋 使用说明

### 拖拽排序步骤

1. **选择卡片**：鼠标移到要移动的快捷方式上，光标变为四向箭头
2. **开始拖拽**：按住鼠标左键，卡片变为半透明
3. **移动位置**：拖动到目标位置，目标卡片会高亮显示
4. **完成排序**：释放鼠标，卡片移动到新位置
5. **自动保存**：顺序立即保存，刷新页面后保持

### 注意事项

- ✅ 只能在当前分类内调整顺序
- ✅ 切换分类后，每个分类的顺序独立保存
- ✅ 不能拖拽"添加快捷方式"按钮
- ✅ 拖拽时不会触发点击打开网站
- ✅ 右键菜单仍然可用（拖拽和右键互不干扰）

## 🔍 技术细节

### HTML5 拖拽 API

使用原生的 HTML5 Drag and Drop API，无需额外依赖：

- `draggable` 属性：标记元素可拖拽
- `dataTransfer`：传递拖拽数据
- `effectAllowed`：设置拖拽效果为 'move'
- `dropEffect`：设置放下效果为 'move'
- `preventDefault()`：允许放下操作

### 性能优化

1. **useRef 存储悬停 ID**：避免频繁的状态更新和重渲染
2. **条件检查**：draggedId === targetId 时直接返回，避免无效操作
3. **批量更新**：一次性更新所有卡片的 order，而不是逐个更新
4. **CSS 过渡**：使用 CSS transition 而非 JavaScript 动画

### 边界情况处理

- ✅ 拖拽到自己：直接返回，不做任何操作
- ✅ 找不到卡片索引：返回，不执行排序
- ✅ 拖拽中切换分类：dragEnd 清理状态
- ✅ 取消拖拽（Esc）：dragEnd 自动触发清理

## 🐛 调试技巧

### 查看拖拽状态

在浏览器控制台中：

```javascript
// 查看当前配置
localStorage.getItem('new-tab-config')

// 查看网站顺序
JSON.parse(localStorage.getItem('new-tab-config')).websites.map(w => ({
  name: w.name,
  order: w.order
}))
```

### 常见问题

**Q: 拖拽后顺序没有保存？**
A: 检查 reorderWebsites 是否正确调用，以及 configService 是否成功保存

**Q: 拖拽过程中卡顿？**
A: 检查是否在 handleDragOver 中执行了耗时操作，应该使用 ref 而非 state

**Q: 拖拽时触发了点击事件？**
A: 正常情况下不会，因为 onClick 只在无拖拽时触发

**Q: 跨分类拖拽失败？**
A: 这是设计如此，只能在当前分类内排序

## 📦 文件变更清单

```
src/components/ShortcutItem/
  ├── ShortcutItem.tsx      ✅ 添加拖拽事件和状态
  └── ShortcutItem.less     ✅ 添加拖拽样式

src/components/Shortcuts/
  └── Shortcuts.tsx         ✅ 实现拖拽排序逻辑

src/hooks/
  └── useWebsites.ts        ✅ 已有 reorderWebsites（无需修改）

src/services/
  └── config.ts             ✅ 已有排序方法（无需修改）
```

## 🚀 后续优化建议

### 1. 触摸设备支持
```typescript
// 添加触摸事件支持
onTouchStart={handleTouchStart}
onTouchMove={handleTouchMove}
onTouchEnd={handleTouchEnd}
```

### 2. 拖拽预览优化
```typescript
// 自定义拖拽预览图像
const handleDragStart = (e: React.DragEvent) => {
  const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
  dragImage.style.opacity = '0.8';
  e.dataTransfer.setDragImage(dragImage, 0, 0);
};
```

### 3. 动画优化
```less
// 添加位置变化的平滑动画
.shortcut-item {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 4. 批量选择拖拽
- 支持 Shift/Ctrl 多选卡片
- 一次性拖动多个卡片到新位置

### 5. 拖拽指示器
```tsx
// 显示拖拽时的插入位置指示线
{dragOverPosition && (
  <div className="drop-indicator" style={{ left: dragOverPosition }} />
)}
```

---

**实现时间**：2025-10-13  
**功能类型**：交互增强  
**依赖技术**：HTML5 Drag and Drop API  
**兼容性**：现代浏览器（Chrome, Firefox, Edge, Safari）
