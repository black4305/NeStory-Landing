import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import html2canvas from 'html2canvas';
import { AxisScore } from '../types';
import { travelTypes } from '../data/travelTypes';
import { characters } from '../data/characters';
import { regionalRecommendations } from '../data/regions';
import CharacterAvatar from './CharacterAvatar';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
`;

const ResultCard = styled(motion.div)`
  background: white;
  border-radius: 25px;
  padding: 2.5rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  max-width: 700px;
  width: 100%;
  text-align: center;
  color: #2d3748;
  
  @media (max-width: 768px) {
    padding: 2rem;
    border-radius: 20px;
  }
`;

const TypeCode = styled.div`
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  display: inline-block;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    padding: 0.8rem 1.5rem;
  }
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1.4;
  margin-bottom: 1rem;
  color: #2d3748;
  
  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

const Description = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  color: #4a5568;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const RecommendationSection = styled.div`
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  text-align: left;
`;

const RecommendationTitle = styled.h3`
  color: #667eea;
  font-size: 1.3rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const RecommendationList = styled.ul`
  list-style: none;
  padding: 0;
`;

const RecommendationItem = styled.li`
  background: white;
  border-radius: 15px;
  padding: 1rem 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #667eea;
`;

const AxisSection = styled.div`
  margin-bottom: 2rem;
`;

const AxisTitle = styled.h3`
  color: #2d3748;
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const AxisItem = styled.div`
  margin-bottom: 1.5rem;
  background: #f8f9fa;
  border-radius: 15px;
  padding: 1.5rem;
`;

const AxisLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const AxisName = styled.div`
  font-weight: 600;
  color: #2d3748;
  font-size: 1rem;
`;

const AxisResult = styled.div<{ isLeft: boolean }>`
  font-weight: 700;
  color: ${props => props.isLeft ? '#667eea' : '#764ba2'};
  font-size: 1.1rem;
`;

const AxisBar = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
`;

const AxisLeftLabel = styled.div`
  font-size: 0.9rem;
  color: #667eea;
  font-weight: 600;
  min-width: 60px;
  text-align: right;
`;

const AxisRightLabel = styled.div`
  font-size: 0.9rem;
  color: #764ba2;
  font-weight: 600;
  min-width: 60px;
  text-align: left;
`;

const AxisProgress = styled.div`
  flex: 1;
  height: 24px;
  background: linear-gradient(90deg, #667eea 0%, #e2e8f0 50%, #764ba2 100%);
  border-radius: 12px;
  position: relative;
  overflow: visible;
  border: 2px solid #f1f5f9;
`;

const AxisIndicator = styled(motion.div)<{ position: number }>`
  position: absolute;
  top: 50%;
  left: ${props => props.position}%;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 24px;
  background: white;
  border: 3px solid #2d3748;
  border-radius: 50%;
  z-index: 3;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 12px;
    height: 12px;
    background: ${props => props.position < 50 ? '#667eea' : '#764ba2'};
    border-radius: 50%;
  }
`;

const AxisDescription = styled.div`
  font-size: 0.85rem;
  color: #4a5568;
  line-height: 1.4;
  text-align: center;
`;

const CharacterSection = styled.div`
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 20%, #4facfe 40%, #00f2fe 100%);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  text-align: center;
  color: white;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    animation: float 6s ease-in-out infinite;
  }
  
  @keyframes float {
    0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
    50% { transform: translate(-50%, -50%) rotate(180deg); }
  }
`;

const CharacterContainer = styled.div`
  margin-bottom: 1rem;
  position: relative;
  z-index: 1;
`;

const CharacterName = styled.h2`
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  position: relative;
  z-index: 1;
`;

const CharacterPersonality = styled.p`
  font-size: 1.1rem;
  margin-bottom: 1rem;
  opacity: 0.9;
  position: relative;
  z-index: 1;
`;

const CelebrityMatch = styled.div`
  background: rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 1rem;
  margin: 1rem 0;
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 1;
`;

const FunFact = styled.div`
  background: rgba(255, 255, 255, 0.15);
  border-radius: 15px;
  padding: 1rem;
  font-size: 0.9rem;
  font-style: italic;
  margin-top: 1rem;
  position: relative;
  z-index: 1;
`;

const RegionalSection = styled.div`
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  color: white;
`;

const RegionalTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-align: center;
`;

const RegionalContent = styled.div`
  text-align: center;
`;

const NearbyList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.5rem;
  margin: 1rem 0;
`;

const NearbyItem = styled.div`
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Button = styled(motion.button)<{ variant?: 'primary' | 'secondary'; disabled?: boolean }>`
  background: ${props => {
    if (props.disabled) return 'linear-gradient(45deg, #adb5bd, #6c757d)';
    return props.variant === 'secondary' 
      ? 'linear-gradient(45deg, #6c757d, #495057)' 
      : 'linear-gradient(45deg, #28a745, #20c997)';
  }};
  color: white;
  border: none;
  border-radius: 50px;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.7 : 1};
  
  @media (max-width: 768px) {
    padding: 0.8rem 1.5rem;
    font-size: 0.9rem;
  }
`;

const AnalyticsSection = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
`;

const AnalyticsTitle = styled.h4`
  margin-bottom: 1rem;
  color: white;
`;

const AnalyticsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  text-align: center;
`;

const AnalyticsItem = styled.div`
  background: rgba(255, 255, 255, 0.2);
  padding: 1rem;
  border-radius: 10px;
`;

interface ResultScreenProps {
  typeCode: string;
  axisScores: AxisScore;
  onRestart: () => void;
  analytics: {
    totalTime: number;
    averageResponseTime: number;
    completionRate: number;
  };
  userRegion?: string;
}

const axisConfig = {
  A: {
    left: { label: 'Relaxing', korean: '휴식형', desc: '여유롭고 느긋한 여행을 선호' },
    right: { label: 'Active', korean: '활동형', desc: '에너지 넘치는 액티브한 여행을 선호' },
    name: '활동성향'
  },
  C: {
    left: { label: 'Nature', korean: '자연형', desc: '자연과 힐링을 중시하는 여행 스타일' },
    right: { label: 'Culture', korean: '문화형', desc: '도시와 문화 체험을 즐기는 여행 스타일' },
    name: '선호지역'
  },
  F: {
    left: { label: 'Experience', korean: '체험형', desc: '새로운 경험과 액티비티를 중시' },
    right: { label: 'Foodie', korean: '맛집형', desc: '맛집 탐방과 미식 경험을 중시' },
    name: '여행목적'
  },
  B: {
    left: { label: 'Budget', korean: '가성비형', desc: '합리적인 가격과 효율성을 추구' },
    right: { label: 'Luxury', korean: '프리미엄형', desc: '품질과 특별한 경험을 중시' },
    name: '예산성향'
  },
  K: {
    left: { label: 'Parent-led', korean: '부모주도형', desc: '부모가 계획하고 이끄는 여행' },
    right: { label: 'Kid-led', korean: '아이주도형', desc: '아이들의 의견을 우선하는 여행' },
    name: '주도권'
  }
};

const ResultScreen: React.FC<ResultScreenProps> = ({
  typeCode,
  axisScores,
  onRestart,
  analytics,
  userRegion
}) => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const resultCardRef = useRef<HTMLDivElement>(null);
  
  const travelType = travelTypes[typeCode] || {
    code: typeCode,
    title: '특별한 여행 스타일',
    description: '당신만의 독특한 여행 스타일을 가지고 있습니다!',
    recommendations: ['맞춤형 여행 계획을 세워보세요!']
  };

  const character = characters[typeCode] || {
    emoji: '🎭',
    name: '특별한 여행러',
    description: '독특한 매력을 가진 여행 스타일',
    personality: '개성있고 특별한 여행을 추구하는 스타일',
    celebrity: '나만의 스타일',
    funFact: '남들과는 다른 특별한 여행을 즐기는 개성파!'
  };

  const regionalInfo = userRegion ? regionalRecommendations[userRegion] : null;

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}분 ${seconds % 60}초`;
  };

  const downloadResult = async () => {
    if (!resultCardRef.current) return;
    
    setIsDownloading(true);
    try {
      // 스크롤을 맨 위로 이동
      window.scrollTo(0, 0);
      
      const canvas = await html2canvas(resultCardRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        logging: false,
        width: resultCardRef.current.scrollWidth,
        height: resultCardRef.current.scrollHeight
      });
      
      // 이미지 다운로드
      const link = document.createElement('a');
      link.download = `가족여행유형_${typeCode}_${new Date().getTime()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('이미지 생성 실패:', error);
      alert('이미지 다운로드에 실패했습니다.');
    } finally {
      setIsDownloading(false);
    }
  };

  const shareResult = () => {
    const text = `나의 가족여행 유형: ${typeCode}\n${travelType.title}`;
    if (navigator.share) {
      navigator.share({
        title: '가족여행 유형 테스트 결과',
        text: text,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(text);
      alert('결과가 복사되었습니다!');
    }
  };

  return (
    <Container>
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          gravity={0.3}
        />
      )}
      

      <ResultCard
        ref={resultCardRef}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <TypeCode>{typeCode}</TypeCode>
        <Title>{travelType.title}</Title>
        <Description>{travelType.description}</Description>

        <CharacterSection>
          <CharacterContainer>
            <CharacterAvatar typeCode={typeCode} />
          </CharacterContainer>
          <CharacterName>{character.name}</CharacterName>
          <CharacterPersonality>{character.personality}</CharacterPersonality>
          
          <CelebrityMatch>
            ⭐ 비슷한 연예인 가족: <strong>{character.celebrity}</strong>
          </CelebrityMatch>
          
          <FunFact>
            💡 {character.funFact}
          </FunFact>
        </CharacterSection>

        <AxisSection>
          <AxisTitle>📊 나의 여행 성향 분석</AxisTitle>
          {Object.entries(axisScores).map(([axisKey, score]) => {
            const axis = axisKey as keyof typeof axisConfig;
            const config = axisConfig[axis];
            const percentage = ((score - 3) / 12) * 100; // 3-15를 0-100%로 변환
            const position = Math.max(5, Math.min(95, percentage)); // 5-95% 범위로 제한
            const isRight = score >= 9;
            const resultType = isRight ? config.right : config.left;
            
            return (
              <AxisItem key={axis}>
                <AxisLabel>
                  <AxisName>{config.name}</AxisName>
                  <AxisResult isLeft={!isRight}>
                    {resultType.korean} ({score}/15)
                  </AxisResult>
                </AxisLabel>
                
                <AxisBar>
                  <AxisLeftLabel>{config.left.label}</AxisLeftLabel>
                  <AxisProgress>
                    <AxisIndicator
                      position={position}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
                    />
                  </AxisProgress>
                  <AxisRightLabel>{config.right.label}</AxisRightLabel>
                </AxisBar>
                
                <AxisDescription>
                  {resultType.desc}
                </AxisDescription>
              </AxisItem>
            );
          })}
        </AxisSection>

        {regionalInfo && (
          <RegionalSection>
            <RegionalTitle>🗺️ {regionalInfo.region} 지역 맞춤 여행지</RegionalTitle>
            <RegionalContent>
              <div style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
                <strong>🎯 {regionalInfo.signature}</strong>
              </div>
              <p style={{ marginBottom: '1rem', opacity: 0.9 }}>
                {regionalInfo.description}
              </p>
              <div style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
                주변 추천 여행지:
              </div>
              <NearbyList>
                {regionalInfo.nearbyDestinations.map((dest, index) => (
                  <NearbyItem key={index}>{dest}</NearbyItem>
                ))}
              </NearbyList>
            </RegionalContent>
          </RegionalSection>
        )}
        
        <RecommendationSection>
          <RecommendationTitle>🎯 추천 여행지</RecommendationTitle>
          <RecommendationList>
            {travelType.recommendations.map((rec, index) => (
              <RecommendationItem key={index}>
                🗺️ {rec}
              </RecommendationItem>
            ))}
          </RecommendationList>
        </RecommendationSection>
        
        <ButtonGroup>
          <Button
            onClick={downloadResult}
            disabled={isDownloading}
            whileHover={{ scale: isDownloading ? 1 : 1.05 }}
            whileTap={{ scale: isDownloading ? 1 : 0.95 }}
          >
            {isDownloading ? '⏳ 생성 중...' : '📸 이미지 다운로드'}
          </Button>
          <Button
            onClick={shareResult}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            📤 결과 공유하기
          </Button>
          <Button
            variant="secondary"
            onClick={onRestart}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🔄 다시 테스트하기
          </Button>
        </ButtonGroup>
      </ResultCard>
    </Container>
  );
};

export default ResultScreen;