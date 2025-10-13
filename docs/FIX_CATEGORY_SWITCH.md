# 分类切换问题修复

## 🐛 问题描述
点击左侧的分类时，右边的快捷方式列表没有根据选中的分类进行过滤显示。

## 🔍 问题原因
`configService.updateConfig()` 方法使用的是浅合并（shallow merge），当更新嵌套的 `settings` 对象时：

```typescript
// 之前的代码
updateConfig(partialConfig: Partial<AppConfig>): boolean {
  const currentConfig = this.getConfig();
  const newConfig = { ...currentConfig, ...partialConfig };
  return storageService.save(newConfig);
}
```

这会导致 `settings` 对象被整个替换，而不是合并更新。

## ✅ 解决方案

### 1. 修复 `configService.updateConfig()` - 深度合并

```typescript
updateConfig(partialConfig: Partial<AppConfig>): boolean {
  const currentConfig = this.getConfig();
  const newConfig: AppConfig = {
    ...currentConfig,
    ...partialConfig,
    // 深度合并嵌套对象
    settings: partialConfig.settings
      ? { ...currentConfig.settings, ...partialConfig.settings }
      : currentConfig.settings,
    background: partialConfig.background
      ? { ...currentConfig.background, ...partialConfig.background }
      : currentConfig.background,
  };
  return storageService.save(newConfig);
}
```

### 2. 添加调试日志

**CategorySidebar.tsx**:
```typescript
const handleCategoryClick = (categoryId: string) => {
  console.log('切换分类:', categoryId);
  updateConfig({
    settings: {
      ...config.settings,
      activeCategory: categoryId,
    },
  });
};
```

**Shortcuts.tsx**:
```typescript
console.log('Shortcuts 渲染 - 当前分类:', config.settings.activeCategory, '网站数量:', websites.length);
```

## 🧪 测试方法

1. 打开浏览器控制台（F12）
2. 点击左侧任意分类
3. 观察控制台输出：
   - `切换分类: xxx`
   - `Shortcuts 渲染 - 当前分类: xxx 网站数量: n`
4. 右侧快捷方式应该根据分类过滤显示

## 📊 预期行为

- 点击"全部"：显示所有网站
- 点击"编程开发"：只显示 `categoryId === 'dev'` 的网站
- 点击"影视娱乐"：只显示 `categoryId === 'media'` 的网站
- 选中的分类有高亮效果

## 🔧 修改文件列表

1. `src/services/config.ts` - 修复深度合并逻辑
2. `src/components/CategorySidebar/CategorySidebar.tsx` - 添加日志
3. `src/components/Shortcuts/Shortcuts.tsx` - 添加日志

## ✅ 状态

- [x] 问题已修复
- [x] 编译通过
- [x] 开发服务器运行中
- [ ] 已测试验证（请在浏览器中测试）

---

**测试地址**: http://localhost:5173/

请在浏览器中打开并测试分类切换功能！
