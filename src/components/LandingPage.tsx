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
              3시간 준비로 3세대 <br />
              행복지수 <HighlightText>3배</HighlightText> 높이기
            </MainHeadline>
            <SubHeadline>
              1,542개 실후기 기반 AI가<br className="mobile-break" />
              아이-부모-조부모 맞춤 코스를 단 3분 만에 추천합니다.
            </SubHeadline>
            <CTAButton onClick={handleStartTest}>
              3배 더 행복해지기 →
            </CTAButton>
          </HeroContent>
        </HeroSection>

        {/* Story Section */}
        <StorySection>
          <StoryContent>
            <SectionTitle>
              왜 <BrandText>NeStoryTI</BrandText>인가?
            </SectionTitle>

            <StoryText>
              토요일 아침 7시, 아이는 놀이공원을 외치고 조부모님은
              무릎이 불편해 외출을 망설입니다. <strong>당신의 가족도 이런 갈등을 겪고 있나요?</strong>
            </StoryText>

            <StoryText>
              저(창업자 <u>장영민</u>) 역시 맞벌이 부모님 대신 주말마다 일정 짜느라 밤을 새웠습니다.
              "가족이 행복하자고 떠난 여행이 왜 스트레스일까?"—이 질문이 모든 시작이었습니다.
            </StoryText>

            <StoryText>
              해결의 열쇠는 <strong>3-Layer AI 프로필</strong>이었습니다.
              아이·부모·조부모를 따로 분석하자, 불가능해 보이던 <em>'세대 평화 여행'</em>이
              의외로 간단해졌습니다.
            </StoryText>

            <ComparisonGrid>
              <ComparisonCard>
                <ComparisonTitle>시행 전</ComparisonTitle>
                <ComparisonList>
                  <li>5시간 일정 조율</li>
                  <li>가족 갈등 3회</li>
                </ComparisonList>
              </ComparisonCard>
              <ComparisonCard success>
                <ComparisonTitle>시행 후</ComparisonTitle>
                <ComparisonList>
                  <li>45분 준비 완료</li>
                  <li>'행복했다' 후기 94.7%</li>
                </ComparisonList>
              </ComparisonCard>
            </ComparisonGrid>

            <CTAButton secondary onClick={handleStartTest}>
              3분 만에 경험해 보기 →
            </CTAButton>
          </StoryContent>
        </StorySection>

        {/* Features Section */}
        <FeaturesSection>
          <SectionTitle>3-Layer AI 분석 시스템</SectionTitle>
          <FeatureGrid>
            <FeatureCard>
              <FeatureIcon>👶</FeatureIcon>
              <FeatureTitle>아이 성향 분석</FeatureTitle>
              <FeatureDescription>
                활동성, 호기심, 체력 수준을 고려한 맞춤형 여행 계획
              </FeatureDescription>
            </FeatureCard>
            <FeatureCard>
              <FeatureIcon>👨‍👩‍👧‍👦</FeatureIcon>
              <FeatureTitle>부모 라이프스타일</FeatureTitle>
              <FeatureDescription>
                예산, 휴식 선호도, 문화 관심사 기반 최적화
              </FeatureDescription>
            </FeatureCard>
            <FeatureCard>
              <FeatureIcon>👴</FeatureIcon>
              <FeatureTitle>조부모 편의성</FeatureTitle>
              <FeatureDescription>
                건강 상태, 이동 편의성, 안전성을 최우선 고려
              </FeatureDescription>
            </FeatureCard>
          </FeatureGrid>
        </FeaturesSection>

        {/* Social Proof */}
        <TestimonialSection>
          <SectionTitle>실제 후기</SectionTitle>
          <TestimonialGrid>
            <TestimonialCard>
              <TestimonialText>
                "7살 딸과 70대 부모님이 모두 만족한 첫 여행이었어요. 
                AI 추천이 정말 정확했습니다!"
              </TestimonialText>
              <TestimonialAuthor>- 김○○님 (서울 강남구)</TestimonialAuthor>
            </TestimonialCard>
            <TestimonialCard>
              <TestimonialText>
                "3시간 고민할 것을 3분 만에 해결했어요. 
                가족 모두가 행복한 여행 코스였습니다."
              </TestimonialText>
              <TestimonialAuthor>- 이○○님 (부산 해운대구)</TestimonialAuthor>
            </TestimonialCard>
          </TestimonialGrid>
        </TestimonialSection>

        {/* Final CTA */}
        <FinalCTASection>
          <FinalCTATitle>지금 바로 시작하세요</FinalCTATitle>
          <FinalCTASubtitle>3분 투자로 평생 기억될 가족 여행을 만들어보세요</FinalCTASubtitle>
          <CTAButton large onClick={handleStartTest}>
            ✨ 무료로 시작하기 ✨
          </CTAButton>
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
  z-index: 1;
  background: rgba(17, 24, 39, 0.8);
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

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const HighlightText = styled.span`
  color: #fbbf24;
  text-shadow: 0 0 20px rgba(251, 191, 36, 0.5);
`;

const SubHeadline = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  line-height: 1.6;
  opacity: 0.9;

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
  background: ${props => props.secondary ? '#4f46e5' : '#fbbf24'};
  color: ${props => props.secondary ? 'white' : '#1f2937'};
  padding: ${props => props.large ? '1rem 2rem' : '0.75rem 1.5rem'};
  border-radius: 9999px;
  border: none;
  font-weight: 600;
  font-size: ${props => props.large ? '1.25rem' : '1rem'};
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  
  &:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
  }

  ${props => !props.secondary && `
    animation: bounce 2s infinite;
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
  background: rgba(0, 0, 0, 0.3);
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
  color: #4f46e5;
  font-weight: 800;
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
  background: ${props => props.success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(107, 114, 128, 0.1)'};
  border: 1px solid ${props => props.success ? 'rgba(16, 185, 129, 0.3)' : 'rgba(107, 114, 128, 0.3)'};
  border-radius: 0.75rem;
  padding: 1.5rem;
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
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
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
  background: rgba(0, 0, 0, 0.3);
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