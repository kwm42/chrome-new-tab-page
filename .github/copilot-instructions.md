# GitHub Copilot 项目指令

## 🏗️ 项目简介
本项目基于 **React + TypeScript + Less** 构建，用于开发前端管理后台与交互界面。  
目标是保持代码结构清晰、类型安全、样式模块化，并且所有自动生成的注释和解释均使用中文。

---

## 🧠 Copilot 行为准则

### 🗣️ 输出语言
- 所有注释、文档、函数说明和解释均使用 **中文**。
- 保持语气自然简洁，适合团队开发阅读。
- 英文变量名和 TypeScript 类型名称可保留原文。

---

### 💡 编码规范
1. 使用 **TypeScript**，所有组件、函数都应声明类型。
2. 使用 **React 函数组件（Function Component）**，避免使用类组件。
3. 使用 **React Hooks**（`useState`, `useEffect`, `useMemo`, `useCallback` 等）组织逻辑。
4. 所有异步逻辑优先使用 **async/await**。
5. 禁止使用 `any` 类型，除非绝对必要。
6. 使用 **ESLint + Prettier** 规范，代码风格应符合：
   - 单引号 `'`
   - 尾随逗号
   - 两个空格缩进
   - 每行不超过 100 字符
7. 命名规范：
   - 组件名使用 **PascalCase**
   - 文件名、Less 样式文件使用 **kebab-case**

---

### 🎨 样式规范（Less）
1. 每个组件对应独立的 Less 文件。
2. 样式文件命名与组件保持一致（如 `Button.tsx` → `button.less`）。
3. 样式采用 **模块化导入**，如：
   ```tsx
   import styles from './button.less';
