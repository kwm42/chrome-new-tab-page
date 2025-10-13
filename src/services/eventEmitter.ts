/**
 * 配置变化事件发射器
 * 用于在不同组件间同步配置状态
 */
class ConfigEventEmitter {
  private listeners: Set<() => void> = new Set();

  /**
   * 订阅配置变化事件
   */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    // 返回取消订阅函数
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * 触发配置变化事件
   */
  emit(): void {
    console.log('[ConfigEmitter] 触发配置变化事件，监听器数量:', this.listeners.size);
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (error) {
        console.error('[ConfigEmitter] 监听器执行出错:', error);
      }
    });
  }

  /**
   * 获取当前监听器数量
   */
  getListenerCount(): number {
    return this.listeners.size;
  }
}

// 导出单例实例
export const configEmitter = new ConfigEventEmitter();
