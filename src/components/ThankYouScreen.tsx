import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.2); }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
`;

const BackgroundPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.1;
  background-image: 
    radial-gradient(circle at 25% 25%, white 2px, transparent 2px),
    radial-gradient(circle at 75% 75%, white 2px, transparent 2px);
  background-size: 100px 100px;
  background-position: 0 0, 50px 50px;
`;

const ContentCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 30px;
  padding: 4rem 3rem;
  text-align: center;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
  max-width: 600px;
  width: 100%;
  position: relative;
  
  @media (max-width: 768px) {
    padding: 3rem 2rem;
    border-radius: 25px;
  }
`;

const IconContainer = styled.div`
  font-size: 5rem;
  margin-bottom: 2rem;
  animation: ${float} 3s ease-in-out infinite;
  
  @media (max-width: 768px) {
    font-size: 4rem;
    margin-bottom: 1.5rem;
  }
`;

const MainTitle = styled.h1`
  color: #2d3748;
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const SubTitle = styled.h2`
  color: #4a5568;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 2rem;
  line-height: 1.4;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
  }
`;

const Description = styled.p`
  color: #718096;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 2rem;
  }
`;

const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ProgressBar = styled.div`
  width: 200px;
  height: 8px;
  background: #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  
  @media (max-width: 768px) {
    width: 150px;
    height: 6px;
  }
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 10px;
`;

const ProgressText = styled.div`
  color: #4a5568;
  font-weight: 600;
  font-size: 0.9rem;
`;

const FloatingElements = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
`;

const FloatingIcon = styled.div<{ delay: number; size: number; left: string; top: string }>`
  position: absolute;
  left: ${props => props.left};
  top: ${props => props.top};
  font-size: ${props => props.size}rem;
  opacity: 0.6;
  animation: ${sparkle} 2s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
`;

const CountdownContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
  color: #667eea;
  font-weight: 600;
`;

const CountdownNumber = styled(motion.span)`
  font-size: 1.2rem;
  font-weight: 800;
  color: #764ba2;
`;

interface ThankYouScreenProps {
  userName?: string;
  onComplete: () => void;
}

const ThankYouScreen: React.FC<ThankYouScreenProps> = ({ userName, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // 진행바 애니메이션
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    // 카운트다운
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(countdownInterval);
    };
  }, [onComplete]);

  const floatingIcons = [
    { icon: '🎉', delay: 0, size: 2, left: '10%', top: '20%' },
    { icon: '✨', delay: 0.5, size: 1.5, left: '85%', top: '15%' },
    { icon: '🎊', delay: 1, size: 1.8, left: '15%', top: '70%' },
    { icon: '💫', delay: 1.5, size: 1.3, left: '80%', top: '65%' },
    { icon: '🌟', delay: 2, size: 1.6, left: '5%', top: '45%' },
    { icon: '✨', delay: 2.5, size: 1.4, left: '90%', top: '40%' }
  ];

  return (
    <Container>
      <BackgroundPattern />
      
      <FloatingElements>
        {floatingIcons.map((item, index) => (
          <FloatingIcon
            key={index}
            delay={item.delay}
            size={item.size}
            left={item.left}
            top={item.top}
          >
            {item.icon}
          </FloatingIcon>
        ))}
      </FloatingElements>

      <ContentCard
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <IconContainer>🙏</IconContainer>
        
        <MainTitle>진심으로 감사합니다!</MainTitle>
        
        <SubTitle>
          {userName ? `${userName}님의` : '귀하의'} 소중한 시간을 내어<br/>
          설문에 참여해 주셔서 감사합니다
        </SubTitle>
        
        <Description>
          여러분의 답변을 바탕으로 완벽한 가족 여행 스타일을 분석하고 있습니다.<br/>
          맞춤형 여행 추천 결과를 곧 확인하실 수 있습니다.
        </Description>

        <ProgressContainer>
          <ProgressText>분석 중</ProgressText>
          <ProgressBar>
            <ProgressFill
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </ProgressBar>
          <ProgressText>{progress}%</ProgressText>
        </ProgressContainer>

        <CountdownContainer>
          <span>결과 페이지로 이동까지</span>
          <CountdownNumber
            key={countdown}
            initial={{ scale: 1.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {countdown}
          </CountdownNumber>
          <span>초</span>
        </CountdownContainer>
      </ContentCard>
    </Container>
  );
};

export default ThankYouScreen;