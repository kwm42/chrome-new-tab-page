import { storageService } from './storage';

/**
 * 导出配置到文件
 */
export const exportConfigToFile = (): void => {
  try {
    const jsonString = storageService.export();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `chrome-tab-config-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('导出配置失败:', error);
    throw error;
  }
};

/**
 * 从文件导入配置
 */
export const importConfigFromFile = (): Promise<{ success: boolean; error?: string }> => {
  return new Promise((resolve) => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'application/json,.json';
      
      input.onchange = async (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) {
          resolve({ success: false, error: '未选择文件' });
          return;
        }

        try {
          const text = await file.text();
          const result = storageService.import(text);
          resolve(result);
        } catch (error) {
          resolve({
            success: false,
            error: '读取文件失败：' + (error as Error).message,
          });
        }
      };

      input.oncancel = () => {
        resolve({ success: false, error: '用户取消' });
      };

      input.click();
    } catch (error) {
      resolve({
        success: false,
        error: '导入失败：' + (error as Error).message,
      });
    }
  });
};

/**
 * 复制配置到剪贴板
 */
export const copyConfigToClipboard = async (): Promise<boolean> => {
  try {
    const jsonString = storageService.export();
    await navigator.clipboard.writeText(jsonString);
    return true;
  } catch (error) {
    console.error('复制配置失败:', error);
    return false;
  }
};

/**
 * 从剪贴板粘贴配置
 */
export const pasteConfigFromClipboard = async (): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    const text = await navigator.clipboard.readText();
    const result = storageService.import(text);
    return result;
  } catch (error) {
    return {
      success: false,
      error: '读取剪贴板失败：' + (error as Error).message,
    };
  }
};
