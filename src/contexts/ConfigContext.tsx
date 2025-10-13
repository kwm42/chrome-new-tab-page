import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AppConfig } from '../types';
import { storageService } from '../services/storage';

interface ConfigContextValue {
  config: AppConfig;
  updateConfig: (updates: Partial<AppConfig>) => void;
  resetConfig: () => void;
  exportConfig: () => string;
  importConfig: (json: string) => boolean;
  isLoading: boolean;
}

const ConfigContext = createContext<ConfigContextValue | undefined>(undefined);

interface ConfigProviderProps {
  children: ReactNode;
}

export const ConfigProvider: React.FC<ConfigProviderProps> = ({ children }) => {
  const [config, setConfig] = useState<AppConfig>(() => storageService.load());
  const [isLoading, setIsLoading] = useState(false);

  // 监听配置变化，自动保存
  useEffect(() => {
    storageService.save(config);
  }, [config]);

  const updateConfig = (updates: Partial<AppConfig>) => {
    setConfig((prev) => {
      const newConfig = {
        ...prev,
        ...updates,
        // 深度合并 settings 和 background
        settings: updates.settings
          ? { ...prev.settings, ...updates.settings }
          : prev.settings,
        background: updates.background
          ? { ...prev.background, ...updates.background }
          : prev.background,
      };
      return newConfig;
    });
  };

  const resetConfig = () => {
    const confirmed = window.confirm('确定要重置所有配置吗？此操作不可撤销。');
    if (confirmed) {
      storageService.reset();
      setConfig(storageService.load());
    }
  };

  const exportConfig = (): string => {
    return storageService.export();
  };

  const importConfig = (json: string): boolean => {
    setIsLoading(true);
    try {
      const success = storageService.import(json);
      if (success) {
        setConfig(storageService.load());
        return true;
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value: ConfigContextValue = {
    config,
    updateConfig,
    resetConfig,
    exportConfig,
    importConfig,
    isLoading,
  };

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
};

export function useConfigContext(): ConfigContextValue {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfigContext must be used within ConfigProvider');
  }
  return context;
}
