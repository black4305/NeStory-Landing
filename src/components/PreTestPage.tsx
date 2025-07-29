import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { detailedAnalytics } from '../utils/detailedAnalytics';

interface PreTestPageProps {
  onStart: () => void;
}

const PreTestPage: React.FC<PreTestPageProps> = ({ onStart }) => {
  useEffect(() => {
    const initTracking = async () => {
      await detailedAnalytics.trackPageEnter('/info', {
        page: 'pretest',
        title: 'MBTI 테스트 안내 페이지',
        step: 2,
        funnel: 'onboarding'
      });
    };

    initTracking();

    return () => {
      detailedAnalytics.trackPageExit();
    };
  }, []);

  const handleStartClick = () => {
    detailedAnalytics.trackCTAClick('테스트 시작 버튼', '/nestoryti', {
      position: 'pretest_main',
      buttonText: '🚀 테스트 시작하기',
      sectionName: 'start_button',
      step: 2,
      funnel: 'onboarding'
    });
    onStart();
  };

  return (
    <Container>
      <ContentCard
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Badge>
          🎯 NeStoryTI 가족 여행 성향 테스트
        </Badge>
        
        <Title>
          3분만에 알아보는<br />
          <HighlightText>우리 가족만의 여행 스타일</HighlightText>
        </Title>
        
        <Description>
          간단한 질문을 통해 가족의 여행 성향을 분석해보세요!
        </Description>
        
        <FeatureList>
          <FeatureItem>
            <FeatureIcon>📊</FeatureIcon>
            <FeatureText>
              <strong>10개 문항</strong>으로 정확한 성향 분석
            </FeatureText>
          </FeatureItem>
          
          <FeatureItem>
            <FeatureIcon>🎭</FeatureIcon>
            <FeatureText>
              <strong>8가지 여행 유형</strong> 중 우리 가족 타입 찾기
            </FeatureText>
          </FeatureItem>
          
          <FeatureItem>
            <FeatureIcon>🏞️</FeatureIcon>
            <FeatureText>
              <strong>여행 스타일 가이드</strong>
            </FeatureText>
          </FeatureItem>
          
          <FeatureItem>
            <FeatureIcon>⏱️</FeatureIcon>
            <FeatureText>
              <strong>약 2분 소요</strong> - 간단하고 빠르게!
            </FeatureText>
          </FeatureItem>
        </FeatureList>
        
        <ImportantNote>
          <NoteIcon>💡</NoteIcon>
          <NoteText>
            <strong>솔직한 답변</strong>이 가장 정확한 결과를 만들어요!<br />
            정답은 없으니 편안하게 응답해주세요.
          </NoteText>
        </ImportantNote>
        
        <StartButton
          onClick={handleStartClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🚀 테스트 시작하기
        </StartButton>
        
        <PrivacyNote>
          💯 개인정보 보호 | 📱 모바일 최적화 | ⚡ 즉시 결과 확인
        </PrivacyNote>
      </ContentCard>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  
  @media (max-width: 768px) {
    min-height: auto;
    padding: 2rem 0.75rem;
    justify-content: flex-start;
    touch-action: manipulation;
  }
  
  @media (max-width: 480px) {
    padding: 1.5rem 0.5rem;
  }
`;

const ContentCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 3rem;
  max-width: 600px;
  width: 100%;
  text-align: center;
  color: #2d3748;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  
  @media (max-width: 768px) {
    padding: 2rem;
    border-radius: 15px;
  }
  
  @media (max-width: 480px) {
    padding: 1.5rem;
  }
`;

const Badge = styled.div`
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 2rem;
  display: inline-block;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 0.4rem 1.2rem;
  }
`;

const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: 800;
  line-height: 1.3;
  margin-bottom: 1.5rem;
  color: #2d3748;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.6rem;
  }
`;

const HighlightText = styled.span`
  color: #667eea;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Description = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2.5rem;
  color: #4a5568;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.95rem;
  }
`;

const FeatureList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 12px;
  text-align: left;
  
  @media (max-width: 768px) {
    padding: 0.8rem;
  }
`;

const FeatureIcon = styled.div`
  font-size: 1.5rem;
  flex-shrink: 0;
`;

const FeatureText = styled.div`
  font-size: 0.9rem;
  color: #4a5568;
  line-height: 1.4;
  
  strong {
    color: #2d3748;
  }
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`;

const ImportantNote = styled.div`
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: white;
  padding: 1.5rem;
  border-radius: 15px;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  text-align: left;
  
  @media (max-width: 768px) {
    padding: 1.2rem;
    text-align: center;
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const NoteIcon = styled.div`
  font-size: 1.5rem;
  flex-shrink: 0;
`;

const NoteText = styled.div`
  font-size: 0.95rem;
  line-height: 1.5;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const StartButton = styled(motion.button)`
  background: linear-gradient(45deg, #28a745, #20c997);
  color: white;
  border: none;
  border-radius: 50px;
  padding: 1.2rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 10px 25px rgba(40, 167, 69, 0.3);
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    padding: 1rem 2rem;
    font-size: 1rem;
    width: 100%;
  }
`;

const PrivacyNote = styled.div`
  font-size: 0.85rem;
  color: #6b7280;
  opacity: 0.8;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

export default PreTestPage;