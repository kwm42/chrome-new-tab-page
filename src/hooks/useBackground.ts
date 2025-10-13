import { useCallback } from 'react';
import type { BackgroundConfig } from '../types';
import { configService } from '../services/config';
import { useConfig } from './useConfig';

/**
 * 背景管理 Hook
 */
export const useBackground = () => {
  const { config, updateConfig } = useConfig();

  const background = config.background;

  // 更新背景配置
  const updateBackground = useCallback(
    (updates: Partial<BackgroundConfig>) => {
      const success = configService.updateBackground(updates);
      if (success) {
        updateConfig({ background: configService.getBackground() });
      }
      return success;
    },
    [updateConfig]
  );

  // 设置渐变背景
  const setGradientBackground = useCallback(
    (colors: string[]) => {
      return updateBackground({
        type: 'gradient',
        gradient: { colors },
      });
    },
    [updateBackground]
  );

  // 设置本地路径背景
  const setLocalPathBackground = useCallback(
    (path: string) => {
      return updateBackground({
        type: 'local-path',
        value: path,
      });
    },
    [updateBackground]
  );

  // 设置 Base64 背景
  const setBase64Background = useCallback(
    (base64: string) => {
      return updateBackground({
        type: 'base64',
        value: base64,
      });
    },
    [updateBackground]
  );

  // 更新背景效果
  const updateBackgroundEffects = useCallback(
    (effects: Partial<BackgroundConfig['effects']>) => {
      return updateBackground({
        effects: { ...background.effects, ...effects },
      });
    },
    [background.effects, updateBackground]
  );

  // 处理文件上传（转为 Base64）
  const handleFileUpload = useCallback(
    async (file: File): Promise<{ success: boolean; error?: string }> => {
      // 检查文件大小（限制 2MB）
      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        return { success: false, error: '文件大小超过 2MB 限制' };
      }

      // 检查文件类型
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        return { success: false, error: '不支持的文件类型' };
      }

      try {
        const base64 = await fileToBase64(file);
        const success = setBase64Background(base64);
        return { success, error: success ? undefined : '保存失败' };
      } catch {
        return { success: false, error: '文件读取失败' };
      }
    },
    [setBase64Background]
  );

  return {
    background,
    updateBackground,
    setGradientBackground,
    setLocalPathBackground,
    setBase64Background,
    updateBackgroundEffects,
    handleFileUpload,
  };
};

/**
 * 将文件转换为 Base64
 */
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
