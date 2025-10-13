import { useMemo } from 'react';
import { useBackground } from '../../hooks/useBackground';
import './Background.less';

/**
 * 背景组件
 */
const Background: React.FC = () => {
  const { background } = useBackground();

  // 计算背景样式
  const backgroundStyle = useMemo(() => {
    const { type, value, gradient, effects } = background;
    
    const bgStyle: React.CSSProperties = {};

    // 设置背景
    if (type === 'gradient' && gradient?.colors) {
      const angle = gradient.angle || 135;
      bgStyle.background = `linear-gradient(${angle}deg, ${gradient.colors.join(', ')})`;
    } else if (type === 'file' && value) {
      bgStyle.backgroundImage = `url(${value})`;
      bgStyle.backgroundSize = 'cover';
      bgStyle.backgroundPosition = 'center';
      bgStyle.backgroundRepeat = 'no-repeat';
    } else if (type === 'local-path' && value) {
      bgStyle.backgroundImage = `url(${value})`;
      bgStyle.backgroundSize = 'cover';
      bgStyle.backgroundPosition = 'center';
      bgStyle.backgroundRepeat = 'no-repeat';
    }

    // 应用效果（视频不应用 filter，会影响性能）
    if (type !== 'video') {
      const filters: string[] = [];
      if (effects.blur > 0) {
        filters.push(`blur(${effects.blur}px)`);
      }
      if (effects.brightness !== 100) {
        filters.push(`brightness(${effects.brightness}%)`);
      }
      if (filters.length > 0) {
        bgStyle.filter = filters.join(' ');
      }
    }
    if (effects.opacity !== 100) {
      bgStyle.opacity = effects.opacity / 100;
    }

    return bgStyle;
  }, [background]);

  // 判断是否为视频背景
  const isVideo = background.type === 'video' && background.value;

  return (
    <>
      {isVideo ? (
        <video
          className="background background-video"
          autoPlay
          loop
          muted
          playsInline
          style={{
            opacity: background.effects.opacity / 100,
          }}
        >
          <source src={background.value} />
        </video>
      ) : (
        <div className="background" style={backgroundStyle} />
      )}
    </>
  );
};

export default Background;
