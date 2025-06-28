import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const PopupContainer = styled(motion.div)`
  background: white;
  padding: 40px;
  border-radius: 16px;
  max-width: 500px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  position: relative;
  
  @media (max-width: 768px) {
    padding: 25px 18px;
    margin: 15px;
    border-radius: 12px;
    max-width: 90vw;
  }
  
  @media (max-width: 480px) {
    padding: 20px 15px;
    margin: 12px;
    border-radius: 10px;
    max-width: 95vw;
  }
  
  @media (max-width: 375px) {
    padding: 18px 12px;
    margin: 10px;
    border-radius: 8px;
    max-width: 98vw;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  padding: 5px;
  
  &:hover {
    color: #333;
  }
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin: 0 0 15px 0;
  
  @media (max-width: 768px) {
    font-size: 22px;
    margin: 0 0 12px 0;
  }
  
  @media (max-width: 480px) {
    font-size: 20px;
    margin: 0 0 10px 0;
  }
  
  @media (max-width: 375px) {
    font-size: 18px;
    margin: 0 0 8px 0;
  }
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #666;
  margin: 0 0 25px 0;
  line-height: 1.5;
  
  @media (max-width: 768px) {
    font-size: 14px;
    margin: 0 0 20px 0;
    line-height: 1.4;
  }
  
  @media (max-width: 480px) {
    font-size: 13px;
    margin: 0 0 18px 0;
  }
  
  @media (max-width: 375px) {
    font-size: 12px;
    margin: 0 0 15px 0;
  }
`;

const CTAButton = styled(motion.button)`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 15px 30px;
  font-size: 18px;
  font-weight: bold;
  border-radius: 25px;
  cursor: pointer;
  margin: 10px;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  
  @media (max-width: 768px) {
    padding: 12px 24px;
    font-size: 15px;
    margin: 8px;
    border-radius: 20px;
  }
  
  @media (max-width: 480px) {
    padding: 11px 20px;
    font-size: 14px;
    margin: 6px;
    border-radius: 18px;
  }
  
  @media (max-width: 375px) {
    padding: 10px 18px;
    font-size: 13px;
    margin: 5px;
    border-radius: 15px;
  }
`;

const SecondaryButton = styled(motion.button)`
  background: transparent;
  color: #999;
  border: 1px solid #ddd;
  padding: 12px 25px;
  font-size: 16px;
  border-radius: 20px;
  cursor: pointer;
  margin: 10px;
  
  &:hover {
    background: #f5f5f5;
  }
  
  @media (max-width: 768px) {
    padding: 10px 18px;
    font-size: 14px;
    margin: 8px;
    border-radius: 15px;
  }
  
  @media (max-width: 480px) {
    padding: 9px 16px;
    font-size: 13px;
    margin: 6px;
  }
  
  @media (max-width: 375px) {
    padding: 8px 14px;
    font-size: 12px;
    margin: 5px;
  }
`;

const SpecialOffer = styled.div`
  background: linear-gradient(135deg, #ff6b6b, #ff8e53);
  color: white;
  padding: 15px;
  border-radius: 10px;
  margin: 20px 0;
  font-weight: bold;
  
  @media (max-width: 768px) {
    padding: 12px;
    font-size: 14px;
    margin: 15px 0;
    border-radius: 8px;
  }
  
  @media (max-width: 480px) {
    padding: 10px;
    font-size: 13px;
    margin: 12px 0;
  }
  
  @media (max-width: 375px) {
    padding: 8px;
    font-size: 12px;
    margin: 10px 0;
  }
`;

interface ExitIntentPopupProps {
  onClose: () => void;
  onAccept: () => void;
}

const ExitIntentPopup: React.FC<ExitIntentPopupProps> = ({ onClose, onAccept }) => {
  return (
    <Overlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <PopupContainer
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <CloseButton onClick={onClose}>×</CloseButton>
        
        <Title>🚨 잠깐만요!</Title>
        <Subtitle>
          나만의 가족 여행 스타일을 알아보지 않고 가시나요?<br/>
          1분이면 여행 성향 분석이 완료됩니다!
        </Subtitle>
        
        <SpecialOffer>
          🎁 지금 시작하면 맞춤 여행지 추천까지!
        </SpecialOffer>
        
        <CTAButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAccept}
        >
          🎯 무료로 테스트 시작하기
        </CTAButton>
        
        <SecondaryButton
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
        >
          다음에 할게요
        </SecondaryButton>
      </PopupContainer>
    </Overlay>
  );
};

export default ExitIntentPopup;