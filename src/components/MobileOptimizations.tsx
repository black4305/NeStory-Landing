import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useViewport } from '../hooks/useViewport';

// 모바일 최적화 관련 유틸리티 컴포넌트
const MobileOptimizations: React.FC = () => {
  const { isMobile } = useViewport();

  useEffect(() => {
    if (isMobile) {
      // 모바일에서 주소창 숨김 처리
      const hideAddressBar = () => {
        if (window.orientation !== undefined) {
          window.scrollTo(0, 1);
        }
      };

      // 페이지 로드 시 주소창 숨김
      setTimeout(hideAddressBar, 100);
      
      // 방향 변경 시 주소창 숨김
      window.addEventListener('orientationchange', () => {
        setTimeout(hideAddressBar, 500);
      });

      // 뒤로가기 버튼 처리
      const handlePopState = (event: PopStateEvent) => {
        // 모바일에서 뒤로가기 시 확인 다이얼로그 표시 (필요한 경우)
        if (window.location.pathname.includes('/landing')) {
          // 설문 진행 중일 때는 확인 다이얼로그 표시
          const isConfirmed = window.confirm('설문을 종료하시겠습니까? 진행사항이 사라집니다.');
          if (!isConfirmed) {
            window.history.pushState(null, '', window.location.pathname);
          }
        }
      };

      window.addEventListener('popstate', handlePopState);

      return () => {
        window.removeEventListener('orientationchange', hideAddressBar);
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [isMobile]);

  return null; // 실제 렌더링하지 않는 유틸리티 컴포넌트
};

// 모바일 터치 피드백 컴포넌트
const TouchFeedback = styled.div`
  @media (max-width: 768px) {
    &:active {
      background: rgba(0, 0, 0, 0.05);
      transform: scale(0.98);
    }
  }
`;

// 모바일 스크롤 힌트 컴포넌트
const ScrollHint = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  z-index: 100;
  display: none;
  
  @media (max-width: 768px) {
    display: block;
    animation: bounce 2s infinite;
  }
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateX(-50%) translateY(0);
    }
    40% {
      transform: translateX(-50%) translateY(-10px);
    }
    60% {
      transform: translateX(-50%) translateY(-5px);
    }
  }
`;

export { MobileOptimizations, TouchFeedback, ScrollHint };