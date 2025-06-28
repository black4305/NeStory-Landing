import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { SupabaseService } from '../services/supabase';

interface RealtimeStatsProps {
  show?: boolean;
}

const RealtimeStats: React.FC<RealtimeStatsProps> = ({ show = true }) => {
  const [activeUsers, setActiveUsers] = useState(0);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    // 초기 데이터 로드
    loadInitialData();

    // 30초마다 데이터 업데이트
    const interval = setInterval(loadInitialData, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const loadInitialData = async () => {
    // 활성 사용자 수 가져오기
    const activeUsersData = await SupabaseService.getActiveUsers();
    if (activeUsersData) {
      setActiveUsers(activeUsersData.count || 0);
    }

    // 리더보드 데이터 가져오기
    const leaderboardData = await SupabaseService.getResultLeaderboard();
    if (leaderboardData) {
      setLeaderboard(leaderboardData);
    }

    // 통계 데이터 가져오기
    loadStats();
  };

  const loadStats = async () => {
    const data = await SupabaseService.getStatsData();
    if (data) {
      setStats(data);
    }
  };

  if (!show || !stats) return null;

  return (
    <StatsContainer>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <StatsCard>
            <ActiveUsersSection>
              <PulsingDot />
              <ActiveCount>{activeUsers}</ActiveCount>
              <ActiveLabel>명이 지금 테스트 중</ActiveLabel>
            </ActiveUsersSection>

            <StatsGrid>
              <StatItem>
                <StatNumber>{stats.total_visits?.toLocaleString() || 0}</StatNumber>
                <StatLabel>총 방문자</StatLabel>
              </StatItem>
              <StatItem>
                <StatNumber>{stats.completed_responses?.toLocaleString() || 0}</StatNumber>
                <StatLabel>완료된 테스트</StatLabel>
              </StatItem>
              <StatItem>
                <StatNumber>{stats.avg_completion_time || 0}초</StatNumber>
                <StatLabel>평균 소요시간</StatLabel>
              </StatItem>
            </StatsGrid>

            {leaderboard.length > 0 && (
              <LeaderboardSection>
                <LeaderboardTitle>🏆 인기 여행 유형 TOP 3</LeaderboardTitle>
                {leaderboard.slice(0, 3).map((item, index) => (
                  <LeaderboardItem key={item.result}>
                    <Rank>{index + 1}</Rank>
                    <TypeName>{item.result}</TypeName>
                    <Percentage>{item.percentage}%</Percentage>
                  </LeaderboardItem>
                ))}
              </LeaderboardSection>
            )}
          </StatsCard>
        </motion.div>
      </AnimatePresence>
    </StatsContainer>
  );
};

// Styled Components
const StatsContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  
  @media (max-width: 768px) {
    bottom: 10px;
    right: 10px;
    left: 10px;
  }
`;

const StatsCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  min-width: 280px;
  
  @media (max-width: 768px) {
    padding: 1rem;
    min-width: auto;
  }
`;

const ActiveUsersSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

const PulsingDot = styled.div`
  width: 12px;
  height: 12px;
  background: #10b981;
  border-radius: 50%;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    background: #10b981;
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    70% {
      transform: scale(1.5);
      opacity: 0;
    }
    100% {
      transform: scale(1.5);
      opacity: 0;
    }
  }
`;

const ActiveCount = styled.span`
  font-size: 1.5rem;
  font-weight: 800;
  color: #10b981;
`;

const ActiveLabel = styled.span`
  font-size: 0.9rem;
  color: #6b7280;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
`;

const LeaderboardSection = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
`;

const LeaderboardTitle = styled.h4`
  font-size: 0.9rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
`;

const LeaderboardItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const Rank = styled.div`
  width: 24px;
  height: 24px;
  background: ${props => {
    if (props.children === 1) return '#ffd700';
    if (props.children === 2) return '#c0c0c0';
    return '#cd7f32';
  }};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  color: white;
`;

const TypeName = styled.div`
  flex: 1;
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
`;

const Percentage = styled.div`
  font-size: 0.85rem;
  font-weight: 700;
  color: #6b7280;
`;

export default RealtimeStats;