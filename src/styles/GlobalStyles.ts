import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  /* 모바일 터치 개선 */
  * {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    -webkit-touch-callout: none;
  }
  
  /* 모바일 스크롤 개선 */
  html {
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
  }
  
  body {
    margin: 0;
    padding: 0;
    overscroll-behavior: none;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  /* 모바일 입력 필드 줌 방지 */
  input[type="text"],
  input[type="email"],
  input[type="tel"],
  select,
  textarea {
    font-size: 16px;
  }
  
  /* 모바일 버튼 터치 영역 확장 */
  button {
    min-height: 44px;
    min-width: 44px;
    touch-action: manipulation;
  }
  
  /* iOS 안전 영역 대응 */
  @supports (padding: max(0px)) {
    .safe-area-top {
      padding-top: max(20px, env(safe-area-inset-top));
    }
    
    .safe-area-bottom {
      padding-bottom: max(20px, env(safe-area-inset-bottom));
    }
  }
  
  /* 모바일 가로 스크롤 방지 */
  html, body {
    overflow-x: hidden;
    width: 100%;
  }
  
  /* 모바일 선택 비활성화 (필요한 곳에만) */
  .no-select {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
`;