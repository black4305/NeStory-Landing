import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const ParticipantsBanner = styled(motion.div)`
  position: fixed !important;
  bottom: 0 !important;
  left: 0 !important;
  right: 0 !important;
  width: 100% !important;
  height: 60px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  font-size: 14px;
  font-weight: 600;
  z-index: 9999 !important;
  box-shadow: 0 -4px 20px rgba(0,0,0,0.3);
  overflow: hidden;
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255,255,255,0.2);
  display: block !important;
  
  @media (max-width: 768px) {
    height: 55px;
    font-size: 13px;
  }
  
  @media (max-width: 480px) {
    height: 50px;
    font-size: 12px;
  }
  
  @media (max-width: 375px) {
    height: 45px;
    font-size: 11px;
  }
`;


const ScrollingContainer = styled.div`
  display: flex;
  align-items: center;
  animation: horizontalScroll 25s linear infinite;
  gap: 40px;
  padding: 0 20px;
  white-space: nowrap;
  height: 100%;
  
  @keyframes horizontalScroll {
    0% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(-100%);
    }
  }
  
  @media (max-width: 768px) {
    gap: 35px;
    padding: 0 15px;
  }
  
  @media (max-width: 480px) {
    gap: 30px;
    padding: 0 10px;
  }
`;

const MessageItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  background: rgba(255, 255, 255, 0.15);
  padding: 6px 16px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  font-size: inherit;
  
  @media (max-width: 480px) {
    gap: 6px;
    padding: 5px 12px;
  }
  
  @media (max-width: 375px) {
    padding: 4px 10px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255,255,255,0.2);
  border: none;
  color: white;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 50%;
  font-size: 16px;
  z-index: 1000;
  
  &:hover {
    background: rgba(255,255,255,0.4);
  }
  
  @media (max-width: 480px) {
    font-size: 14px;
    padding: 3px 6px;
    right: 10px;
  }
  
  @media (max-width: 375px) {
    font-size: 12px;
    padding: 2px 5px;
    right: 8px;
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