import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface LandingVisit {
  id: string;
  timestamp: number;
  userAgent: string;
  referrer: string;
  sessionDuration?: number;
  ctaClicked?: boolean;
  deviceType: 'mobile' | 'tablet' | 'desktop';
}

const LandingAnalytics: React.FC = () => {
  const [visits, setVisits] = useState<LandingVisit[]>([]);
  const [stats, setStats] = useState({
    totalVisits: 0,
    todayVisits: 0,
    conversionRate: 0,
    averageSessionTime: 0,
    mobileRatio: 0
  });

  const loadLandingData = useCallback(() => {
    // localStorage에서 랜딩 페이지 방문 데이터 로드
    const landingData = localStorage.getItem('landingPageAnalytics');
    const parsedData: LandingVisit[] = landingData ? JSON.parse(landingData) : [];
    
    setVisits(parsedData);
    calculateStats(parsedData);
  }, []);

  useEffect(() => {
    loadLandingData();
  }, [loadLandingData]);

  const calculateStats = (data: LandingVisit[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayTimestamp = today.getTime();

    const todayVisits = data.filter(visit => visit.timestamp >= todayTimestamp).length;
    const totalVisits = data.length;
    const conversions = data.filter(visit => visit.ctaClicked).length;
    const conversionRate = totalVisits > 0 ? (conversions / totalVisits) * 100 : 0;
    
    const sessionsWithDuration = data.filter(visit => visit.sessionDuration);
    const averageSessionTime = sessionsWithDuration.length > 0 
      ? sessionsWithDuration.reduce((sum, visit) => sum + (visit.sessionDuration || 0), 0) / sessionsWithDuration.length 
      : 0;
    
    const mobileVisits = data.filter(visit => visit.deviceType === 'mobile').length;
    const mobileRatio = totalVisits > 0 ? (mobileVisits / totalVisits) * 100 : 0;

    setStats({
      totalVisits,
      todayVisits,
      conversionRate,
      averageSessionTime,
      mobileRatio
    });
  };

  const formatSessionTime = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}초`;
    return `${Math.floor(seconds / 60)}분 ${Math.round(seconds % 60)}초`;
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile': return '📱';
      case 'tablet': return '📟';
      default: return '💻';
    }
  };

  const getReferrerDisplay = (referrer: string) => {
    if (!referrer || referrer === '') return '직접 접속';
    try {
      const url = new URL(referrer);
      return url.hostname;
    } catch {
      return referrer.substring(0, 30) + '...';
    }
  };

  const clearLandingData = () => {
    if (window.confirm('랜딩 페이지 분석 데이터를 모두 삭제하시겠습니까?')) {
      localStorage.removeItem('landingPageAnalytics');
      setVisits([]);
      setStats({
        totalVisits: 0,
        todayVisits: 0,
        conversionRate: 0,
        averageSessionTime: 0,
        mobileRatio: 0
      });
    }
  };

  return (
    <Container>
      <Header>
        <Title>📊 랜딩 페이지 분석</Title>
        <RefreshButton onClick={loadLandingData}>
          🔄 새로고침
        </RefreshButton>
      </Header>

      {/* 통계 카드들 */}
      <StatsGrid>
        <StatCard>
          <StatIcon>👥</StatIcon>
          <StatNumber>{stats.totalVisits}</StatNumber>
          <StatLabel>총 방문자</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatIcon>📅</StatIcon>
          <StatNumber>{stats.todayVisits}</StatNumber>
          <StatLabel>오늘 방문자</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatIcon>🎯</StatIcon>
          <StatNumber>{stats.conversionRate.toFixed(1)}%</StatNumber>
          <StatLabel>전환율 (CTA 클릭)</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatIcon>⏱️</StatIcon>
          <StatNumber>{formatSessionTime(stats.averageSessionTime)}</StatNumber>
          <StatLabel>평균 체류시간</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatIcon>📱</StatIcon>
          <StatNumber>{stats.mobileRatio.toFixed(1)}%</StatNumber>
          <StatLabel>모바일 비율</StatLabel>
        </StatCard>
      </StatsGrid>

      {/* 최근 방문 목록 */}
      <Section>
        <SectionHeader>
          <SectionTitle>🕒 최근 방문 내역</SectionTitle>
          <ClearButton onClick={clearLandingData}>
            🗑️ 데이터 삭제
          </ClearButton>
        </SectionHeader>

        {visits.length === 0 ? (
          <EmptyState>
            <EmptyIcon>📭</EmptyIcon>
            <EmptyText>아직 랜딩 페이지 방문 데이터가 없습니다.</EmptyText>
            <EmptySubtext>사용자가 /landing 페이지를 방문하면 여기에 표시됩니다.</EmptySubtext>
          </EmptyState>
        ) : (
          <VisitsList>
            {visits.slice(0, 20).map((visit, index) => (
              <VisitItem key={visit.id || index}>
                <VisitInfo>
                  <VisitHeader>
                    <DeviceIcon>{getDeviceIcon(visit.deviceType)}</DeviceIcon>
                    <VisitTime>
                      {new Date(visit.timestamp).toLocaleString('ko-KR')}
                    </VisitTime>
                    {visit.ctaClicked && <ConversionBadge>✨ 전환</ConversionBadge>}
                  </VisitHeader>
                  
                  <VisitDetails>
                    <DetailItem>
                      <DetailLabel>유입:</DetailLabel>
                      <DetailValue>{getReferrerDisplay(visit.referrer)}</DetailValue>
                    </DetailItem>
                    
                    {visit.sessionDuration && (
                      <DetailItem>
                        <DetailLabel>체류:</DetailLabel>
                        <DetailValue>{formatSessionTime(visit.sessionDuration)}</DetailValue>
                      </DetailItem>
                    )}
                  </VisitDetails>
                </VisitInfo>
              </VisitItem>
            ))}
          </VisitsList>
        )}
      </Section>

      {/* 설명 */}
      <InfoSection>
        <InfoTitle>📘 데이터 수집 안내</InfoTitle>
        <InfoList>
          <InfoItem>• 랜딩 페이지(/landing) 방문 시 자동으로 데이터가 수집됩니다</InfoItem>
          <InfoItem>• CTA 버튼 클릭 시 전환으로 기록됩니다</InfoItem>
          <InfoItem>• 체류 시간은 페이지 이탈 시 계산됩니다</InfoItem>
          <InfoItem>• 데이터는 브라우저 localStorage에 저장됩니다</InfoItem>
        </InfoList>
      </InfoSection>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  padding: 1rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
`;

const RefreshButton = styled.button`
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.9rem;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-1px);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
`;

const StatIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const StatNumber = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.85rem;
  color: #6b7280;
`;

const Section = styled.div`
  background: white;
  border-radius: 12px;
  margin-bottom: 2rem;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #f3f4f6;
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
`;

const ClearButton = styled.button`
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  font-size: 0.8rem;
  transition: background 0.2s;

  &:hover {
    background: #dc2626;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6b7280;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const EmptyText = styled.div`
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const EmptySubtext = styled.div`
  font-size: 0.9rem;
`;

const VisitsList = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const VisitItem = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f3f4f6;
  
  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f9fafb;
  }
`;

const VisitInfo = styled.div``;

const VisitHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const DeviceIcon = styled.span`
  font-size: 1.1rem;
`;

const VisitTime = styled.span`
  font-size: 0.9rem;
  color: #1f2937;
  font-weight: 500;
`;

const ConversionBadge = styled.span`
  background: linear-gradient(45deg, #10b981, #059669);
  color: white;
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  font-weight: 500;
`;

const VisitDetails = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const DetailItem = styled.div`
  display: flex;
  gap: 0.25rem;
  font-size: 0.8rem;
`;

const DetailLabel = styled.span`
  color: #6b7280;
`;

const DetailValue = styled.span`
  color: #1f2937;
  font-weight: 500;
`;

const InfoSection = styled.div`
  background: #f8fafc;
  border-radius: 8px;
  padding: 1.5rem;
  border-left: 4px solid #3b82f6;
`;

const InfoTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
`;

const InfoList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const InfoItem = styled.li`
  font-size: 0.9rem;
  color: #4b5563;
  margin-bottom: 0.5rem;
  padding-left: 0;

  &:last-child {
    margin-bottom: 0;
  }
`;

export default LandingAnalytics;