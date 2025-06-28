import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import RealtimeStats from './RealtimeStats';
import UrgencyTimer from './UrgencyTimer';
import LiveParticipants from './LiveParticipants';
import TrustBadges from './TrustBadges';
import ExitIntentPopup from './ExitIntentPopup';
import MicroCommitment from './MicroCommitment';
import DebugPanel from './DebugPanel';
import { SupabaseService } from '../services/supabase';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [showMicroCommitment, setShowMicroCommitment] = useState(false);

  React.useEffect(() => {
    const visitId = Date.now().toString();
    const sessionId = `landing-${visitId}`;
    sessionStorage.setItem('visitId', visitId);
    
    // 랜딩 페이지 방문 데이터 수집
    const visit: any = {
      id: visitId,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      deviceType: getDeviceType()
    };

    // Supabase에 방문 데이터 저장
    SupabaseService.saveLandingAnalytics({
      visitId,
      timestamp: visit.timestamp,
      userAgent: visit.userAgent,
      referrer: visit.referrer,
      deviceType: visit.deviceType
    });

    // 실시간 활성 사용자 추적 - 이 기능은 현재 SupabaseService에 없으므로 제거합니다
    // 필요시 별도 구현 필요

    // 스크롤 깊이 추적
    let maxScrollDepth = 0;
    const trackScrollDepth = () => {
      const scrollPercentage = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100;
      maxScrollDepth = Math.max(maxScrollDepth, scrollPercentage);
    };
    window.addEventListener('scroll', trackScrollDepth);

    // 페이지 이탈 시 데이터 업데이트
    const startTime = Date.now();
    const handleBeforeUnload = () => {
      const sessionDuration = (Date.now() - startTime) / 1000;
      if (sessionDuration > 1) {
        SupabaseService.saveLandingAnalytics({
          visitId,
          timestamp: visit.timestamp,
          userAgent: visit.userAgent,
          referrer: visit.referrer,
          deviceType: visit.deviceType,
          sessionDuration,
          scrollDepth: maxScrollDepth
        });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    // Exit intent 감지
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !sessionStorage.getItem('exitIntentShown')) {
        setShowExitIntent(true);
        sessionStorage.setItem('exitIntentShown', 'true');
      }
    };
    
    // 페이지 진입 후 30초 후 마이크로 커밋먼트 표시
    const microCommitmentTimer = setTimeout(() => {
      if (!sessionStorage.getItem('microCommitmentShown')) {
        setShowMicroCommitment(true);
        sessionStorage.setItem('microCommitmentShown', 'true');
      }
    }, 30000);
    
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('scroll', trackScrollDepth);
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(microCommitmentTimer);
    };
  }, []);

  const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
    const width = window.innerWidth;
    if (width <= 768) return 'mobile';
    if (width <= 1024) return 'tablet';
    return 'desktop';
  };

  const handleStartTest = () => {
    // CTA 클릭 이벤트 기록
    const visitId = sessionStorage.getItem('visitId') || Date.now().toString();
    SupabaseService.saveLandingAnalytics({
      visitId,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      deviceType: getDeviceType(),
      ctaClicked: true
    });

    // 스크롤로 다음 섹션으로 이동
    const storySection = document.querySelector('[data-section="story"]');
    if (storySection) {
      storySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFinalStartTest = () => {
    navigate('/landing');
  };

  const handleExitIntentAccept = () => {
    setShowExitIntent(false);
    // 마이크로 커밋먼트 바로 표시
    setShowMicroCommitment(true);
  };

  const handleMicroCommitmentComplete = () => {
    setShowMicroCommitment(false);
    // 실제 테스트로 이동
    navigate('/landing');
  };

  const handleSurveyRedirect = (preAnswers: string[]) => {
    setShowMicroCommitment(false);
    
    // 세션 정보 준비
    const sessionId = Date.now().toString();
    const deviceType = window.innerWidth <= 768 ? 'mobile' : 'desktop';
    
    // 외부 설문으로 리다이렉트
    const params = new URLSearchParams({
      source: 'family-travel-landing',
      sessionId,
      device: deviceType,
      timestamp: Date.now().toString(),
      preAnswers: JSON.stringify(preAnswers)
    });
    
    // 새 창이 아닌 같은 창에서 전환 (뒤로가기 가능)
    window.location.href = `https://nestory-survey.vercel.app?${params}`;
  };

  return (
    <LandingContainer>
      {/* 긴급성 타이머 */}
      <UrgencyTimer />
      
      {/* 실시간 참여자 위젯 */}
      <LiveParticipants />
      
      <VideoBackground autoPlay muted loop playsInline>
        <source src="/video/family-travel.mp4" type="video/mp4" />
      </VideoBackground>
      
      {/* 실시간 통계 위젯 */}
      <RealtimeStats show={true} />
      
      <ContentOverlay>
        {/* Hero Section */}
        <HeroSection>
          <HeroContent>
            <MainHeadline>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <EmotionalHook>"엄마... 이번 여행은 정말 재밌었어"</EmotionalHook>
                <MainTitle>
                  아이가 이렇게 말하는<br />
                  <HighlightText>마법 같은 순간</HighlightText><br />
                  우리 가족도 만들 수 있어요
                </MainTitle>
                <SubText>23,847가족이 이미 경험한 특별함을 2분에 발견하세요</SubText>
              </motion.div>
            </MainHeadline>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <EmotionalBenefits>
                <BenefitItem>
                  <BenefitEmoji>💖</BenefitEmoji>
                  <BenefitText>"아이들이 싸우지 않는 여행"</BenefitText>
                </BenefitItem>
                <BenefitItem>
                  <BenefitEmoji>😊</BenefitEmoji>
                  <BenefitText>"어른도 아이도 모두 만족"</BenefitText>
                </BenefitItem>
                <BenefitItem>
                  <BenefitEmoji>✨</BenefitEmoji>
                  <BenefitText>"평생 기억에 남을 추억"</BenefitText>
                </BenefitItem>
              </EmotionalBenefits>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <CTAButtonGroup>
                <PrimaryCTAButton onClick={handleStartTest}>
                  <ButtonText>우리 가족 행복 여행 만들기</ButtonText>
                  <ButtonSubtext>2분이면 평생 추억이 바뀝니다</ButtonSubtext>
                </PrimaryCTAButton>
                <TrustIndicators>
                  <TrustItem>💕 23,847가족이 선택한 이유</TrustItem>
                  <TrustItem>🎯 "진짜 우리 가족 같아요!"</TrustItem>
                </TrustIndicators>
                
                {/* 신뢰성 배지 */}
                <TrustBadges />
              </CTAButtonGroup>
            </motion.div>
            
            <ScrollHint>
              <ScrollText>😱 실제 후기가 더 궁금하다면?</ScrollText>
              <ScrollIcon>👇👇👇</ScrollIcon>
              <PulsatingScrollText>아래로 스크롤하세요!</PulsatingScrollText>
              <ScrollArrow />
            </ScrollHint>
          </HeroContent>
        </HeroSection>

        {/* Story Section */}
        <StorySection data-section="story">
          <StoryContent>
            <HookingBadge>
              🚨 실제 카톡 대화 캡쳐
            </HookingBadge>
            <SectionTitle>
              💕 "우리 가족이 이렇게 행복할 수 있구나"
            </SectionTitle>
            <EmotionalStory>
              <StoryQuote>"처음으로 온 가족이 만족한 여행이었어요. 시어머니는 편하다고 하시고, 남편은 스트레스 안 받는다고 하고, 아이들은 또 가고 싶다고... 이런 기적 같은 일이 정말 가능하구나 싶었어요."</StoryQuote>
              <StoryAuthor>- 실제 사용자 김○○님의 눈물 후기</StoryAuthor>
            </EmotionalStory>

            <StoryText>
              <strong>👩‍👧‍👦 김○○님 (7살, 4살 엄마):</strong><br />
              "와.. 진짜 우리 가족 똑같이 나왔어😱 4살이 좋아할만한 곳이랑 7살이 재밌어할 곳 딱 나누어서 추천해주는데... 어떻게 알지?"
            </StoryText>

            <StoryText>
              <strong>👨‍👩‍👧 박○○님 (5살 딸 가족):</strong><br />
              "헐 우리 딸 완전 활동형이라고 나왔는데 정말 맞아ㅋㅋ 추천해준 체험농장 갔는데 딸이 하루종일 뛰어놀더라구요!"
            </StoryText>

            <StoryText>
              <strong>🔥 15,237가족이 인정한 정확도!</strong><br />
              이제 <BrandText>NeStoryTI</BrandText>로 2분만에 우리 가족 여행 성향을 알아보세요!<br />
              <em>"어디 갈까?" 고민은 이제 끝! 🎯</em>
            </StoryText>

            <ComparisonGrid>
              <ComparisonCard>
                <ComparisonTitle>😫 이전에는</ComparisonTitle>
                <ComparisonList>
                  <li>"어디 갈지 모르겠어..."</li>
                  <li>"아이들이 또 싸울 것 같은데"</li>
                  <li>"예산은 얼마나 잡지?"</li>
                </ComparisonList>
              </ComparisonCard>
              <ComparisonCard success>
                <ComparisonTitle>😊 이제는</ComparisonTitle>
                <ComparisonList>
                  <li>"우리 성향에 딱이네!"</li>
                  <li>"가족 모두 만족한 여행"</li>
                  <li>"계획 세우기가 이렇게 쉬울 줄이야"</li>
                </ComparisonList>
              </ComparisonCard>
            </ComparisonGrid>

            <CenteredButtonContainer>
              <CTAButton secondary onClick={() => {
                const featuresSection = document.querySelector('[data-section="features"]');
                if (featuresSection) {
                  featuresSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}>
                더 자세히 알아보기 →
              </CTAButton>
            </CenteredButtonContainer>
            
            <MobileScrollHint>
              <MobileScrollText>👆 아직도 더 있어요! 👆</MobileScrollText>
              <MobileScrollSubtext>밑으로 계속 스크롤하세요</MobileScrollSubtext>
            </MobileScrollHint>
          </StoryContent>
        </StorySection>

        {/* Features Section */}
        <FeaturesSection data-section="features">
          <CuriosityHook>
            😲 "진짜 2분만에 이런 게 가능해?"
          </CuriosityHook>
          <SectionTitle>✨ 2분 테스트로 이런 걸 알 수 있어요!</SectionTitle>
          <FeatureGrid>
            <FeatureCard>
              <FeatureIcon>🎯</FeatureIcon>
              <FeatureTitle>우리 가족 여행 성향</FeatureTitle>
              <FeatureDescription>
                활동적인 가족? 힐링 추구형? 8가지 유형 중 우리 가족이 어떤 스타일인지 정확히 분석해드려요
              </FeatureDescription>
            </FeatureCard>
            <FeatureCard>
              <FeatureIcon>🗺️</FeatureIcon>
              <FeatureTitle>맞춤 여행지 추천</FeatureTitle>
              <FeatureDescription>
                "우리 동네에서 갈 만한 곳이 있을까?" 걱정 끝! 거주지역 기반으로 딱 맞는 여행지를 추천해드려요
              </FeatureDescription>
            </FeatureCard>
            <FeatureCard>
              <FeatureIcon>💝</FeatureIcon>
              <FeatureTitle>가족 모두 만족하는 플랜</FeatureTitle>
              <FeatureDescription>
                아이는 재미있고, 어른은 편안하고, 할머니·할아버지도 무리하지 않는 완벽한 여행 코스를 제안해드려요
              </FeatureDescription>
            </FeatureCard>
          </FeatureGrid>
          
          <MobileScrollHint>
            <MobileScrollText>🎉 후기도 보시고 테스트도 해보세요! 🎉</MobileScrollText>
            <MobileScrollSubtext>밑으로 더 스크롤하세요</MobileScrollSubtext>
          </MobileScrollHint>
        </FeaturesSection>

        {/* Social Proof */}
        <TestimonialSection>
          <TrustBadge>
            🔥 실제 사용자 15,237명이 증명!
          </TrustBadge>
          <SectionTitle>💬 "헐 진짜 신기해" - 실제 후기 모음</SectionTitle>
          <TestimonialGrid>
            <TestimonialCard>
              <TestimonialText>
                "와... 진짜 우리 가족 성향이 딱 맞네요! 7살 딸이 신나하고 시어머니도 편하다고 하시니 
                제가 제일 기뻤어요. 드디어 가족여행 스트레스에서 해방됐습니다! 😭"
              </TestimonialText>
              <TestimonialAuthor>- 김○○님 (서울 강남구, 워킹맘)</TestimonialAuthor>
            </TestimonialCard>
            <TestimonialCard>
              <TestimonialText>
                "매번 '어디 갈까' 고민하느라 주말이 다 지나갔는데... 
                이제는 테스트 결과 보고 바로 결정해요. 아이들도 '엄마 센스 좋다'고 인정! 👍"
              </TestimonialText>
              <TestimonialAuthor>- 이○○님 (부산 해운대구, 두 아이 엄마)</TestimonialAuthor>
            </TestimonialCard>
          </TestimonialGrid>
        </TestimonialSection>

        {/* Final CTA */}
        <FinalCTASection>
          <UrgencyBadge>
            ⚡ 15,237번째 가족이 되어보세요!
          </UrgencyBadge>
          <FinalCTATitle>🎉 "우리 가족은 어떤 타입일까?" 궁금하죠?</FinalCTATitle>
          <FinalCTASubtitle>
            더 이상 "어디 갈까?" 고민하지 마세요! <br />
            2분 후면 우리 가족 맞춤 여행지를 알 수 있습니다 ✈️
          </FinalCTASubtitle>
          <CTAButton large onClick={handleFinalStartTest}>
            🚀 지금 바로 우리 가족 타입 확인하기!
          </CTAButton>
          <FinalCTASubInfo>
            💯 완전 무료 | 📱 간편 테스트 | 🎯 즉시 결과 확인
          </FinalCTASubInfo>
        </FinalCTASection>
      </ContentOverlay>
      
      {/* 마이크로 커밋먼트 컴포넌트 */}
      {showMicroCommitment && (
        <MicroCommitment 
          onComplete={handleMicroCommitmentComplete}
          onSurveyRedirect={handleSurveyRedirect}
        />
      )}
      
      {/* Exit Intent 팝업 */}
      {showExitIntent && (
        <ExitIntentPopup 
          onAccept={handleExitIntentAccept}
          onClose={() => setShowExitIntent(false)}
        />
      )}
      
      {/* 개발 환경 디버그 패널 */}
      <DebugPanel />
    </LandingContainer>
  );
};

// Styled Components
const LandingContainer = styled.div`
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
  
  /* 배경 애니메이션 효과 */
  &::before {
    content: '';
    position: fixed;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
    background-size: 50px 50px;
    animation: sparkle 20s linear infinite;
    pointer-events: none;
    z-index: 1;
  }
  
  @keyframes sparkle {
    0% { transform: translate(0, 0) rotate(0deg); }
    100% { transform: translate(-50px, -50px) rotate(360deg); }
  }
`;

const VideoBackground = styled.video`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.25;
  z-index: -1;
`;

const ContentOverlay = styled.div`
  position: relative;
  z-index: 2;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 50%, rgba(241, 245, 249, 0.98) 100%);
  color: #1a202c;
  
`;

const HeroSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 6rem 1rem;
  min-height: 100vh;
  justify-content: center;
  position: relative;
  z-index: 3;
  
  @media (max-width: 768px) {
    padding: 4rem 1rem;
    padding-top: 5rem; /* UrgencyTimer 공간 확보 */
  }
  
  @media (max-width: 480px) {
    padding: 3rem 0.8rem;
    padding-top: 4.5rem;
  }
  
  @media (max-width: 375px) {
    padding: 2.5rem 0.6rem;
    padding-top: 4rem;
  }
  
  /* 히어로 글로우 효과 */
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(251, 191, 36, 0.3) 0%, transparent 70%);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: pulse 3s ease-in-out infinite;
    z-index: -1;
  }
  
  @keyframes pulse {
    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.7; }
    50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.3; }
  }
`;

const HeroContent = styled.div`
  max-width: 36rem;
  width: 100%;
`;

const MainHeadline = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  line-height: 1.2;
  animation: slideInUp 1s ease-out;
  color: #2d3748;

  .desktop-only {
    @media (max-width: 768px) {
      display: none;
    }
  }

  .mobile-inline {
    @media (max-width: 768px) {
      display: inline;
    }
  }

  @media (max-width: 768px) {
    font-size: 2.2rem;
    line-height: 1.3;
    margin-bottom: 1.2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.9rem;
    line-height: 1.4;
    margin-bottom: 1rem;
  }
  
  @media (max-width: 375px) {
    font-size: 1.7rem;
    line-height: 1.4;
    margin-bottom: 0.8rem;
  }
  
  @keyframes slideInUp {
    0% { transform: translateY(50px); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
  }
`;

const EmotionalHook = styled.div`
  font-size: 1.8rem;
  color: #7c3aed;
  font-weight: 700;
  margin-bottom: 1.5rem;
  font-style: italic;
  text-align: center;
  opacity: 0.95;
  
  @media (max-width: 768px) {
    font-size: 1.4rem;
    margin-bottom: 1.2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }
  
  @media (max-width: 375px) {
    font-size: 1.1rem;
    margin-bottom: 0.8rem;
  }
`;

const HighlightText = styled.span`
  background: linear-gradient(135deg, #ff6b6b, #ffa500);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 900;
`;

const EmotionalBenefits = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    gap: 0.8rem;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 480px) {
    gap: 0.6rem;
    margin-bottom: 1.2rem;
  }
  
  @media (max-width: 375px) {
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
`;

const BenefitItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem 1.5rem;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateX(10px);
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }
  
  @media (max-width: 768px) {
    padding: 0.8rem 1.2rem;
    gap: 0.8rem;
    border-radius: 12px;
    
    &:hover {
      transform: translateX(5px);
    }
  }
  
  @media (max-width: 480px) {
    padding: 0.7rem 1rem;
    gap: 0.6rem;
    border-radius: 10px;
  }
  
  @media (max-width: 375px) {
    padding: 0.6rem 0.8rem;
    gap: 0.5rem;
    border-radius: 8px;
  }
`;

const BenefitEmoji = styled.div`
  font-size: 3.5rem;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.3) rotate(-5deg);
  }
  
  @media (max-width: 768px) {
    font-size: 2.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2.3rem;
  }
  
  @media (max-width: 375px) {
    font-size: 2rem;
  }
`;

const BenefitText = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
  
  @media (max-width: 375px) {
    font-size: 0.85rem;
  }
`;

const EmotionalStory = styled.div`
  background: linear-gradient(135deg, #fff5f5, #fed7d7);
  padding: 2rem;
  border-radius: 20px;
  margin: 2rem 0;
  border-left: 5px solid #ff6b6b;
  box-shadow: 0 10px 30px rgba(255, 107, 107, 0.1);
`;

const StoryQuote = styled.div`
  font-size: 1.2rem;
  line-height: 1.7;
  color: #2d3748;
  font-style: italic;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    line-height: 1.6;
  }
`;

const StoryAuthor = styled.div`
  font-size: 0.9rem;
  color: #7c3aed;
  font-weight: 600;
  text-align: right;
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`;

const CTAButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
`;

const PrimaryCTAButton = styled.button`
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
  color: white;
  border: none;
  padding: 1.5rem 3rem;
  border-radius: 20px;
  font-weight: 800;
  font-size: 1.3rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 15px 40px rgba(255, 107, 107, 0.4);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s;
  }
  
  &:hover::before {
    left: 100%;
  }
  
  &:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 25px 60px rgba(255, 107, 107, 0.5);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    max-width: 400px;
    font-size: 1.2rem;
    padding: 1.3rem 2rem;
  }
`;

const ButtonText = styled.div`
  display: block;
  margin-bottom: 0.5rem;
`;

const ButtonSubtext = styled.div`
  font-size: 0.85rem;
  opacity: 0.9;
  font-weight: 600;
`;

const TrustIndicators = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.8rem;
    align-items: center;
  }
`;

const TrustItem = styled.div`
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.4rem 0.8rem;
  }
`;

const MainTitle = styled.h1`
  font-size: 3.2rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  color: #2d3748;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 2.5rem;
    line-height: 1.3;
  }
  
  @media (max-width: 480px) {
    font-size: 2.2rem;
    line-height: 1.4;
  }
`;

const SubText = styled.p`
  font-size: 1.3rem;
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 3rem;
  text-align: center;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    font-size: 1.2rem;
    margin-bottom: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

const CenteredButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 2rem 0;
  text-align: center;
`;

const FinalCTASubInfo = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
  margin-top: 1rem;
  color: white;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const PulsatingScrollText = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: #ff6b6b;
  animation: pulse 2s infinite;
  margin-top: 0.5rem;
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.7;
      transform: scale(1.05);
    }
  }
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const MobileScrollHint = styled.div`
  display: block;
  text-align: center;
  margin: 3rem 0 2rem 0;
  padding: 1.5rem;
  background: linear-gradient(135deg, #ff6b6b, #ff8e53);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(255, 107, 107, 0.3);
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileScrollText = styled.div`
  font-size: 1.4rem;
  font-weight: 800;
  color: white;
  margin-bottom: 0.5rem;
  animation: bounce 2s infinite;
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }
`;

const MobileScrollSubtext = styled.div`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
`;


const CTAButton = styled.button<{ secondary?: boolean; large?: boolean }>`
  background: ${props => props.secondary 
    ? 'linear-gradient(45deg, #4299e1, #3182ce)' 
    : 'linear-gradient(45deg, #e53e3e, #c53030)'};
  color: white;
  padding: ${props => props.large ? '1.2rem 2.5rem' : '1rem 2rem'};
  border-radius: 12px;
  border: none;
  font-weight: 700;
  font-size: ${props => props.large ? '1.3rem' : '1.1rem'};
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  text-shadow: none;
  
  @media (max-width: 768px) {
    padding: ${props => props.large ? '1.2rem 2.5rem' : '1rem 2rem'};
    font-size: ${props => props.large ? '1.4rem' : '1.2rem'};
  }
  
  @media (max-width: 480px) {
    padding: ${props => props.large ? '1.1rem 2.2rem' : '0.9rem 1.8rem'};
    font-size: ${props => props.large ? '1.3rem' : '1.1rem'};
  }
  
  &:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
    filter: brightness(1.1);
  }

  ${props => !props.secondary && `
    animation: bounce 2s infinite, slideInUp 1s ease-out 0.6s both;
  `}
  
  ${props => props.secondary && `
    animation: slideInUp 1s ease-out 0.9s both;
  `}

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-4px);
    }
    60% {
      transform: translateY(-2px);
    }
  }
`;

const StorySection = styled.section`
  padding: 4rem 1rem;
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  
  @media (max-width: 768px) {
    padding: 3rem 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 2.5rem 1rem;
  }
`;

const StoryContent = styled.div`
  max-width: 48rem;
  margin: 0 auto;
  text-align: center;
  padding: 0 1rem;
  
  @media (max-width: 768px) {
    padding: 0 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 0 1rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
  color: #2d3748;

  @media (max-width: 768px) {
    font-size: 1.8rem;
    line-height: 1.3;
  }
  
  @media (max-width: 480px) {
    font-size: 1.6rem;
    line-height: 1.4;
  }
`;

const BrandText = styled.span`
  color: #e53e3e;
  font-weight: 800;
  text-shadow: none;
`;

const StoryText = styled.p`
  font-size: 1.1rem;
  line-height: 1.7;
  margin-bottom: 2rem;
  text-align: left;
  color: #4a5568;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    text-align: center;
    line-height: 1.6;
    
    br {
      display: none;
    }
  }
  
  @media (max-width: 480px) {
    font-size: 1.05rem;
    line-height: 1.5;
  }
`;

const ComparisonGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin: 2rem 0;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ComparisonCard = styled.div<{ success?: boolean }>`
  background: ${props => props.success ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.15)'};
  border: 1px solid ${props => props.success ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255, 255, 255, 0.3)'};
  border-radius: 0.75rem;
  padding: 1.5rem;
  backdrop-filter: blur(5px);
`;

const ComparisonTitle = styled.h3`
  font-weight: 600;
  margin-bottom: 1rem;
  font-size: 1.1rem;
`;

const ComparisonList = styled.ul`
  list-style: disc;
  margin-left: 1.25rem;
  
  li {
    margin-bottom: 0.5rem;
    font-size: 0.95rem;
  }
`;

const FeaturesSection = styled.section`
  padding: 4rem 1rem;
  background: linear-gradient(135deg, #ffffff 0%, #f7fafc 100%);
  text-align: center;
  
  @media (max-width: 768px) {
    padding: 3rem 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 2.5rem 1rem;
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 72rem;
  margin: 0 auto;
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  animation: fadeInUp 0.8s ease-out;
  
  &:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(251, 191, 36, 0.3);
  }
  
  &:nth-child(1) { animation-delay: 0.2s; }
  &:nth-child(2) { animation-delay: 0.4s; }
  &:nth-child(3) { animation-delay: 0.6s; }
  
  @keyframes fadeInUp {
    0% { 
      opacity: 0; 
      transform: translateY(30px); 
    }
    100% { 
      opacity: 1; 
      transform: translateY(0); 
    }
  }
`;

const FeatureIcon = styled.div`
  font-size: 5rem;
  margin-bottom: 1.5rem;
  animation: iconFloat 3s ease-in-out infinite;
  transition: all 0.3s ease;
  
  @keyframes iconFloat {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-8px) scale(1.15); }
  }
  
  &:hover {
    transform: scale(1.2) rotate(10deg);
    animation-play-state: paused;
  }
  
  @media (max-width: 768px) {
    font-size: 4rem;
  }
  
  @media (max-width: 480px) {
    font-size: 3.5rem;
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`;

const FeatureDescription = styled.p`
  font-size: 0.95rem;
  line-height: 1.6;
  opacity: 0.9;
  
  @media (max-width: 768px) {
    font-size: 1.05rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const TestimonialSection = styled.section`
  padding: 4rem 1rem;
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 768px) {
    padding: 3rem 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 2.5rem 1rem;
  }
`;

const TestimonialGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 60rem;
  margin: 0 auto;
`;

const TestimonialCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  animation: slideInLeft 1s ease-out;
  
  &:hover {
    transform: translateY(-5px) scale(1.02);
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  }
  
  &:nth-child(odd) {
    animation: slideInLeft 1s ease-out;
  }
  
  &:nth-child(even) {
    animation: slideInRight 1s ease-out;
  }
  
  @keyframes slideInLeft {
    0% { transform: translateX(-50px); opacity: 0; }
    100% { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideInRight {
    0% { transform: translateX(50px); opacity: 0; }
    100% { transform: translateX(0); opacity: 1; }
  }
`;

const TestimonialText = styled.blockquote`
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  font-style: italic;
  color: #2d3748;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    line-height: 1.5;
  }
  
  @media (max-width: 480px) {
    font-size: 1.05rem;
    line-height: 1.5;
  }
`;

const TestimonialAuthor = styled.cite`
  font-size: 0.9rem;
  color: #718096;
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const FinalCTASection = styled.section`
  padding: 4rem 1rem;
  text-align: center;
  background: linear-gradient(135deg, #ffffff 0%, #f7fafc 100%);
  
  @media (max-width: 768px) {
    padding: 3rem 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 2.5rem 1rem;
  }
`;

const FinalCTATitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: #2d3748;
  
  @media (max-width: 768px) {
    font-size: 2rem;
    line-height: 1.3;
  }
  
  @media (max-width: 480px) {
    font-size: 1.8rem;
    line-height: 1.4;
  }
`;

const FinalCTASubtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  color: #4a5568;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
    line-height: 1.5;
    
    br {
      display: none;
    }
  }
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
    line-height: 1.5;
  }
`;

const ScrollHint = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  animation: bounce 2s infinite;
  
  @media (max-width: 768px) {
    bottom: 1.5rem;
  }
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateX(-50%) translateY(0);
    }
    40% {
      transform: translateX(-50%) translateY(-10px);
    }
    60% {
      transform: translateX(-50%) translateY(-5px);
    }
  }
`;

const ScrollText = styled.div`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.25rem;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const ScrollIcon = styled.div`
  font-size: 1.5rem;
  animation: wiggle 1s ease-in-out infinite;
  
  @keyframes wiggle {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(-10deg); }
    75% { transform: rotate(10deg); }
  }
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

const ScrollArrow = styled.div`
  width: 20px;
  height: 20px;
  border-right: 2px solid rgba(255, 255, 255, 0.8);
  border-bottom: 2px solid rgba(255, 255, 255, 0.8);
  transform: rotate(45deg);
  animation: fadeInOut 2s infinite;
  
  @keyframes fadeInOut {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 1; }
  }
  
  @media (max-width: 768px) {
    width: 16px;
    height: 16px;
  }
`;

const HookingBadge = styled.div`
  background: linear-gradient(45deg, #ff6b6b, #ffa500);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: inline-block;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }
`;

const CuriosityHook = styled.div`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  animation: wobble 3s infinite;
  
  @keyframes wobble {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(-2deg); }
    75% { transform: rotate(2deg); }
  }
  
  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0.6rem 1.2rem;
  }
`;

const TrustBadge = styled.div`
  background: linear-gradient(45deg, #28a745, #20c997);
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 1rem;
  display: inline-block;
  box-shadow: 0 6px 20px rgba(40, 167, 69, 0.3);
  animation: glow 2s ease-in-out infinite alternate;
  
  @keyframes glow {
    from { box-shadow: 0 6px 20px rgba(40, 167, 69, 0.3); }
    to { box-shadow: 0 6px 25px rgba(40, 167, 69, 0.6); }
  }
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
  }
`;

const UrgencyBadge = styled.div`
  background: linear-gradient(45deg, #dc3545, #fd7e14);
  color: white;
  padding: 0.7rem 1.5rem;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  display: inline-block;
  box-shadow: 0 8px 25px rgba(220, 53, 69, 0.4);
  animation: urgentBlink 1.5s infinite;
  
  @keyframes urgentBlink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; transform: scale(1.02); }
  }
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.6rem 1.2rem;
  }
`;

export default LandingPage;