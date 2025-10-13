# Chrome 新标签页

一个模仿 Google Chrome 新标签页的 React 项目，使用 TypeScript + Less 构建。

## 📁 项目结构

```
src/
├── components/              # 组件目录
│   ├── Background/         # 背景组件
│   │   ├── Background.tsx
│   │   ├── Background.less
│   │   └── index.ts
│   ├── Header/             # 顶部导航栏组件
│   │   ├── Header.tsx
│   │   ├── Header.less
│   │   └── index.ts
│   ├── Logo/               # Google Logo 组件
│   │   ├── Logo.tsx
│   │   ├── Logo.less
│   │   └── index.ts
│   ├── SearchBar/          # 搜索栏组件
│   │   ├── SearchBar.tsx
│   │   ├── SearchBar.less
│   │   └── index.ts
│   ├── Shortcuts/          # 快捷方式组件
│   │   ├── Shortcuts.tsx
│   │   ├── Shortcuts.less
│   │   └── index.ts
│   └── Footer/             # 底部栏组件
│       ├── Footer.tsx
│       ├── Footer.less
│       └── index.ts
├── App.tsx                 # 主应用组件
├── App.less               # 主应用样式
├── main.tsx               # 入口文件
└── index.less             # 全局样式
```

## 🎨 组件说明

### Background
- 渐变彩色背景
- 使用 CSS 动画实现动态渐变效果

### Header
- 顶部导航栏
- 包含 Gmail 链接、图片链接、应用菜单和个人头像

### Logo
- Google Logo 的 SVG 实现
- 多色标志设计

### SearchBar
- 带图标的搜索框
- 支持语音搜索和 Google Lens
- 输入框聚焦效果

### Shortcuts
- 快捷方式网格
- 可自定义图标和链接
- 包含"添加快捷方式"功能

### Footer
- 底部信息栏
- 左侧显示背景作者信息
- 右侧自定义按钮

## 🚀 运行项目

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 🛠️ 技术栈

- **React 18** - UI 框架
- **TypeScript** - 类型安全
- **Less** - CSS 预处理器
- **Vite** - 构建工具

## 📝 编码规范

- 使用函数组件和 React Hooks
- 所有代码使用 TypeScript 类型声明
- 组件采用 PascalCase 命名
- 文件名使用 kebab-case
- 每个组件独立的 Less 文件
- 所有注释使用中文

## 🎯 特性

- ✅ 完全模块化的组件设计
- ✅ TypeScript 类型安全
- ✅ Less 样式模块化
- ✅ 响应式布局
- ✅ 优雅的动画效果
- ✅ 符合 Google 设计规范

## 📦 Chrome 扩展配置

项目包含 `manifest.json` 配置文件，可以作为 Chrome 扩展使用：

1. 运行 `npm run build` 构建项目
2. 在 Chrome 中打开 `chrome://extensions/`
3. 启用"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择 `dist` 目录

## 📄 许可

MIT License
