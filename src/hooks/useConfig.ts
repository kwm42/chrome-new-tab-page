import { useState, useEffect, useCallback } from 'react';
import type { AppConfig } from '../types';
import { configService } from '../services/config';
import { storageService } from '../services/storage';
import { configEmitter } from '../services/eventEmitter';

/**
 * 配置管理 Hook
 */
export const useConfig = () => {
  const [config, setConfig] = useState<AppConfig>(() => configService.getConfig());

  // 订阅配置变化事件（来自其他组件的更新）
  useEffect(() => {
    console.log('[useConfig] 订阅配置变化事件');
    const unsubscribe = configEmitter.subscribe(() => {
      console.log('[useConfig] 收到配置变化事件，重新加载配置');
      setConfig(configService.getConfig());
    });
    return () => {
      console.log('[useConfig] 取消订阅配置变化事件');
      unsubscribe();
    };
  }, []);

  // 更新配置
  const updateConfig = useCallback((partialConfig: Partial<AppConfig>) => {
    console.log('[useConfig] updateConfig 调用, partialConfig:', partialConfig);
    const success = configService.updateConfig(partialConfig);
    console.log('[useConfig] configService.updateConfig 结果:', success);
    if (success) {
      const newConfig = configService.getConfig();
      console.log('[useConfig] 获取新配置:', newConfig.settings);
      setConfig(newConfig);
      console.log('[useConfig] setConfig 完成，触发事件通知其他组件');
      // 通知其他使用 useConfig 的组件
      configEmitter.emit();
    }
    return success;
  }, []);

  // 重置配置
  const resetConfig = useCallback(() => {
    storageService.reset();
    setConfig(configService.getConfig());
  }, []);

  // 导出配置
  const exportConfig = useCallback(() => {
    return storageService.export();
  }, []);

  // 导入配置
  const importConfig = useCallback((jsonString: string) => {
    const result = storageService.import(jsonString);
    if (result.success) {
      setConfig(configService.getConfig());
    }
    return result;
  }, []);

  // 监听 localStorage 变化（跨标签页同步）
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'chrome-tab-config') {
        setConfig(configService.getConfig());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return {
    config,
    updateConfig,
    resetConfig,
    exportConfig,
    importConfig,
  };
};
