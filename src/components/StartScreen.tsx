import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import NeStoryTILogo from './NeStoryTILogo';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  
  @media (max-width: 768px) {
    padding: 1rem 0.5rem;
    min-height: 100vh;
    overflow-y: auto;
  }
  
  @media (max-width: 375px) {
    padding: 0.5rem 0.25rem;
  }
`;

const Title = styled(motion.h1)`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 0.75rem;
  }
  
  @media (max-width: 375px) {
    font-size: 1.6rem;
    margin-bottom: 0.5rem;
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
  width: 100%;
  
  @media (max-width: 768px) {
    padding: 1.25rem;
    border-radius: 15px;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 375px) {
    padding: 1rem;
    margin-bottom: 1rem;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 500px;
  flex: 1;
  
  @media (max-width: 768px) {
    max-width: 100%;
    justify-content: center;
    gap: 1rem;
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
  min-height: 50px; /* 터치 인터페이스를 위한 최소 높이 */
  width: 100%;
  max-width: 280px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
  }
  
  @media (max-width: 768px) {
    padding: 1rem 2rem;
    font-size: 1.1rem;
    min-height: 48px;
    max-width: 250px;
  }
  
  @media (max-width: 375px) {
    padding: 0.9rem 1.5rem;
    font-size: 1rem;
    max-width: 220px;
    min-height: 44px;
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

const LogoSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    margin-bottom: 0.5rem;
  }
`;

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <Container>
      <LogoSection>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.1 }}
        >
          <NeStoryTILogo size={100} showText={true} color="#ffffff" />
        </motion.div>
      </LogoSection>
      <ContentWrapper>
        <Title
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          👨‍👩‍👧‍👦 우리 가족 여행 스타일은?
        </Title>
        
        <Subtitle
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          "어디 갈까?" 고민 끝! 3분 테스트로 완벽한 답을 찾아보세요
        </Subtitle>
        
        <Description
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h3 style={{ marginTop: 0 }}>🤔 혹시 이런 고민 있으셨나요?</h3>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>
            "아이들은 놀이공원, 어른들은 카페... 모두 만족할 곳이 있을까?"<br />
            <strong>딱 10개 질문</strong>으로 우리 가족 성향을 알아보세요!
          </p>
          
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.2)', 
            borderRadius: '10px', 
            padding: '0.75rem', 
            marginBottom: '1rem',
            fontSize: '0.85rem'
          }}>
            🎯 <strong>테스트 완료 후</strong>: 나만의 여행 스타일 분석 결과 확인!
          </div>
          
          <Features>
            <Feature>⏱️ 3분 완성</Feature>
            <Feature>🧭 여행 성향 진단</Feature>
            <Feature>📍 여행 스타일 분석</Feature>
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
          🤔 우리 가족은 어떤 스타일일까?
        </StartButton>
      </ContentWrapper>
    </Container>
  );
};

export default StartScreen;