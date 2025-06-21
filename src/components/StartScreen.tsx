import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
`;

const Title = styled(motion.h1)`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const Description = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  max-width: 500px;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const StartButton = styled(motion.button)`
  background: linear-gradient(45deg, #ff6b6b, #ffa500);
  border: none;
  border-radius: 50px;
  padding: 1rem 2.5rem;
  font-size: 1.2rem;
  font-weight: 700;
  color: white;
  cursor: pointer;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
  }
  
  @media (max-width: 768px) {
    padding: 0.8rem 2rem;
    font-size: 1.1rem;
  }
`;

const Features = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const Feature = styled.div`
  background: rgba(255, 255, 255, 0.15);
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-size: 0.9rem;
`;

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <Container>
      <Title
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        🧳 가족여행 유형 테스트
      </Title>
      
      <Subtitle
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        우리 가족만의 특별한 여행 스타일을 찾아보세요!
      </Subtitle>
      
      <Description
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <h3 style={{ marginTop: 0 }}>📊 5가지 축으로 분석</h3>
        <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
          활동성, 선호지역, 여행목적, 예산, 주도권을 기준으로 
          총 32가지 유형 중 하나로 분류해드립니다.
        </p>
        
        <Features>
          <Feature>⏱️ 2-3분 소요</Feature>
          <Feature>📱 15개 문항</Feature>
          <Feature>🎯 맞춤 추천</Feature>
        </Features>
      </Description>
      
      <StartButton
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        onClick={onStart}
      >
        테스트 시작하기 🚀
      </StartButton>
    </Container>
  );
};

export default StartScreen;