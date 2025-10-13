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

  // 设置文件背景（图片）
  const setFileBackground = useCallback(
    (fileUrl: string) => {
      return updateBackground({
        type: 'file',
        value: fileUrl,
      });
    },
    [updateBackground]
  );

  // 设置视频背景
  const setVideoBackground = useCallback(
    (fileUrl: string) => {
      return updateBackground({
        type: 'video',
        value: fileUrl,
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



  return {
    background,
    updateBackground,
    setGradientBackground,
    setLocalPathBackground,
    setFileBackground,
    setVideoBackground,
    updateBackgroundEffects,
  };
};


