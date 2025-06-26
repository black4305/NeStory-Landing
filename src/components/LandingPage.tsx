import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    // 랜딩 페이지 방문 데이터 수집
    const visit: any = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      deviceType: getDeviceType()
    };

    // 기존 데이터에 추가
    const existingData = localStorage.getItem('landingPageAnalytics');
    const visits = existingData ? JSON.parse(existingData) : [];
    visits.unshift(visit); // 최신 방문을 앞에 추가
    
    // 최대 500개 기록만 유지
    if (visits.length > 500) {
      visits.splice(500);
    }
    
    localStorage.setItem('landingPageAnalytics', JSON.stringify(visits));

    // 페이지 이탈 시 체류 시간 기록
    const startTime = Date.now();
    
    const handleBeforeUnload = () => {
      const sessionDuration = (Date.now() - startTime) / 1000;
      if (sessionDuration > 1) { // 1초 이상 체류한 경우만 기록
        visit.sessionDuration = sessionDuration;
        const updatedVisits = visits.map((v: any) => v.id === visit.id ? visit : v);
        localStorage.setItem('landingPageAnalytics', JSON.stringify(updatedVisits));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
    const width = window.innerWidth;
    if (width <= 768) return 'mobile';
    if (width <= 1024) return 'tablet';
    return 'desktop';
  };

  const handleStartTest = () => {
    // CTA 클릭 이벤트 기록
    const existingData = localStorage.getItem('landingPageAnalytics');
    const visits = existingData ? JSON.parse(existingData) : [];
    
    if (visits.length > 0) {
      visits[0].ctaClicked = true; // 최신 방문에 CTA 클릭 기록
      localStorage.setItem('landingPageAnalytics', JSON.stringify(visits));
    }

    navigate('/test');
  };

  return (
    <LandingContainer>
      <VideoBackground autoPlay muted loop playsInline>
        <source src="/video/family-travel.mp4" type="video/mp4" />
      </VideoBackground>
      
      <ContentOverlay>
        {/* Hero Section */}
        <HeroSection>
          <HeroContent>
            <MainHeadline>
              "엄마, 놀이공원 가고 싶어!"<br />
              "할아버지는 무릎이 아픈데..."<br />
              <HighlightText>이런 고민, 이제 그만!</HighlightText>
            </MainHeadline>
            <SubHeadline>
              가족 모두가 만족하는 여행이 불가능하다고 생각하셨나요? <br />
              <strong>3분 테스트</strong>로 우리 가족만의 완벽한 여행 스타일을 찾아보세요!<br />
              <small style={{ fontSize: '0.85em', opacity: '0.8', marginTop: '0.5rem', display: 'block' }}>
                💡 이미 3,847가족이 만족한 NeStoryTI 여행 성향 분석
              </small>
            </SubHeadline>
            <CTAButton onClick={handleStartTest}>
              우리 가족 여행 스타일 찾기 →
            </CTAButton>
          </HeroContent>
        </HeroSection>

        {/* Story Section */}
        <StorySection>
          <StoryContent>
            <SectionTitle>
              🤔 이런 상황, 혹시 익숙하신가요?
            </SectionTitle>

            <StoryText>
              <strong>"아빠, 우리 어디 갈까요?"</strong><br />
              갑자기 묻는 아이의 질문에 당황스러운 주말 오후.
              남편은 "아무데나 괜찮다"고 하고, 아이들은 서로 다른 곳을 외칩니다.
            </StoryText>

            <StoryText>
              검색해도 나오는 건 뻔한 관광지뿐...
              <strong>"우리 가족에게 딱 맞는 곳은 어디일까?"</strong><br />
              매번 고민만 늘어가고, 결국 집에서 보내는 주말이 반복됩니다.
            </StoryText>

            <StoryText>
              그런데 <BrandText>NeStoryTI</BrandText>를 만난 후 달라졌습니다!<br />
              <em>"우리 가족만의 여행 성향"</em>을 정확히 알게 되니,
              더 이상 어디 갈지 고민하지 않아도 됩니다. 🎯
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

            <CTAButton secondary onClick={handleStartTest}>
              우리 가족도 이런 여행 하고 싶다면? →
            </CTAButton>
          </StoryContent>
        </StorySection>

        {/* Features Section */}
        <FeaturesSection>
          <SectionTitle>✨ 3분 테스트로 이런 걸 알 수 있어요!</SectionTitle>
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
        </FeaturesSection>

        {/* Social Proof */}
        <TestimonialSection>
          <SectionTitle>💬 이미 경험한 분들의 솔직한 후기</SectionTitle>
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
          <FinalCTATitle>🎉 이번 주말엔 어떠세요?</FinalCTATitle>
          <FinalCTASubtitle>
            더 이상 "어디 갈까?" 고민하지 마세요! <br />
            3분 후면 우리 가족 맞춤 여행지를 알 수 있습니다 ✈️
          </FinalCTASubtitle>
          <CTAButton large onClick={handleStartTest}>
            🚀 3분만에 우리 가족 여행 스타일 찾기
          </CTAButton>
          <div style={{ 
            fontSize: '0.9rem', 
            opacity: '0.8', 
            marginTop: '1rem',
            color: 'white'
          }}>
            💯 완전 무료 | 📱 간편 테스트 | 🎯 즉시 결과 확인
          </div>
        </FinalCTASection>
      </ContentOverlay>
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
  background: linear-gradient(135deg, rgba(240, 147, 251, 0.95) 0%, rgba(245, 87, 108, 0.95) 50%, rgba(102, 126, 234, 0.95) 100%);
  color: white;
  
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

  @media (max-width: 768px) {
    font-size: 2rem;
  }
  
  @keyframes slideInUp {
    0% { transform: translateY(50px); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
  }
`;

const HighlightText = styled.span`
  color: #fbbf24;
  text-shadow: 0 0 20px rgba(251, 191, 36, 0.8);
  animation: glow 2s ease-in-out infinite alternate;
  
  @keyframes glow {
    0% { text-shadow: 0 0 20px rgba(251, 191, 36, 0.8); }
    100% { text-shadow: 0 0 30px rgba(251, 191, 36, 1), 0 0 40px rgba(251, 191, 36, 0.6); }
  }
`;

const SubHeadline = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  line-height: 1.6;
  opacity: 0.9;
  animation: slideInUp 1s ease-out 0.3s both;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }

  .mobile-break {
    display: none;
    @media (max-width: 768px) {
      display: block;
    }
  }
`;

const CTAButton = styled.button<{ secondary?: boolean; large?: boolean }>`
  background: ${props => props.secondary 
    ? 'linear-gradient(45deg, #667eea, #764ba2)' 
    : 'linear-gradient(45deg, #fbbf24, #f59e0b)'};
  color: white;
  padding: ${props => props.large ? '1rem 2rem' : '0.75rem 1.5rem'};
  border-radius: 9999px;
  border: none;
  font-weight: 600;
  font-size: ${props => props.large ? '1.25rem' : '1rem'};
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  
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
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
`;

const StoryContent = styled.div`
  max-width: 48rem;
  margin: 0 auto;
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const BrandText = styled.span`
  color: #fbbf24;
  font-weight: 800;
  text-shadow: 0 0 10px rgba(251, 191, 36, 0.5);
`;

const StoryText = styled.p`
  font-size: 1.1rem;
  line-height: 1.7;
  margin-bottom: 2rem;
  text-align: left;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    text-align: center;
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
  font-size: 3rem;
  margin-bottom: 1rem;
  animation: iconFloat 3s ease-in-out infinite;
  
  @keyframes iconFloat {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-5px) scale(1.1); }
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const FeatureDescription = styled.p`
  font-size: 0.95rem;
  line-height: 1.6;
  opacity: 0.9;
`;

const TestimonialSection = styled.section`
  padding: 4rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
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
`;

const TestimonialAuthor = styled.cite`
  font-size: 0.9rem;
  opacity: 0.8;
`;

const FinalCTASection = styled.section`
  padding: 4rem 1rem;
  text-align: center;
`;

const FinalCTATitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const FinalCTASubtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

export default LandingPage;