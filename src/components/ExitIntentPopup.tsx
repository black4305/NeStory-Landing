import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { detailedAnalytics } from '../utils/detailedAnalytics';

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
        
        <Title>💔 이대로 떠나시는데... 정말 괜찮으신가요?</Title>
        <Subtitle>
          "엄마, 우리 언제 또 여행가?"<br/>
          아이의 이 한마디에 가슴이 뫕클하셨나요?<br/>
          매번 계획만 세우다 흐지부지되는 가족여행...<br/>
          이번만큼은 다르게 만들어드릴게요!
        </Subtitle>
        
        <SpecialOffer>
          🎁 [NeStory] 스트레스 제로! 국내 가족여행 완벽 준비 템플릿<br/>
          "엄마, 이번 여행 정말 재밌었어!"<br/>
          아이들이 환하게 박수치는 그 순간...<br/>
          내년에도 그런 추억을 만들어주세요
        </SpecialOffer>
        
        <div style={{marginTop: '20px', fontSize: '14px', color: '#666', lineHeight: '1.6'}}>
          ✨ 아이들이 여행 내내 웃음소리가 끊이지 않는 마법<br/>
          ✨ 준비물 빠뜨려서 낙담하는 일 없이 완벽한 하루<br/>
          ✨ "엄마 정말 대단해!" 가족들의 인정과 고마움<br/>
          ✨ 내년에도 계속 생각날 소중한 가족 추억
        </div>
        
        <CTAButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            const sessionInfo = detailedAnalytics.getSessionInfo();
            const surveyUrl = process.env.REACT_APP_SURVEY_URL || 'https://survey.nestory.co.kr';
            const urlWithParams = `${surveyUrl}?landing_session=${sessionInfo.sessionId}&ref=exit_intent`;
            window.open(urlWithParams, '_blank');
            onAccept();
          }}
          style={{marginTop: '25px', width: '100%', fontSize: '16px'}}
        >
          📋 템플릿 받기 →
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