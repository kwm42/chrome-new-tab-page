# Chrome 新标签页 - 功能设计文档

## 📋 项目概述

**项目定位：** 纯静态本地网页，用作浏览器启动页  
**技术栈：** React 18 + TypeScript + Less + Vite  
**存储方案：** LocalStorage + JSON 配置文件  

---

## 🎯 核心功能

### 1. ✅ 搜索栏和快捷方式（已完成）
- Google 风格搜索框
- 语音搜索和 Google Lens 图标
- 快捷方式网格显示
- 圆形图标 + 名称

### 2. 🎯 分类菜单系统

#### 布局设计
```
┌─────────────────────────────────────────────────────┐
│                     Header                           │
├─────────────────────────────────────────────────────┤
│                                                       │
│                     Logo                             │
│                   SearchBar                          │
│                                                       │
│  ┌──────────┐  ┌─────────────────────────┐         │
│  │          │  │                         │         │
│  │ Category │  │      Shortcuts          │         │
│  │ Sidebar  │  │   (Grid Layout)         │         │
│  │          │  │                         │         │
│  │  • 全部  │  │  [图标] [图标] [图标]   │         │
│  │  • 编程  │  │  [图标] [图标] [+]      │         │
│  │  • 影视  │  │                         │         │
│  │  • 游戏  │  │                         │         │
│  │          │  │                         │         │
│  └──────────┘  └─────────────────────────┘         │
│                                                       │
└─────────────────────────────────────────────────────┘
```

#### UI 特性
- **位置：** 搜索栏和快捷方式左侧，垂直排列
- **样式：** 侧边栏标签列表，当前选中分类高亮
- **交互：** 点击切换分类，过滤显示对应网站
- **响应式：** 
  - 桌面端：左侧固定显示
  - 移动端：顶部横向滚动或折叠菜单

#### 默认分类
- 全部
- 编程开发（GitHub, Stack Overflow, MDN, VS Code...）
- 影视娱乐（Netflix, YouTube, Bilibili...）
- 游戏（Steam, Epic Games...）
- 社交媒体（Twitter, Instagram, Reddit...）
- 工具效率（Gmail, Notion, Figma...）

### 3. 📝 配置管理系统

#### 存储方案对比

| 特性 | Chrome Storage API | LocalStorage + JSON |
|------|-------------------|---------------------|
| **使用场景** | Chrome Extension | 纯静态网页 ✅ |
| **存储位置** | 浏览器配置文件 | 浏览器 LocalStorage |
| **大小限制** | 100KB (sync) / 5MB (local) | 5-10MB（浏览器差异）|
| **跨设备同步** | ✅ 自动同步 | ❌ 需手动导出/导入 |
| **跨浏览器** | ❌ 仅 Chrome/Edge | ✅ 所有现代浏览器 |
| **API 复杂度** | 异步，需要权限 | 同步，简单直接 |
| **实现成本** | 需要 Extension 环境 | 低，直接可用 |

**✅ 采用方案：LocalStorage + JSON 导出/导入**

#### 数据结构

```typescript
interface Category {
  id: string;
  name: string;
  icon?: string;        // emoji 或 icon class
  color?: string;       // 主题色
  order: number;
}

interface Website {
  id: string;
  name: string;
  url: string;
  icon?: string;        // emoji 或 base64
  categoryId: string;
  color?: string;
  order: number;
}

interface BackgroundConfig {
  type: 'gradient' | 'local-path' | 'base64';
  value?: string;       // 本地路径或 base64
  gradient?: {
    colors: string[];
  };
  effects: {
    blur: number;        // 0-20
    brightness: number;  // 0-200
    opacity: number;     // 0-100
  };
}

interface Settings {
  activeCategory: string;
  theme: 'light' | 'dark' | 'auto';
  language: string;
}

interface AppConfig {
  version: string;
  categories: Category[];
  websites: Website[];
  background: BackgroundConfig;
  settings: Settings;
}
```

#### 配置管理功能

```typescript
class StorageService {
  // 加载配置
  load(): AppConfig
  
  // 保存配置
  save(config: AppConfig): void
  
  // 导出 JSON
  export(): string
  
  // 导入 JSON
  import(jsonString: string): boolean
  
  // 重置为默认
  reset(): void
  
  // 验证数据结构
  validate(config: any): boolean
}
```

### 4. ✏️ 编辑功能（轻量化设计）

#### 添加网站
```
快捷方式列表：
[图标] [图标] [图标] [+]
                      ↓ 点击
              ┌─────────────┐
              │ 添加快捷方式 │
              ├─────────────┤
              │ 名称: ___   │
              │ 网址: ___   │
              │ 分类: [v]   │
              │ 图标: 😀    │
              │ 颜色: ⬤     │
              ├─────────────┤
              │ [取消][确定]│
              └─────────────┘
```

#### 编辑/删除
```
鼠标悬停在图标上：
┌─────────┐
│  [图标] │ ← 悬停时显示操作按钮
│  ✏️  ❌  │
└─────────┘
```

#### 排序模式
```
右上角：[✏️ 编辑模式]
         ↓ 点击后
[💾 保存] [❌ 取消]

快捷方式进入拖拽状态：
- 显示拖拽手柄 ⋮⋮
- 可拖动改变顺序
- 实时预览位置
- 保存后更新配置
```

#### 导入/导出
```
设置按钮（Footer 中）
  ↓
┌──────────────┐
│ 设置菜单      │
├──────────────┤
│ 📤 导出配置   │
│ 📥 导入配置   │
│ 🔄 重置配置   │
│ 🎨 背景设置   │
└──────────────┘
```

### 5. 🎨 自定义背景系统

#### 支持方式

**方案 A：本地文件路径（推荐 - 永久有效）**
```typescript
// 用户输入完整的本地文件路径
const config = {
  background: {
    type: 'local-path',
    value: 'file:///D:/Wallpapers/nature.jpg',
    effects: { blur: 0, brightness: 100, opacity: 85 }
  }
};
```

**优点：**
- ✅ 永久有效，刷新不丢失
- ✅ 不占用存储空间
- ✅ 实现极其简单

**方案 B：Base64 编码（小文件）**
```typescript
// 通过 <input type="file"> 选择后转 Base64
const config = {
  background: {
    type: 'base64',
    value: 'data:image/jpeg;base64,/9j/4AAQ...',
    effects: { blur: 2, brightness: 100, opacity: 80 }
  }
};
```

**优点：**
- ✅ 用户友好（浏览选择）
- ✅ 刷新后自动加载

**限制：**
- ⚠️ 建议限制 < 2MB
- ⚠️ 占用 LocalStorage 空间

#### 背景设置 UI

```
┌─────────────────────────────────┐
│        背景设置                  │
├─────────────────────────────────┤
│                                  │
│ 背景类型：                       │
│  ⦿ 默认渐变                      │
│  ○ 本地文件路径                  │
│  ○ 上传本地文件                  │
│                                  │
│ ┌ 本地路径 ────────────────┐   │
│ │ file:///D:/bg.jpg         │   │
│ │ [应用]                    │   │
│ └──────────────────────────┘   │
│                                  │
│ ┌ 或选择文件 ───────────────┐   │
│ │ [📁 浏览文件]             │   │
│ │ 支持 JPG, PNG (< 2MB)     │   │
│ └──────────────────────────┘   │
│                                  │
│ 效果调节：                       │
│  模糊度：  ●────────  0         │
│  亮度：    ──●──────  100       │
│  透明度：  ──────●──  85        │
│                                  │
│ 预览：                           │
│ ┌──────────────────────────┐   │
│ │      [预览效果]          │   │
│ └──────────────────────────┘   │
│                                  │
│     [重置]  [取消]  [保存]      │
└─────────────────────────────────┘
```

#### 支持类型
- **图片：** JPG, PNG, WebP（推荐 < 2MB）
- **视频：** MP4, WebM（可选，建议 < 10MB）
- **渐变：** CSS 渐变（默认）

---

## 🏗️ 技术架构

### 目录结构

```
src/
├── components/
│   ├── Background/           # 背景组件
│   ├── Header/              # 顶部导航
│   ├── Logo/                # Google Logo
│   ├── SearchBar/           # 搜索栏
│   ├── Shortcuts/           # 快捷方式
│   ├── Footer/              # 底部栏
│   ├── CategorySidebar/     # 分类侧边栏（新增）
│   ├── AddWebsiteModal/     # 添加网站弹窗（新增）
│   ├── EditModeBar/         # 编辑模式工具栏（新增）
│   ├── SettingsModal/       # 设置弹窗（新增）
│   └── BackgroundSettings/  # 背景设置（新增）
├── hooks/
│   ├── useLocalStorage.ts   # LocalStorage Hook
│   ├── useConfig.ts         # 配置管理
│   ├── useCategories.ts     # 分类管理
│   ├── useWebsites.ts       # 网站管理
│   └── useBackground.ts     # 背景管理
├── services/
│   ├── storage.ts           # LocalStorage 服务
│   ├── config.ts            # 配置服务
│   ├── validation.ts        # 数据验证
│   └── export.ts            # 导出/导入服务
├── types/
│   └── index.ts             # 类型定义
├── utils/
│   ├── file.ts              # 文件处理
│   ├── image.ts             # 图片压缩
│   └── constants.ts         # 常量定义
├── data/
│   └── default-config.ts    # 默认配置
├── App.tsx
├── App.less
├── main.tsx
└── index.less
```

### 状态管理

使用 **React Context API**：

```typescript
// contexts/ConfigContext.tsx
interface ConfigContextValue {
  config: AppConfig;
  updateConfig: (config: Partial<AppConfig>) => void;
  resetConfig: () => void;
  exportConfig: () => string;
  importConfig: (json: string) => boolean;
}

<ConfigProvider>
  <App />
</ConfigProvider>
```

---

## 📊 实施计划

### Phase 1: 数据层（1-2天）✅
- [x] 定义完整 TypeScript 类型
- [x] 实现 LocalStorage 服务
- [x] 实现配置导入/导出
- [x] 创建默认配置
- [x] 数据验证工具

### Phase 2: 分类系统（1-2天）✅
- [x] CategorySidebar 组件
- [x] 分类切换逻辑
- [x] 分类过滤显示
- [x] 响应式布局
- [x] Hooks 集成（useCategories, useWebsites）

### Phase 3: 编辑功能（2-3天）
- [ ] AddWebsiteModal 弹窗组件
- [ ] 编辑/删除按钮（悬停显示）
- [ ] EditModeBar 拖拽排序
- [ ] SettingsModal 设置弹窗
- [ ] 导入/导出功能

### Phase 4: 背景系统（2-3天）
- [ ] BackgroundSettings 面板
- [ ] 本地路径输入
- [ ] 文件选择和上传
- [ ] 图片压缩处理
- [ ] 效果调节（模糊、亮度等）
- [ ] 预览功能

### Phase 5: 优化完善（1-2天）
- [ ] 动画效果优化
- [ ] 错误处理和提示
- [ ] 性能优化
- [ ] 移动端适配
- [ ] 用户引导

---

## 🎯 功能优先级

### 必须实现（MVP）
1. ✅ 基础搜索和快捷方式
2. ✅ 分类系统
3. ✅ 配置 CRUD 操作
4. ✅ JSON 导出/导入
5. ✅ 基础背景切换

### 增强功能（可选）
1. 🔄 拖拽排序
2. 🎨 渐变编辑器
3. 📊 使用统计
4. 🔍 搜索建议
5. 🌓 深色模式
6. ⌨️ 快捷键支持
7. 📱 PWA 支持

---

## 💾 数据示例

### 默认配置 JSON

```json
{
  "version": "1.0.0",
  "categories": [
    {
      "id": "all",
      "name": "全部",
      "icon": "🌐",
      "order": 0
    },
    {
      "id": "dev",
      "name": "编程开发",
      "icon": "💻",
      "color": "#42A5F5",
      "order": 1
    },
    {
      "id": "media",
      "name": "影视娱乐",
      "icon": "🎬",
      "color": "#EF5350",
      "order": 2
    }
  ],
  "websites": [
    {
      "id": "github",
      "name": "GitHub",
      "url": "https://github.com",
      "icon": "🐙",
      "categoryId": "dev",
      "color": "#333333",
      "order": 0
    }
  ],
  "background": {
    "type": "gradient",
    "gradient": {
      "colors": ["#f8d5d5", "#a8d5a8"]
    },
    "effects": {
      "blur": 0,
      "brightness": 100,
      "opacity": 100
    }
  },
  "settings": {
    "activeCategory": "all",
    "theme": "auto",
    "language": "zh-CN"
  }
}
```

---

## 🔧 开发规范

### 编码规范
- 使用 TypeScript，严格类型检查
- 使用 React Hooks
- 组件名 PascalCase
- 文件名 kebab-case
- 所有注释使用中文
- 使用 Less 模块化样式

### Git 提交规范
- `feat:` 新功能
- `fix:` 修复 bug
- `docs:` 文档更新
- `style:` 样式调整
- `refactor:` 重构代码
- `perf:` 性能优化
- `test:` 测试相关

---

## 📄 许可

MIT License
