/**
 * Favicon 工具类
 * 用于获取和处理网站图标
 */

/**
 * 从 URL 中提取域名
 */
export function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    return urlObj.hostname;
  } catch {
    return '';
  }
}

/**
 * 生成 Google Favicon API 的 URL
 */
export function getFaviconUrl(url: string, size = 64): string {
  const domain = extractDomain(url);
  if (!domain) return '';
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
}

/**
 * 将图片 URL 转换为 Base64
 * 注意：由于 CORS 限制，只能用于同源图片或支持 CORS 的图片
 */
export async function imageUrlToBase64(imageUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    // 注意：Google Favicon API 不支持 CORS，所以这个方法对其无效
    // 只用于用户上传或本地图片
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('无法获取 canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0);
        const base64 = canvas.toDataURL('image/png');
        resolve(base64);
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error('图片加载失败'));
    };
    
    img.src = imageUrl;
  });
}

/**
 * 从网站 URL 获取 favicon URL
 * 注意：由于 CORS 限制，返回的是 URL 而不是 Base64
 * 如果需要缓存，建议使用服务器端代理或浏览器插件
 */
export async function fetchAndCacheFavicon(url: string): Promise<string> {
  try {
    const faviconUrl = getFaviconUrl(url, 64);
    // 直接返回 URL，不转换为 Base64（避免 CORS 问题）
    return faviconUrl;
  } catch (error) {
    console.error('获取 favicon 失败:', error);
    return '';
  }
}

/**
 * 将用户上传的文件转换为 Base64
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    
    reader.onerror = () => {
      reject(new Error('文件读取失败'));
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * 检查是否是 Emoji
 */
export function isEmoji(str: string): boolean {
  // 检测 emoji 的正则表达式
  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  return emojiRegex.test(str);
}

/**
 * 检查是否是 Base64 图片
 */
export function isBase64Image(str: string): boolean {
  return str.startsWith('data:image/');
}

/**
 * 检查是否是 URL
 */
export function isUrl(str: string): boolean {
  return str.startsWith('http://') || str.startsWith('https://');
}

/**
 * 自动检测图标类型
 */
export function detectIconType(icon?: string): 'emoji' | 'base64' | 'url' | 'auto' {
  if (!icon) return 'auto';
  if (isEmoji(icon)) return 'emoji';
  if (isBase64Image(icon)) return 'base64';
  if (isUrl(icon)) return 'url';
  return 'auto';
}
