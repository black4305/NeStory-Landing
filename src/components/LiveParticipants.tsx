import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const ParticipantsWidget = styled(motion.div)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 12px 16px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 600;
  z-index: 999;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
  cursor: pointer;
  user-select: none;
  
  @media (max-width: 768px) {
    bottom: 15px;
    right: 15px;
    padding: 10px 14px;
    font-size: 13px;
    border-radius: 20px;
  }
  
  @media (max-width: 480px) {
    bottom: 12px;
    right: 12px;
    padding: 8px 12px;
    font-size: 12px;
    border-radius: 18px;
  }
  
  @media (max-width: 375px) {
    bottom: 10px;
    right: 10px;
    padding: 7px 10px;
    font-size: 11px;
    border-radius: 15px;
  }
`;

const ParticipantCount = styled.span`
  background: rgba(255,255,255,0.2);
  padding: 2px 8px;
  border-radius: 12px;
  margin: 0 4px;
  font-weight: 800;
  
  @media (max-width: 480px) {
    padding: 1px 6px;
    margin: 0 3px;
    border-radius: 10px;
  }
  
  @media (max-width: 375px) {
    padding: 1px 5px;
    margin: 0 2px;
    border-radius: 8px;
  }
`;

const PulseCircle = styled(motion.div)`
  position: absolute;
  top: -2px;
  right: -2px;
  width: 12px;
  height: 12px;
  background: #ff4757;
  border-radius: 50%;
  border: 2px solid white;
  
  @media (max-width: 480px) {
    width: 10px;
    height: 10px;
    border: 1.5px solid white;
  }
  
  @media (max-width: 375px) {
    width: 8px;
    height: 8px;
    border: 1px solid white;
  }
`;

const LiveParticipants: React.FC = () => {
  const [currentCount, setCurrentCount] = useState(32);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // 실시간 참여자 수 시뮬레이션
    const updateCount = () => {
      // 25-45 사이에서 랜덤하게 변동
      const baseCount = 35;
      const variation = Math.floor(Math.random() * 21) - 10; // -10 ~ +10
      const newCount = Math.max(25, Math.min(45, baseCount + variation));
      setCurrentCount(newCount);
    };

    const interval = setInterval(updateCount, 3000 + Math.random() * 5000); // 3-8초마다 업데이트

    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    // 클릭 시 잠시 숨기기
    setIsVisible(false);
    setTimeout(() => setIsVisible(true), 5000);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <ParticipantsWidget
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
      >
        <PulseCircle
          animate={{
            scale: [1, 1.3, 1],
            opacity: [1, 0.7, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        🔴 현재
        <ParticipantCount>
          <motion.span
            key={currentCount}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {currentCount}
          </motion.span>
        </ParticipantCount>
        명이 테스트 중
      </ParticipantsWidget>
    </AnimatePresence>
  );
};

export default LiveParticipants;