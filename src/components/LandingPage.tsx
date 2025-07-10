import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import UrgencyTimer from './UrgencyTimer';
import LiveParticipants from './LiveParticipants';
import TrustBadges from './TrustBadges';
import ExitIntentPopup from './ExitIntentPopup';
import { SupabaseService } from '../services/supabase';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [showExitIntent, setShowExitIntent] = useState(false);

  React.useEffect(() => {
    const visitId = Date.now().toString();
    // const sessionId = `landing-${visitId}`;
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
    
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('scroll', trackScrollDepth);
      document.removeEventListener('mouseleave', handleMouseLeave);
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

    // 바로 테스트 시작
    navigate('/landing');
  };

  const handleExitIntentAccept = () => {
    setShowExitIntent(false);
    // 바로 테스트 시작
    navigate('/landing');
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
                <EmotionalHook>"이번 여행은 실패하고 싶지 않아요!"</EmotionalHook>
                <MainTitle>
                  2분 만에 발견하는<br />
                  <HighlightText>나만의 완벽한 여행</HighlightText><br />
                  체크리스트까지 무료로!
                </MainTitle>
                <SubText>23,847명이 선택한 가족 여행 성공 비법</SubText>
              </motion.div>
            </MainHeadline>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <EmotionalBenefits>
                <BenefitItem>
                  <BenefitEmoji>🎯</BenefitEmoji>
                  <BenefitText>"내가 진짜 좋아하는 여행 스타일"</BenefitText>
                </BenefitItem>
                <BenefitItem>
                  <BenefitEmoji>💡</BenefitEmoji>
                  <BenefitText>"나만의 완벽한 여행지 추천"</BenefitText>
                </BenefitItem>
                <BenefitItem>
                  <BenefitEmoji>✨</BenefitEmoji>
                  <BenefitText>"평생 기억에 남을 나만의 여행"</BenefitText>
                </BenefitItem>
              </EmotionalBenefits>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              {/* 리드마그넷 혜택 강조 */}
              <LeadMagnetBanner>
                <LeadMagnetIcon>🎁</LeadMagnetIcon>
                <LeadMagnetContent>
                  <LeadMagnetTitle>지금 테스트 완료하시면 <strong>무료로 드려요!</strong></LeadMagnetTitle>
                  <LeadMagnetItems>
                    <LeadMagnetItem>✅ 맞춤형 여행 준비 체크리스트 (PDF)</LeadMagnetItem>
                    <LeadMagnetItem>✅ 우리 지역 여름방학 특별 행사 정보</LeadMagnetItem>
                  </LeadMagnetItems>
                </LeadMagnetContent>
              </LeadMagnetBanner>

              <CTAButtonGroup>
                <PrimaryCTAButton onClick={handleStartTest}>
                  <ButtonText>내 여행 스타일 분석하고 선물받기 →</ButtonText>
                  <ButtonSubtext>2분 설문 후 바로 다운로드 가능!</ButtonSubtext>
                </PrimaryCTAButton>
                <TrustIndicators>
                  <TrustItem>💕 23,847명이 선택한 이유</TrustItem>
                  <TrustItem>🎯 "진짜 나랑 똑같아!"</TrustItem>
                </TrustIndicators>
                
                {/* 신뢰성 배지 */}
                <TrustBadges />
              </CTAButtonGroup>
            </motion.div>
            
          </HeroContent>
        </HeroSection>

        {/* Story Section */}
        <StorySection data-section="story">
          <StoryContent>
            <HookingBadge>
              💥 92% 엄마들의 고민
            </HookingBadge>
            <SectionTitle>
              😱 "또 그곳? 애들이 재미없어해요..."
            </SectionTitle>
            <ProblemList>
              <ProblemItem>😭 "검색해도 나오는 건 똑같은 관광지뿐"</ProblemItem>
              <ProblemItem>😤 "우리 가족한테 맞는 곳을 찾을 수가 없어요"</ProblemItem>
            </ProblemList>
            
            <SolutionSection>
              <SolutionTitle>
                ✨ 하지만 이제 해결책이 있습니다!
              </SolutionTitle>
            </SolutionSection>
            
            <EmotionalStory>
              <StoryQuote>"체크리스트 보고 깜짝 놀랐어요! 생각지도 못한 준비물들이 있더라고요. 덕분에 이번 여행은 정말 완벽했어요. 아이들도 '엄마 최고!'라고..."</StoryQuote>
              <StoryAuthor>- 7살, 5살 두 아이 엄마 박○○님</StoryAuthor>
            </EmotionalStory>

            <TestimonialBox>
              <TestimonialHeader>🎯 실제 효과</TestimonialHeader>
              <TestimonialContent>"여행 준비 시간 70% 단축 + 만족도 200% 상승! 진짜 우리 가족 맞춤 여행지 추천에 체크리스트까지... 이거 진짜 무료 맞아요?"</TestimonialContent>
            </TestimonialBox>


            <StoryText>
              <strong>🎁 지금 바로 시작하면 받을 수 있는 것들:</strong><br />
              ✅ 나만의 여행 스타일 분석<br />
              ✅ 맞춤 여행지 추천<br />
              ✅ 완벽한 여행 준비 체크리스트<br />
              ✅ 우리 지역 숨은 명소 정보
            </StoryText>


            <CenteredButtonContainer>
              <CTAButton secondary onClick={handleStartTest}>
                지금 바로 무료로 시작하기 →
              </CTAButton>
            </CenteredButtonContainer>
            
          </StoryContent>
        </StorySection>

        {/* Features Section */}
        <FeaturesSection data-section="features">
          <CuriosityHook>
            ⏰ 단 2분! 그것도 무료!
          </CuriosityHook>
          <SectionTitle>🎯 딱 3가지만 알려드릴게요</SectionTitle>
          <FeatureGrid>
            <FeatureCard>
              <FeatureIcon>1️⃣</FeatureIcon>
              <FeatureTitle>당신의 여행 DNA</FeatureTitle>
              <FeatureDescription>
                8가지 타입 중<br />
                딱 맞는 스타일 발견
              </FeatureDescription>
            </FeatureCard>
            <FeatureCard>
              <FeatureIcon>2️⃣</FeatureIcon>
              <FeatureTitle>숨은 명소 추천</FeatureTitle>
              <FeatureDescription>
                남들 모르는<br />
                우리 동네 핫플레이스
              </FeatureDescription>
            </FeatureCard>
            <FeatureCard>
              <FeatureIcon>3️⃣</FeatureIcon>
              <FeatureTitle>완벽 준비 리스트</FeatureTitle>
              <FeatureDescription>
                빠뜨리면 후회할<br />
                필수 준비물 체크!
              </FeatureDescription>
            </FeatureCard>
          </FeatureGrid>
          
          <CenteredButtonContainer>
            <CTAButton onClick={handleStartTest}>
              2분 투자로 완벽한 여행 만들기 →
            </CTAButton>
          </CenteredButtonContainer>

        </FeaturesSection>


        {/* Final CTA */}
        <FinalCTASection>
          <UrgencyBadge>
            ⚠️ 오늘만 무료! 내일부터 유료 전환
          </UrgencyBadge>
          <FinalCTATitle>🚨 마지막 기회를 놓치지 마세요!</FinalCTATitle>
          <FinalCTASubtitle>
            23,847명의 엄마들이 이미 받아간<br />
            여행 성공 비법을 무료로 받을 마지막 날!
          </FinalCTASubtitle>
          
          {/* 최종 리드마그넷 어필 */}
          <FinalLeadMagnet>
            <FinalLeadMagnetTitle>🎁 지금 완료하시는 분께 특별 선물!</FinalLeadMagnetTitle>
            <FinalLeadMagnetList>
              <FinalLeadMagnetItem>📋 <strong>여행 준비 체크리스트</strong> - 가족 여행 필수품 완벽 정리</FinalLeadMagnetItem>
              <FinalLeadMagnetItem>🎪 <strong>지역별 여름 행사 정보</strong> - 우리 동네 숨은 명소까지</FinalLeadMagnetItem>
            </FinalLeadMagnetList>
            <FinalLeadMagnetNote>* 테스트 완료 후 즉시 다운로드 가능합니다</FinalLeadMagnetNote>
          </FinalLeadMagnet>
          
          <FinalCTAButtonContainer>
            <CTAButton large onClick={handleStartTest}>
              🚀 지금 바로 내 여행 스타일 확인하고 선물받기!
            </CTAButton>
          </FinalCTAButtonContainer>
        </FinalCTASection>
      </ContentOverlay>
      
      {/* Exit Intent 팝업 */}
      {showExitIntent && (
        <ExitIntentPopup 
          onAccept={handleExitIntentAccept}
          onClose={() => setShowExitIntent(false)}
        />
      )}
      
    </LandingContainer>
  );
};

// Styled Components
const LandingContainer = styled.div`
  position: relative;
  width: 100%;
  overflow-x: hidden;
  word-wrap: break-word;
  overflow-wrap: break-word;
  
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
  width: 100%;
  overflow-x: hidden;
  
  @media (max-width: 768px) {
    /* 모바일에서 스크롤 보장 */
    min-height: auto;
    touch-action: pan-y;
  }
`;

const HeroSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 6rem 1rem;
  min-height: 80vh;
  justify-content: center;
  position: relative;
  z-index: 3;
  width: 100%;
  max-width: 100vw;
  overflow-wrap: break-word;
  word-wrap: break-word;
  
  @media (max-width: 768px) {
    min-height: 70vh;
    padding: 4rem 1rem;
    padding-top: 5rem; /* UrgencyTimer 공간 확보 */
  }
  
  @media (max-width: 480px) {
    min-height: 60vh;
    padding: 3rem 1rem;
    padding-top: 4.5rem;
  }
  
  @media (max-width: 375px) {
    min-height: 50vh;
    padding: 2.5rem 1rem;
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

const LeadMagnetBanner = styled.div`
  background: linear-gradient(135deg, #fff5cc, #ffe4b3);
  border: 2px solid #ffa500;
  border-radius: 20px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 10px 30px rgba(255, 165, 0, 0.2);
  animation: subtle-pulse 3s ease-in-out infinite;
  
  @keyframes subtle-pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.02); }
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    padding: 1.2rem;
    margin-bottom: 1.5rem;
  }
`;

const LeadMagnetIcon = styled.div`
  font-size: 3rem;
  animation: bounce 2s infinite;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const LeadMagnetContent = styled.div`
  flex: 1;
  text-align: left;
  
  @media (max-width: 768px) {
    text-align: center;
  }
`;

const LeadMagnetTitle = styled.div`
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 0.8rem;
  
  strong {
    color: #ff6b6b;
    font-weight: 800;
  }
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 0.6rem;
  }
`;

const LeadMagnetItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const LeadMagnetItem = styled.div`
  font-size: 1rem;
  color: #555;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const CTAButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 100%;
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
  color: white;
  font-weight: 700;
  padding: 0.6rem 1.2rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
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
  width: 100%;
  max-width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  
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


const FeaturesSection = styled.section`
  padding: 4rem 1rem;
  background: linear-gradient(135deg, #ffffff 0%, #f7fafc 100%);
  text-align: center;
  width: 100%;
  max-width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  
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
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 0 1rem;
  }
  
  @media (max-width: 480px) {
    gap: 1.2rem;
    padding: 0 0.5rem;
  }
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
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    
    &:hover {
      transform: translateY(-5px) scale(1.01);
    }
  }
  
  @media (max-width: 480px) {
    padding: 1.2rem;
    border-radius: 0.8rem;
  }
  
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
    line-height: 1.5;
    
    br {
      display: none;
    }
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;


const FinalCTASection = styled.section`
  padding: 4rem 1rem;
  padding-bottom: calc(60px + 3rem); /* 라이브 배너 높이 + 여유 공간 */
  text-align: center;
  background: linear-gradient(135deg, #ffffff 0%, #f7fafc 100%);
  width: 100%;
  max-width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 768px) {
    padding: 3rem 1rem;
    padding-bottom: calc(55px + 2.5rem); /* 라이브 배너 높이 + 여유 공간 */
  }
  
  @media (max-width: 480px) {
    padding: 2.5rem 1rem;
    padding-bottom: calc(50px + 2rem); /* 라이브 배너 높이 + 여유 공간 */
  }
  
  @media (max-width: 375px) {
    padding: 2rem 1rem;
    padding-bottom: calc(45px + 1.5rem); /* 라이브 배너 높이 + 여유 공간 */
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

const FinalCTAButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  text-align: center;
`;

const FinalLeadMagnet = styled.div`
  background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
  border: 2px dashed #4caf50;
  border-radius: 20px;
  padding: 2rem;
  margin: 2rem auto;
  max-width: 600px;
  text-align: center;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    margin: 1.5rem auto;
  }
`;

const FinalLeadMagnetTitle = styled.h3`
  font-size: 1.5rem;
  color: #2e7d32;
  margin-bottom: 1rem;
  font-weight: 800;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

const FinalLeadMagnetList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-bottom: 1rem;
  text-align: left;
  
  @media (max-width: 768px) {
    text-align: center;
  }
`;

const FinalLeadMagnetItem = styled.div`
  font-size: 1.1rem;
  color: #333;
  
  strong {
    color: #388e3c;
  }
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const FinalLeadMagnetNote = styled.p`
  font-size: 0.9rem;
  color: #666;
  font-style: italic;
  margin-top: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
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

const TestimonialBox = styled.div<{ secondary?: boolean }>`
  background: ${props => props.secondary 
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
    : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'};
  color: white;
  padding: 1.5rem;
  border-radius: 15px;
  margin: 1.5rem 0;
  box-shadow: 0 8px 25px ${props => props.secondary 
    ? 'rgba(102, 126, 234, 0.3)' 
    : 'rgba(79, 172, 254, 0.3)'};
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  @media (max-width: 768px) {
    padding: 1.2rem;
    margin: 1.2rem 0;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
    margin: 1rem 0;
  }
`;

const TestimonialHeader = styled.div`
  font-weight: 700;
  font-size: 1.1rem;
  margin-bottom: 0.8rem;
  color: rgba(255, 255, 255, 0.9);
  
  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 0.6rem;
  }
`;

const TestimonialContent = styled.div`
  font-size: 1.1rem;
  line-height: 1.6;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.5;
  }
  
  @media (max-width: 480px) {
    font-size: 0.95rem;
  }
`;

const ProblemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 2rem 0;
  padding: 2rem;
  background: linear-gradient(135deg, #fff5f5, #fed7d7);
  border-radius: 15px;
  border-left: 5px solid #ff6b6b;
`;

const ProblemItem = styled.div`
  font-size: 1.1rem;
  color: #2d3748;
  padding: 0.8rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0.7rem;
  }
`;

const SolutionSection = styled.div`
  margin: 2rem 0;
`;

const SolutionTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  text-align: center;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

export default LandingPage;