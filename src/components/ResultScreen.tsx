import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import html2canvas from 'html2canvas';
import { AxisScore } from '../types';
import { travelTypes } from '../data/travelTypes';
import { characters } from '../data/characters';
import CharacterAvatar from './CharacterAvatar';
import { detailedAnalytics } from '../utils/detailedAnalytics';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  min-height: -webkit-fill-available;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); box-shadow: 0 8px 25px rgba(40, 167, 69, 0.4); }
    50% { transform: scale(1.02); box-shadow: 0 12px 35px rgba(40, 167, 69, 0.6); }
  }
  
  @media (max-width: 768px) {
    padding: 1rem 0.75rem;
    justify-content: flex-start;
    padding-top: 1.5rem;
  }
  
  @media (max-width: 375px) {
    padding: 0.75rem 0.5rem;
    padding-top: 1rem;
  }
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
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 15px;
    max-width: 100%;
    margin-bottom: 0.5rem;
  }
  
  @media (max-width: 375px) {
    padding: 1.25rem;
    border-radius: 12px;
  }
`;

const TypeCode = styled.div`
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  padding: 1.2rem 2.5rem;
  border-radius: 50px;
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 1.5rem;
  display: inline-block;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
    padding: 1rem 2rem;
  }
  
  @media (max-width: 375px) {
    font-size: 1.6rem;
    padding: 0.9rem 1.8rem;
  }
`;

const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: 800;
  line-height: 1.3;
  margin-bottom: 1rem;
  color: #2d3748;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    font-size: 1.7rem;
  }
  
  @media (max-width: 375px) {
    font-size: 1.5rem;
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
  font-weight: 800;
  color: ${props => props.isLeft ? '#667eea' : '#764ba2'};
  font-size: 1.2rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
  
  @media (max-width: 375px) {
    font-size: 1rem;
  }
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
  height: 28px;
  background: linear-gradient(90deg, #667eea 0%, #e2e8f0 50%, #764ba2 100%);
  border-radius: 14px;
  position: relative;
  overflow: visible;
  border: 2px solid #f1f5f9;
`;

const AxisIndicator = styled(motion.div)<{ position: number }>`
  position: absolute;
  top: -20px;
  left: ${props => props.position}%;
  transform: translateX(-50%);
  width: 6px;
  height: 48px;
  background: linear-gradient(to top, 
    ${props => props.position < 50 ? '#667eea' : '#764ba2'} 0%, 
    ${props => props.position < 50 ? '#4facfe' : '#f093fb'} 100%
  );
  border-radius: 3px 3px 0 0;
  z-index: 3;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.2);
  
  &::before {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 8px solid ${props => props.position < 50 ? '#667eea' : '#764ba2'};
  }
  
  /* 모바일에서 크기 조정 */
  @media (max-width: 768px) {
    width: 5px;
    height: 40px;
    top: -16px;
    
    &::before {
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-top: 6px solid ${props => props.position < 50 ? '#667eea' : '#764ba2'};
      bottom: -6px;
    }
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
  font-size: 2.2rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
  position: relative;
  z-index: 1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
  
  @media (max-width: 375px) {
    font-size: 1.6rem;
  }
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
  min-height: 50px;
  flex: 1;
  max-width: 200px;
  
  @media (max-width: 768px) {
    padding: 1rem 1.5rem;
    font-size: 0.95rem;
    min-height: 48px;
    max-width: none;
  }
  
  @media (max-width: 375px) {
    padding: 0.9rem 1.25rem;
    font-size: 0.9rem;
    min-height: 44px;
  }
`;

const SurveyPopupOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const SurveyPopup = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
  
  @media (max-width: 768px) {
    padding: 2rem;
    border-radius: 15px;
  }
`;

const PopupCloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    transform: rotate(90deg);
    color: #333;
  }
`;

const PopupTitle = styled.h2`
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: #2d3748;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 1.6rem;
  }
`;

const PopupContent = styled.div`
  text-align: center;
  color: #4a5568;
`;

const PopupDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const PopupBenefit = styled.div`
  background: linear-gradient(135deg, #fff5cc, #ffe4b3);
  border: 2px solid #ffa500;
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    padding: 1.2rem;
  }
`;

const PopupBenefitTitle = styled.h3`
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 0.5rem;
  font-weight: 700;
`;

const PopupBenefitText = styled.p`
  font-size: 1rem;
  color: #555;
  line-height: 1.5;
`;

const PopupButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const PopupButton = styled(motion.button)<{ primary?: boolean }>`
  background: ${props => props.primary 
    ? 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%)' 
    : '#f0f0f0'};
  color: ${props => props.primary ? 'white' : '#666'};
  border: none;
  border-radius: 50px;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ReturnMessage = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem 3rem;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  z-index: 2000;
  text-align: center;
  max-width: 400px;
  width: 90%;
  
  @media (max-width: 768px) {
    padding: 1.5rem 2rem;
  }
`;

const ReturnMessageTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const ReturnMessageText = styled.p`
  font-size: 1.1rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const LoadingDots = styled.span`
  &::after {
    content: '';
    animation: dots 1.5s steps(3, end) infinite;
  }
  
  @keyframes dots {
    0%, 20% { content: '.'; }
    40% { content: '..'; }
    60%, 100% { content: '...'; }
  }
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
  isSharedView?: boolean;
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
  }
};

const ResultScreen: React.FC<ResultScreenProps> = ({
  typeCode,
  axisScores,
  onRestart,
  analytics,
  userRegion,
  isSharedView = false
}) => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showSurveyPopup, setShowSurveyPopup] = useState(false);
  const [hasShownPopup, setHasShownPopup] = useState(false);
  const [hasSharedToKakao, setHasSharedToKakao] = useState(false);
  const [showReturnMessage, setShowReturnMessage] = useState(false);
  const resultCardRef = useRef<HTMLDivElement>(null);
  const captureAreaRef = useRef<HTMLDivElement>(null);
  const kakaoShareTimeRef = useRef<number>(0);
  
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


  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  // 스크롤 이벤트 감지하여 서베이 팝업 표시
  useEffect(() => {
    const handleScroll = () => {
      if (hasShownPopup) return;
      
      const scrollPercentage = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100;
      
      // 50% 이상 스크롤했을 때 팝업 표시
      if (scrollPercentage > 50) {
        setShowSurveyPopup(true);
        setHasShownPopup(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasShownPopup]);

  // 카카오톡 공유 후 돌아왔을 때 감지 및 자동 팝업
  useEffect(() => {
    if (!hasSharedToKakao) return;

    let returnCheckTimer: NodeJS.Timeout;
    let autoPopupTimer: NodeJS.Timeout;
    
    // 페이지가 다시 활성화되었을 때 (카카오톡에서 돌아왔을 때)
    const handlePageReturn = () => {
      const now = Date.now();
      const timeSinceShare = now - kakaoShareTimeRef.current;
      
      // 카카오톡 공유 후 2초 이상 지났고, 30초 이내라면 돌아온 것으로 판단
      if (timeSinceShare > 2000 && timeSinceShare < 30000) {
        console.log('카카오톡에서 돌아옴 감지');
        
        // 환영 메시지 표시
        setShowReturnMessage(true);
        
        // 3초 후 환영 메시지 숨기고 서베이 팝업 표시
        autoPopupTimer = setTimeout(() => {
          setShowReturnMessage(false);
          if (!hasShownPopup) {
            setShowSurveyPopup(true);
            setHasShownPopup(true);
            detailedAnalytics.trackCustomEvent('auto_survey_popup_after_kakao', {
              triggerType: 'kakao_return',
              timeAfterShare: timeSinceShare
            });
          }
        }, 3000);
      }
    };

    // Page Visibility API
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        handlePageReturn();
      }
    };

    // Window Focus 이벤트
    const handleFocus = () => {
      handlePageReturn();
    };

    // 이벤트 리스너 등록
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    // 모바일 브라우저 대응 - pageshow 이벤트
    const handlePageShow = (event: PageTransitionEvent) => {
      if (!event.persisted) {
        handlePageReturn();
      }
    };
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('pageshow', handlePageShow);
      if (returnCheckTimer) clearTimeout(returnCheckTimer);
      if (autoPopupTimer) clearTimeout(autoPopupTimer);
    };
  }, [hasSharedToKakao, hasShownPopup]);


  const downloadResult = async () => {
    if (!captureAreaRef.current) return;
    
    setIsDownloading(true);
    
    // 카카오톡 공유 시작 시점 기록
    setHasSharedToKakao(true);
    kakaoShareTimeRef.current = Date.now();
    
    try {
      // 스크롤을 맨 위로 이동
      window.scrollTo(0, 0);
      
      const canvas = await html2canvas(captureAreaRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        logging: false,
        width: captureAreaRef.current.scrollWidth,
        height: captureAreaRef.current.scrollHeight
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
        <div ref={captureAreaRef}>
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
            
            <CelebrityMatch>
              {character.specialItem && `🎒 필수 아이템: ${character.specialItem}`}
            </CelebrityMatch>
            
            <CelebrityMatch>
              {character.trait && `✨ 특징: ${character.trait}`}
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
              // 실제 점수 범위 기준으로 위치 계산
              const minScore = axis === 'A' ? 4 : 3; // 최소 점수
              const maxScore = axis === 'A' ? 20 : 15; // 최대 점수
              const midScore = axis === 'A' ? 12 : 9; // 중간 점수 (기준점)
              const normalizedScore = (score - minScore) / (maxScore - minScore); // 0~1 사이 값
              const enhancedPosition = normalizedScore < 0.5 
                ? normalizedScore * 0.8 * 100 + 10  // 왼쪽: 10~50% 범위
                : (normalizedScore - 0.5) * 0.8 * 100 + 50; // 오른쪽: 50~90% 범위
              const position = Math.max(10, Math.min(90, enhancedPosition));
              const isRight = score >= midScore; // 중간 점수 이상
              const resultType = isRight ? config.right : config.left;
              
              return (
                <AxisItem key={axis}>
                  <AxisLabel>
                    <AxisName>{config.name}</AxisName>
                    <AxisResult isLeft={!isRight}>
                      {resultType.korean} ({Math.round(((score - (axis === 'A' ? 4 : 3)) / (axis === 'A' ? 16 : 12)) * 10)}/10)
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
        </div>

        
        <ButtonGroup>
          <Button
            variant="primary"
            onClick={isSharedView ? onRestart : downloadResult}
            disabled={!isSharedView && isDownloading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isSharedView ? '🚀 나도 테스트하기' : (isDownloading ? '⏳ 생성 중...' : '📸 이미지 저장하기')}
          </Button>
          {!isSharedView && (
            <Button
              variant="secondary"
              onClick={onRestart}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🔄 다시 테스트하기
            </Button>
          )}
        </ButtonGroup>

        {/* 맞춤 여행 계획 제작 후킹 섹션 */}
        <RecommendationSection style={{ 
          background: 'linear-gradient(135deg, #667eea, #764ba2)', 
          marginTop: '2rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-20%',
            width: '100px',
            height: '100px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            animation: 'float 3s ease-in-out infinite'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-30%',
            left: '-10%',
            width: '80px',
            height: '80px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '50%',
            animation: 'float 4s ease-in-out infinite reverse'
          }} />
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <RecommendationTitle style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1.5rem' }}>
              💔 이대로 떠나시면... 정말 괜찮으신가요?
            </RecommendationTitle>
            
            <div style={{ 
              textAlign: 'center', 
              color: 'white',
              marginBottom: '2rem'
            }}>
              <div style={{ 
                fontSize: '1.3rem', 
                fontWeight: 'bold', 
                marginBottom: '1rem',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>
                "엄마, 우리 언제 또 여행가?"<br/>
                <span style={{ fontSize: '1.1rem', color: '#fff3cd', fontWeight: 'normal' }}>
                  아이의 이 한마디에 가슴이 뭉클하셨나요?
                </span>
              </div>
              
              <div style={{ 
                fontSize: '1rem', 
                lineHeight: '1.6', 
                marginBottom: '1.5rem',
                opacity: '0.95'
              }}>
                매번 계획만 세우다 흐지부지되는 가족여행...<br/>
                <strong>이번만큼은 다르게 만들어드릴게요!</strong>
              </div>
              
              <div style={{
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '15px',
                padding: '1.5rem',
                marginBottom: '2rem',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}>
                <div style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: '700' }}>
                  🎁 [NeStory] 스트레스 제로! 국내 가족여행 완벽 준비 템플릿
                </div>
                <div style={{ fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                  <strong>"가족여행, 이제 스트레스 받지 말고!"</strong><br/>
                  계획부터 준비까지 모든 것을<br/>
                  <span style={{ color: '#fff3cd' }}>한 번에 해결하는 완벽한 템플릿</span>
                </div>
                <div style={{ 
                  fontSize: '0.85rem', 
                  lineHeight: '1.5', 
                  opacity: '0.9', 
                  textAlign: 'center',
                  display: 'inline-block',
                  margin: '0 auto'
                }}>
                  <div style={{ textAlign: 'left', display: 'inline-block' }}>
                    ✓ 가족 여행 계획 단계별 가이드<br/>
                    ✓ 스트레스 없는 여행 준비 체크리스트<br/>
                    ✓ 연령별 맞춤 준비물 리스트<br/>
                    ✓ 가족 모두가 만족하는 여행 팁
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <Button
                style={{ 
                  background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
                  fontSize: '1rem',
                  fontWeight: '700',
                  padding: '1rem 2rem',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                  border: '2px solid #28a745',
                  borderRadius: '12px',
                  color: '#28a745',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onClick={() => {
                  const sessionInfo = detailedAnalytics.getSessionInfo();
                  const surveyUrl = process.env.REACT_APP_SURVEY_URL || 'https://survey.nestory.co.kr';
                  const urlWithParams = `${surveyUrl}?landing_session=${sessionInfo.sessionId}&ref=landing_result`;
                  window.open(urlWithParams, '_blank');
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#28a745';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(40, 167, 69, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)';
                  e.currentTarget.style.color = '#28a745';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                }}
              >
                <span>📋</span>
                <span style={{ fontWeight: '600' }}>템플릿 받기</span>
                <span>→</span>
              </Button>
            </div>
          </div>
        </RecommendationSection>

        <ButtonGroup style={{ marginTop: '1rem' }}>
          <Button
            variant="secondary"
            onClick={() => window.location.href = '/all-types'}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🎭 8가지 유형 모두 보기
          </Button>
        </ButtonGroup>
      </ResultCard>

      {/* 카카오톡에서 돌아온 환영 메시지 */}
      {showReturnMessage && (
        <ReturnMessage
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <ReturnMessageTitle>
            🎉 다시 오신 것을 환영해요!
          </ReturnMessageTitle>
          <ReturnMessageText>
            공유해주셔서 감사합니다!<br/>
            잠시 후 특별한 혜택을 준비했어요
            <LoadingDots />
          </ReturnMessageText>
        </ReturnMessage>
      )}

      {/* 서베이 유도 팝업 */}
      {showSurveyPopup && (
        <SurveyPopupOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowSurveyPopup(false)}
        >
          <SurveyPopup
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <PopupCloseButton onClick={() => setShowSurveyPopup(false)}>
              ✕
            </PopupCloseButton>
            
            <PopupTitle>
              🎁 잠깐! 특별한 혜택이 기다려요
            </PopupTitle>
            
            <PopupContent>
              <PopupDescription>
                <strong>{character.name}</strong> 유형이신 당신께<br/>
                더 깊이 있는 여행 인사이트를 드려요!
              </PopupDescription>
              
              <PopupBenefit>
                <PopupBenefitTitle>
                  🎯 심층 분석 설문 참여 시
                </PopupBenefitTitle>
                <PopupBenefitText>
                  • 맞춤형 여행 코스 추천<br/>
                  • 예산별 최적 플랜<br/>
                  • 숨은 여행지 정보<br/>
                  • <strong>2025 충청·전라 비밀지도</strong> 무료 제공!
                </PopupBenefitText>
              </PopupBenefit>
              
              <PopupButtonGroup>
                <PopupButton
                  primary
                  onClick={() => {
                    const sessionInfo = detailedAnalytics.getSessionInfo();
                    const surveyUrl = process.env.REACT_APP_SURVEY_URL || 'https://survey.nestory.co.kr';
                    const urlWithParams = `${surveyUrl}?landing_session=${sessionInfo.sessionId}&ref=landing_popup`;
                    window.open(urlWithParams, '_blank');
                    setShowSurveyPopup(false);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  심층 분석 받기 (3-4분)
                </PopupButton>
                <PopupButton
                  onClick={() => setShowSurveyPopup(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  다음에 할게요
                </PopupButton>
              </PopupButtonGroup>
            </PopupContent>
          </SurveyPopup>
        </SurveyPopupOverlay>
      )}
    </Container>
  );
};

export default ResultScreen;