import type { AppConfig } from '../types';
import configData from './config.json';

/**
 * 获取默认配置
 */
export const getDefaultConfig = (): AppConfig => {
  return configData as AppConfig;
};
