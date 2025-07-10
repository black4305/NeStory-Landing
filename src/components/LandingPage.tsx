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
                <EmotionalHook>"엄마, 이번 여행 왜 이렇게 재미없어?"</EmotionalHook>
                <MainTitle>
                  아이가 행복해하는<br />
                  <HighlightText>우리 가족 맞춤 여행</HighlightText><br />
                  비법 체크리스트 무료 공개!
                </MainTitle>
                <SubText>🔥 32,156명의 부모님이 이미 받아가신 특별 선물!</SubText>
              </motion.div>
            </MainHeadline>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <EmotionalBenefits>
                <BenefitItem>
                  <BenefitEmoji>😍</BenefitEmoji>
                  <BenefitText>"아이들이 계속 웃는 여행 루트"</BenefitText>
                </BenefitItem>
                <BenefitItem>
                  <BenefitEmoji>🎁</BenefitEmoji>
                  <BenefitText>"준비물 하나도 안 빠뜨리는 체크리스트"</BenefitText>
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
                  <LeadMagnetTitle>🚨 오늘만 <strong>100% 무료!</strong> (정가 19,900원)</LeadMagnetTitle>
                  <LeadMagnetItems>
                    <LeadMagnetItem>📋 가족 여행 완벽 준비 체크리스트 (PDF 37페이지)</LeadMagnetItem>
                    <LeadMagnetItem>🎪 2025 전국 어린이 축제 일정표 (지역별 정리)</LeadMagnetItem>
                    <LeadMagnetItem>💰 가족 여행 예산 계산기 (엑셀 자동계산)</LeadMagnetItem>
                  </LeadMagnetItems>
                </LeadMagnetContent>
              </LeadMagnetBanner>

              <CTAButtonGroup>
                <PrimaryCTAButton onClick={handleStartTest}>
                  <ButtonText>🎁 19,900원 → 0원! 지금 받아가기</ButtonText>
                  <ButtonSubtext>⏰ 1분 테스트 후 즉시 다운로드!</ButtonSubtext>
                </PrimaryCTAButton>
                <TrustIndicators>
                  <TrustItem>🔥 오늘 이미 847명이 받아감</TrustItem>
                  <TrustItem>⭐ "이거 정말 대박이에요!"</TrustItem>
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
              🆘 작년 여름, 제주도에서 일어난 일
            </HookingBadge>
            <SectionTitle>
              💔 "엄마, 우리 왜 여행 왔어? 집이 더 재밌어..."
            </SectionTitle>
            <ProblemList>
              <ProblemItem>😭 "3박 4일 내내 아이들은 핸드폰만 봤어요"</ProblemItem>
              <ProblemItem>🤯 "준비물 빠뜨려서 현지에서 20만원 추가 지출"</ProblemItem>
              <ProblemItem>😰 "유명 맛집 2시간 대기... 아이들은 짜증만"</ProblemItem>
            </ProblemList>
            
            <SolutionSection>
              <SolutionTitle>
                ✨ 하지만 이제 해결책이 있습니다!
              </SolutionTitle>
            </SolutionSection>
            
            <EmotionalStory>
              <StoryQuote>"이 체크리스트 진짜 신의 한 수였어요! 비상약, 여벌옷, 아이들 간식까지... 하나도 안 빠뜨리고 다 챙겼더니 여행이 이렇게 편할 수가! 남편이 '당신 천재야?'라고 했어요ㅋㅋ"</StoryQuote>
              <StoryAuthor>- 8살, 6살 자매 엄마 김○○님 (부산)</StoryAuthor>
            </EmotionalStory>

            <TestimonialBox>
              <TestimonialHeader>💬 어제 받으신 분 실시간 후기</TestimonialHeader>
              <TestimonialContent>"헐... 이 체크리스트 대박이에요! 제가 평소에 놓치던 것들이 다 있네요. 여행용 구급약, 아이 멀미약, 여벌 속옷, 비닐봉지까지... 진짜 19,900원 주고 사도 아깝지 않은데 무료라니! 남편한테도 자랑했어요ㅋㅋ"</TestimonialContent>
            </TestimonialBox>


            <StoryText>
              <strong>📦 19,900원 상당 패키지 내용물:</strong><br />
              ✅ 우리 가족 맞춤 여행 스타일 진단서 (8페이지)<br />
              ✅ 빠짐없는 여행 준비 체크리스트 (37페이지 PDF)<br />
              ✅ 2025 전국 축제 일정표 + 할인 쿠폰 모음<br />
              ✅ 가족 여행 예산 자동계산 엑셀 파일<br />
              <strong style={{color: '#ff6b6b'}}>⏰ 오늘 자정까지만 100% 무료!</strong>
            </StoryText>


            <CenteredButtonContainer>
              <CTAButton secondary onClick={handleStartTest}>
                💸 19,900원 → 0원! 지금 당장 받기 →
              </CTAButton>
            </CenteredButtonContainer>
            
          </StoryContent>
        </StorySection>

        {/* Features Section */}
        <FeaturesSection data-section="features">
          <CuriosityHook>
            💸 19,900원 → 0원! 오늘 하루만!
          </CuriosityHook>
          <SectionTitle>📦 패키지에 포함된 3가지 핵심 자료</SectionTitle>
          <FeatureGrid>
            <FeatureCard>
              <FeatureIcon>📋</FeatureIcon>
              <FeatureTitle>체크리스트 PDF</FeatureTitle>
              <FeatureDescription>
                37페이지 분량<br />
                준비물 하나도 안 빠뜨려요<br />
                <strong style={{color: '#ff6b6b'}}>정가 9,900원</strong>
              </FeatureDescription>
            </FeatureCard>
            <FeatureCard>
              <FeatureIcon>🎪</FeatureIcon>
              <FeatureTitle>2025 축제 일정표</FeatureTitle>
              <FeatureDescription>
                전국 어린이 축제 총정리<br />
                할인 쿠폰까지 포함!<br />
                <strong style={{color: '#ff6b6b'}}>정가 5,000원</strong>
              </FeatureDescription>
            </FeatureCard>
            <FeatureCard>
              <FeatureIcon>💰</FeatureIcon>
              <FeatureTitle>예산 계산기</FeatureTitle>
              <FeatureDescription>
                엑셀 자동계산 파일<br />
                숙박/교통/식비 한번에!<br />
                <strong style={{color: '#ff6b6b'}}>정가 5,000원</strong>
              </FeatureDescription>
            </FeatureCard>
          </FeatureGrid>
          
          <CenteredButtonContainer>
            <CTAButton onClick={handleStartTest}>
              💎 총 19,900원 패키지 지금 무료로 받기!
            </CTAButton>
          </CenteredButtonContainer>

        </FeaturesSection>


        {/* Final CTA */}
        <FinalCTASection>
          <UrgencyBadge>
            🔥 마감 임박! 오늘 밤 12시 정각 종료
          </UrgencyBadge>
          <FinalCTATitle>😱 아직도 19,900원짜리를 안 받으셨어요?</FinalCTATitle>
          <FinalCTASubtitle>
            지금까지 32,156명이 받아간 베스트셀러 패키지<br />
            <span style={{color: '#ff6b6b', fontWeight: 800}}>오늘이 정말 마지막 무료 배포일입니다!</span>
          </FinalCTASubtitle>
          
          {/* 최종 리드마그넷 어필 */}
          <FinalLeadMagnet>
            <FinalLeadMagnetTitle>💝 총 19,900원 상당 패키지 구성품</FinalLeadMagnetTitle>
            <FinalLeadMagnetList>
              <FinalLeadMagnetItem>📋 <strong>가족여행 완벽 체크리스트</strong> (PDF 37페이지) - 정가 9,900원</FinalLeadMagnetItem>
              <FinalLeadMagnetItem>🎪 <strong>2025 전국 축제 일정표</strong> (엑셀파일) - 정가 5,000원</FinalLeadMagnetItem>
              <FinalLeadMagnetItem>💰 <strong>여행 예산 자동계산기</strong> (엑셀파일) - 정가 5,000원</FinalLeadMagnetItem>
              <FinalLeadMagnetItem>🎯 <strong>우리 가족 여행 스타일 진단서</strong> (PDF 8페이지) - 보너스!</FinalLeadMagnetItem>
            </FinalLeadMagnetList>
            <FinalLeadMagnetNote>
              <span style={{fontSize: '1.2rem', color: '#ff6b6b', fontWeight: 'bold'}}>
                ⏰ 1분 테스트 완료 즉시 전체 패키지 다운로드!
              </span>
            </FinalLeadMagnetNote>
          </FinalLeadMagnet>
          
          <FinalCTAButtonContainer>
            <CTAButton large onClick={handleStartTest}>
              💝 19,900원 패키지 무료로 받기 (1분 완성!)
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