import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const ParticipantsBanner = styled(motion.div)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 280px;
  height: 200px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  font-size: 13px;
  font-weight: 600;
  z-index: 999;
  box-shadow: 0 8px 30px rgba(0,0,0,0.3);
  border-radius: 15px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
  
  @media (max-width: 768px) {
    width: 250px;
    height: 180px;
    bottom: 15px;
    right: 15px;
    font-size: 12px;
  }
  
  @media (max-width: 480px) {
    width: 220px;
    height: 160px;
    bottom: 10px;
    right: 10px;
    font-size: 11px;
  }
  
  @media (max-width: 375px) {
    width: 200px;
    height: 140px;
    font-size: 10px;
  }
`;

const LiveIndicator = styled(motion.span)`
  color: #ff4757;
  font-weight: 800;
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  @media (max-width: 480px) {
    font-size: 0.9em;
  }
  
  @media (max-width: 375px) {
    font-size: 0.8em;
  }
`;

const ScrollingContainer = styled.div`
  display: flex;
  flex-direction: column;
  animation: verticalScroll 20s linear infinite;
  gap: 15px;
  padding: 15px;
  height: 100%;
  
  @keyframes verticalScroll {
    0% {
      transform: translateY(100%);
    }
    100% {
      transform: translateY(-100%);
    }
  }
  
  @media (max-width: 768px) {
    padding: 12px;
    gap: 12px;
  }
  
  @media (max-width: 480px) {
    padding: 10px;
    gap: 10px;
  }
`;

const MessageItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  background: rgba(255, 255, 255, 0.1);
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  @media (max-width: 480px) {
    gap: 6px;
    padding: 6px 10px;
  }
  
  @media (max-width: 375px) {
    padding: 5px 8px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  right: 10px;
  top: 10px;
  background: rgba(255,255,255,0.2);
  border: none;
  color: white;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 50%;
  font-size: 14px;
  z-index: 1000;
  
  &:hover {
    background: rgba(255,255,255,0.4);
  }
  
  @media (max-width: 480px) {
    font-size: 12px;
    padding: 3px 6px;
    right: 8px;
    top: 8px;
  }
  
  @media (max-width: 375px) {
    font-size: 11px;
    padding: 2px 5px;
    right: 6px;
    top: 6px;
  }
`;

const LiveHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 15px 8px 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  
  @media (max-width: 768px) {
    padding: 10px 12px 6px 12px;
  }
  
  @media (max-width: 480px) {
    padding: 8px 10px 5px 10px;
  }
`;

const HeaderText = styled.span`
  font-size: 12px;
  font-weight: 700;
  opacity: 0.9;
  
  @media (max-width: 480px) {
    font-size: 11px;
  }
`;

const LiveParticipants: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  // 실제 한국 이름 목록
  const koreanNames = [
    '김민수', '이영희', '박철수', '최수진', '정민호', '강지은', '윤세영', '임도현',
    '한소영', '오준혁', '신예린', '배현우', '노은정', '송지훈', '전미래', '조현석',
    '홍유진', '문성호', '서다은', '황민준', '양수아', '백도윤', '권서연', '남태영',
    '고은비', '안준서', '유채원', '장민석', '현지우', '마서진'
  ];

  // 이름을 가운데 글자 숨김 처리 (예: 홍길동 → 홍O동)
  const maskName = (name: string) => {
    if (name.length === 2) {
      return name[0] + 'O';
    } else if (name.length === 3) {
      return name[0] + 'O' + name[2];
    }
    return name;
  };

  // 여러 메시지 생성
  const generateMessages = () => {
    const actions = [
      { text: '설문을 완료했습니다', icon: '✅' },
      { text: '여행 유형을 확인했습니다', icon: '🎯' },
      { text: '테스트를 마쳤습니다', icon: '🎉' },
      { text: '결과를 공유했습니다', icon: '📤' },
      { text: '가족 유형을 발견했습니다', icon: '💖' }
    ];
    const messages = [];
    
    for (let i = 0; i < 6; i++) {
      const randomName = koreanNames[Math.floor(Math.random() * koreanNames.length)];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      messages.push(`${randomAction.icon} ${maskName(randomName)}님이 ${randomAction.text}`);
    }
    
    return messages;
  };

  const handleClose = () => {
    setIsVisible(false);
    // 세션 스토리지에 숨김 상태 저장
    sessionStorage.setItem('liveBannerHidden', 'true');
  };

  // 세션 스토리지에서 숨김 상태 확인
  useEffect(() => {
    const isHidden = sessionStorage.getItem('liveBannerHidden');
    if (isHidden === 'true') {
      setIsVisible(false);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <ParticipantsBanner
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <LiveHeader>
          <LiveIndicator>🔴</LiveIndicator>
          <HeaderText>실시간 활동</HeaderText>
        </LiveHeader>
        
        <ScrollingContainer>
          {generateMessages().map((message, index) => (
            <MessageItem key={index}>
              {message}
            </MessageItem>
          ))}
          {/* 끊김 없는 스크롤을 위해 메시지 복제 */}
          {generateMessages().map((message, index) => (
            <MessageItem key={`duplicate-${index}`}>
              {message}
            </MessageItem>
          ))}
        </ScrollingContainer>
        
        <CloseButton onClick={handleClose}>
          ×
        </CloseButton>
      </ParticipantsBanner>
    </AnimatePresence>
  );
};

export default LiveParticipants;