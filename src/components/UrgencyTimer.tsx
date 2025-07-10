import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const TimerContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #ff6b6b, #ff8e53);
  color: white;
  padding: 16px 24px;
  text-align: center;
  font-weight: bold;
  z-index: 1000;
  box-shadow: 0 4px 16px rgba(0,0,0,0.3);
  font-size: 18px;
  
  @media (max-width: 768px) {
    padding: 12px 20px;
    font-size: 16px;
  }
  
  @media (max-width: 480px) {
    padding: 10px 16px;
    font-size: 14px;
  }
  
  @media (max-width: 375px) {
    padding: 8px 12px;
    font-size: 13px;
  }
`;

const TimerText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 3px;
  }
  
  @media (max-width: 480px) {
    gap: 2px;
  }
  
  @media (max-width: 375px) {
    gap: 1px;
  }
`;

const TimeDisplay = styled.span`
  background: rgba(255,255,255,0.2);
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 22px;
  font-weight: 800;
  margin: 0 2px;
  
  @media (max-width: 768px) {
    font-size: 20px;
    padding: 3px 10px;
  }
  
  @media (max-width: 480px) {
    font-size: 18px;
    padding: 2px 8px;
  }
  
  @media (max-width: 375px) {
    font-size: 16px;
    padding: 2px 6px;
  }
`;

const UrgencyTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // 2025년 8월 31일 23:59:59까지의 시간 계산
    const calculateTimeLeft = () => {
      const now = new Date();
      const targetDate = new Date('2025-08-31T23:59:59');
      
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        // 시간이 지나면 0으로 설정
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // 세션 저장 제거 - 페이지 새로고침 시 다시 표시됨
  };

  if (!isVisible) return null;

  return (
    <TimerContainer
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <TimerText>
        <span>🔥 8월 31일 자정까지만 무료 테스트!</span>
        <span>
          <TimeDisplay>{timeLeft.days}일</TimeDisplay>
          <TimeDisplay>{String(timeLeft.hours).padStart(2, '0')}</TimeDisplay>:
          <TimeDisplay>{String(timeLeft.minutes).padStart(2, '0')}</TimeDisplay>:
          <TimeDisplay>{String(timeLeft.seconds).padStart(2, '0')}</TimeDisplay>
        </span>
        <span>후 마감 ⏰</span>
        <button 
          onClick={handleClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: window.innerWidth <= 480 ? '16px' : window.innerWidth <= 768 ? '18px' : '20px',
            marginLeft: window.innerWidth <= 480 ? '6px' : '10px',
            padding: '4px'
          }}
        >
          ×
        </button>
      </TimerText>
    </TimerContainer>
  );
};

export default UrgencyTimer;