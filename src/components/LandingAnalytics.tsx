import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { SupabaseService } from '../services/supabase';

interface LandingVisit {
  visit_id: string;
  timestamp: number;
  user_agent?: string;
  referrer?: string;
  session_duration?: number;
  cta_clicked?: boolean;
  device_type?: string;
  scroll_depth?: number;
}

const LandingAnalytics: React.FC = () => {
  const [visits, setVisits] = useState<LandingVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalVisits: 0,
    todayVisits: 0,
    conversionRate: 0,
    averageSessionTime: 0,
    mobileRatio: 0
  });

  const loadLandingData = useCallback(async () => {
    try {
      setLoading(true);
      // Supabase에서 랜딩 페이지 분석 데이터 로드
      const analyticsData = await SupabaseService.getLandingAnalytics();
      
      setVisits(analyticsData);
      calculateStats(analyticsData);
    } catch (error) {
      console.error('랜딩 데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
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
    const conversions = data.filter(visit => visit.cta_clicked).length;
    const conversionRate = totalVisits > 0 ? (conversions / totalVisits) * 100 : 0;
    
    const sessionsWithDuration = data.filter(visit => visit.session_duration && visit.session_duration > 0);
    const averageSessionTime = sessionsWithDuration.length > 0 
      ? sessionsWithDuration.reduce((sum, visit) => sum + (visit.session_duration || 0), 0) / sessionsWithDuration.length 
      : 0;
    
    const mobileVisits = data.filter(visit => visit.device_type === 'mobile').length;
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

  const getDeviceIcon = (deviceType?: string) => {
    switch (deviceType) {
      case 'mobile': return '📱';
      case 'tablet': return '📟';
      default: return '💻';
    }
  };

  const getReferrerDisplay = (referrer?: string) => {
    if (!referrer || referrer === '') return '직접 접속';
    try {
      const url = new URL(referrer);
      return url.hostname;
    } catch {
      return referrer.substring(0, 30) + '...';
    }
  };

  const clearLandingData = async () => {
    if (window.confirm('정말로 모든 랜딩 페이지 분석 데이터를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) {
      try {
        // Supabase에서 모든 랜딩 분석 데이터 삭제
        // 주의: 실제 운영환경에서는 관리자 권한 확인 필요
        alert('현재 데이터 삭제 기능은 안전상 비활성화되어 있습니다.\n개발자에게 문의해주세요.');
      } catch (error) {
        console.error('랜딩 데이터 삭제 실패:', error);
        alert('데이터 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  if (loading) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <div>랜딩 페이지 데이터를 불러오는 중...</div>
        </div>
      </Container>
    );
  }

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
              <VisitItem key={visit.visit_id || index}>
                <VisitInfo>
                  <VisitHeader>
                    <DeviceIcon>{getDeviceIcon(visit.device_type)}</DeviceIcon>
                    <VisitTime>
                      {new Date(visit.timestamp).toLocaleString('ko-KR')}
                    </VisitTime>
                    {visit.cta_clicked && <ConversionBadge>✨ 전환</ConversionBadge>}
                  </VisitHeader>
                  
                  <VisitDetails>
                    <DetailItem>
                      <DetailLabel>유입:</DetailLabel>
                      <DetailValue>{getReferrerDisplay(visit.referrer)}</DetailValue>
                    </DetailItem>
                    
                    {visit.session_duration && (
                      <DetailItem>
                        <DetailLabel>체류:</DetailLabel>
                        <DetailValue>{formatSessionTime(visit.session_duration)}</DetailValue>
                      </DetailItem>
                    )}
                    
                    {visit.scroll_depth && (
                      <DetailItem>
                        <DetailLabel>스크롤:</DetailLabel>
                        <DetailValue>{visit.scroll_depth.toFixed(1)}%</DetailValue>
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
          <InfoItem>• 메인 랜딩 페이지(/) 방문 시 자동으로 데이터가 수집됩니다</InfoItem>
          <InfoItem>• CTA 버튼 클릭 시 전환으로 기록됩니다</InfoItem>
          <InfoItem>• 체류 시간과 스크롤 깊이는 페이지 이탈 시 계산됩니다</InfoItem>
          <InfoItem>• 데이터는 Supabase nestory-landing 스키마에 저장됩니다</InfoItem>
          <InfoItem>• 디바이스 타입별, 유입 경로별 분석이 가능합니다</InfoItem>
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