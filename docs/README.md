# 📚 项目文档索引

本目录包含项目的所有设计和开发文档。

## 📋 设计文档

### [DESIGN.md](./DESIGN.md)
项目的完整功能设计文档，包括：
- 项目概述和技术栈
- 核心功能设计（搜索、分类、配置管理、背景系统）
- 技术架构和目录结构
- 实施计划和优先级
- 数据结构和示例

### [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)
项目结构说明文档，包括：
- 目录结构说明
- 组件功能介绍
- 技术栈说明
- 运行和构建指南
- 编码规范

## 📊 开发报告

### [PHASE2_REPORT.md](./PHASE2_REPORT.md)
Phase 2: 分类系统开发完成报告，包括：
- 已完成功能列表
- 新增和重构的组件
- Hooks 优化
- 技术细节和性能优化

## 🐛 问题修复记录

### [FIX_CATEGORY_SWITCH.md](./FIX_CATEGORY_SWITCH.md)
分类切换问题修复记录：
- 问题：点击分类时快捷方式不更新
- 原因：配置更新使用浅合并导致嵌套对象丢失
- 解决：实现深度合并逻辑

### [STATE_SYNC_ISSUE.md](./STATE_SYNC_ISSUE.md)
组件状态同步问题分析文档：
- 问题分析：多个 useConfig 实例状态不同步
- 多种解决方案对比（事件系统、Context、状态管理库）
- 实施建议

### [FIX_STATE_SYNC.md](./FIX_STATE_SYNC.md)
状态同步问题修复报告：
- 实施了自定义事件系统（ConfigEventEmitter）
- 修改 useConfig Hook 支持事件订阅
- 完整的工作流程说明
- 测试验证方法

## 🎨 交互优化记录

### [EDIT_INTERACTION_IMPROVEMENT.md](./EDIT_INTERACTION_IMPROVEMENT.md)
编辑交互改进记录：
- 从悬停按钮改为右键菜单
- 删除功能集成到编辑弹窗
- 提升用户体验，减少误触

### [DRAG_DROP_SORT.md](./DRAG_DROP_SORT.md)
拖拽排序功能实现文档：
- HTML5 原生拖拽 API 实现
- 视觉反馈和动画效果
- 实时保存排序结果

### [BACKGROUND_SYSTEM.md](./BACKGROUND_SYSTEM.md)
背景系统功能文档：
- 渐变背景和图片背景设置
- 背景效果调节（模糊、亮度、透明度）
- 集成到设置弹窗中的 Tab 界面
- 使用方法和技术实现细节

## 🗂️ 文档组织

```
docs/
├── README.md                       # 本文件 - 文档索引
├── DESIGN.md                       # 功能设计文档
├── PROJECT_STRUCTURE.md            # 项目结构说明
├── PHASE2_REPORT.md               # Phase 2 完成报告
├── FIX_CATEGORY_SWITCH.md         # 分类切换修复
├── STATE_SYNC_ISSUE.md            # 状态同步问题分析
├── FIX_STATE_SYNC.md              # 状态同步修复报告
├── EDIT_INTERACTION_IMPROVEMENT.md # 编辑交互优化
├── DRAG_DROP_SORT.md              # 拖拽排序功能
└── BACKGROUND_SYSTEM.md           # 背景系统功能
```

## 📖 阅读顺序建议

### 新成员上手
1. PROJECT_STRUCTURE.md - 了解项目结构
2. DESIGN.md - 理解功能设计
3. PHASE2_REPORT.md - 查看当前进度

### 开发参考
1. DESIGN.md - 查看功能规范
2. 相关修复文档 - 了解已知问题和解决方案

### 问题排查
1. FIX_*.md - 查看已修复的问题
2. STATE_SYNC_ISSUE.md - 理解架构设计原因

---

**项目地址：** https://github.com/kwm42/chrome-new-tab-page  
**最后更新：** 2025-10-13
