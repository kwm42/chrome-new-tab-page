# Chrome 新标签页

一个模仿 Google Chrome 新标签页的 React 项目，使用 TypeScript + Less 构建。

## ✨ 特性

- 🔍 **搜索栏** - Google 风格搜索框，支持语音搜索和 Google Lens
- 🎯 **分类系统** - 按分类组织和筛选快捷方式
- 📝 **配置管理** - 支持导入/导出 JSON 配置文件
- 🎨 **自定义背景** - 支持本地图片/视频背景
- 💾 **本地存储** - 所有数据存储在浏览器 LocalStorage

## 🚀 快速开始

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

## 📚 文档

详细文档请查看 [docs](./docs) 目录：

- [功能设计文档](./docs/DESIGN.md) - 完整的功能规格和技术架构
- [项目结构说明](./docs/PROJECT_STRUCTURE.md) - 目录结构和组件介绍
- [Phase 2 报告](./docs/PHASE2_REPORT.md) - 分类系统开发完成报告
- [修复记录](./docs/) - 问题修复和解决方案

## 🛠️ 技术栈

- **React 18** - UI 框架
- **TypeScript** - 类型安全
- **Less** - CSS 预处理器
- **Vite** - 构建工具

## 📦 项目结构

```
src/
├── components/        # React 组件
├── hooks/            # 自定义 Hooks
├── services/         # 业务逻辑服务
├── types/            # TypeScript 类型定义
├── data/             # 默认配置数据
└── utils/            # 工具函数
```

## 🎯 当前进度

- ✅ Phase 1: 数据层（完成）
- ✅ Phase 2: 分类系统（完成）
- ⏳ Phase 3: 编辑功能（进行中）
- ⏳ Phase 4: 背景系统（待开发）
- ⏳ Phase 5: 优化完善（待开发）

## 📄 许可

MIT License

React + TypeScript + Vite project configured with Less for styling.

## Getting Started

- `npm install`
- `npm run dev`

## Styling

- Global rules live in `src/index.less`.
- Component specific styles live in `src/App.less`.
- Import additional `.less` files directly from components as needed.

## Available Scripts

- `npm run dev` – start the Vite dev server with HMR
- `npm run build` – type-check and bundle for production
- `npm run preview` – preview the production bundle locally
- `npm run lint` – run ESLint over the workspace
