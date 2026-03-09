import type { ReactNode } from 'react';
import type { OverlayTheme, OverlayLayout } from '../../types';

interface OverlayContainerProps {
  theme: OverlayTheme;
  layout: OverlayLayout;
  children: ReactNode;
}

export function OverlayContainer({ theme, layout, children }: OverlayContainerProps) {
  // 위치에 따른 스타일
  const positionStyles: Record<string, React.CSSProperties> = {
    'top-left': { top: layout.padding, left: layout.padding },
    'top-right': { top: layout.padding, right: layout.padding },
    'bottom-left': { bottom: layout.padding, left: layout.padding },
    'bottom-right': { bottom: layout.padding, right: layout.padding },
    custom: { bottom: layout.padding, left: layout.padding },
  };

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    ...positionStyles[layout.position],
    maxWidth: '90vw',
    zIndex: 9999,
  };

  // 패널 스타일 (배경이 있을 경우)
  const panelStyle: React.CSSProperties = theme.showPanel
    ? {
        backgroundColor: `${theme.backgroundColor}${Math.round(theme.backgroundOpacity * 255)
          .toString(16)
          .padStart(2, '0')}`,
        borderRadius: `${theme.borderRadius}px`,
        padding: '16px 24px',
      }
    : {};

  return (
    <div style={containerStyle}>
      <div style={panelStyle}>{children}</div>
    </div>
  );
}
