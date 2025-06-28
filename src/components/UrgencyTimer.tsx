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
  padding: 8px 16px;
  text-align: center;
  font-weight: bold;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  
  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 13px;
  }
  
  @media (max-width: 480px) {
    padding: 5px 10px;
    font-size: 12px;
  }
  
  @media (max-width: 375px) {
    padding: 4px 8px;
    font-size: 11px;
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
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 800;
  
  @media (max-width: 768px) {
    font-size: 14px;
    padding: 2px 6px;
  }
  
  @media (max-width: 480px) {
    font-size: 12px;
    padding: 1px 5px;
  }
  
  @media (max-width: 375px) {
    font-size: 11px;
    padding: 1px 4px;
  }
`;

const UrgencyTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  });
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // 오늘 23:59:59까지의 시간 계산
    const calculateTimeLeft = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      
      const difference = endOfDay.getTime() - now.getTime();
      
      if (difference > 0) {
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        
        setTimeLeft({ hours, minutes, seconds });
      } else {
        // 시간이 지나면 다음날로 리셋
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(23, 59, 59, 999);
        
        const newDifference = tomorrow.getTime() - now.getTime();
        const hours = Math.floor((newDifference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((newDifference / 1000 / 60) % 60);
        const seconds = Math.floor((newDifference / 1000) % 60);
        
        setTimeLeft({ hours, minutes, seconds });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <TimerContainer
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <TimerText>
        <span>🔥 오늘만 특별 혜택!</span>
        <span>
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
            fontSize: window.innerWidth <= 480 ? '14px' : window.innerWidth <= 768 ? '16px' : '18px',
            marginLeft: window.innerWidth <= 480 ? '4px' : '8px',
            padding: '2px'
          }}
        >
          ×
        </button>
      </TimerText>
    </TimerContainer>
  );
};

export default UrgencyTimer;