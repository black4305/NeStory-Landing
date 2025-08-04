import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { supabaseService } from '../services/supabaseService';

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ChartTitle,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  
  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const Header = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const TabContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  flex-wrap: wrap;
`;

const Tab = styled.button<{ active: boolean }>`
  background: ${props => props.active 
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
    : 'rgba(255, 255, 255, 0.9)'};
  color: ${props => props.active ? 'white' : '#667eea'};
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
  }
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
  margin-bottom: 30px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea, #764ba2);
  }
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 8px;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #6c757d;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ChartCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  height: 400px;
  position: relative;
`;

const ChartHeading = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 20px;
  text-align: center;
`;

const FunnelContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  grid-column: 1 / -1;
`;

const FunnelStep = styled.div<{ conversionRate: number }>`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  position: relative;
`;

const FunnelBar = styled.div<{ width: number; color: string }>`
  height: 50px;
  width: ${props => props.width}%;
  background: ${props => props.color};
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  color: white;
  font-weight: 600;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    animation: shimmer 2s infinite;
  }
  
  @keyframes shimmer {
    0% { left: -100%; }
    100% { left: 100%; }
  }
`;

const FunnelLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
`;

const FunnelValue = styled.span`
  font-size: 16px;
  font-weight: 800;
`;

const RealtimeIndicator = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => props.active ? '#27ae60' : '#e74c3c'};
    animation: ${props => props.active ? 'pulse 2s infinite' : 'none'};
  }
  
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  
  &:after {
    content: '';
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  background: rgba(231, 76, 60, 0.1);
  border: 1px solid #e74c3c;
  border-radius: 10px;
  padding: 15px;
  color: #e74c3c;
  text-align: center;
  margin: 20px 0;
`;

interface AdvancedAdminDashboardProps {
  onLogout?: () => void;
}

const AdvancedAdminDashboard: React.FC<AdvancedAdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'funnel' | 'analytics' | 'realtime'>('overview');
  const [funnelMetrics, setFunnelMetrics] = useState<any>(null);
  const [realtimeStats, setRealtimeStats] = useState<any>(null);
  const [travelTypeAnalytics, setTravelTypeAnalytics] = useState<any>({});
  const [pagePerformance, setPagePerformance] = useState<any>({});
  const [geographicData, setGeographicData] = useState<any>(null);
  const [activeUsers, setActiveUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [lastUpdate, setLastUpdate] = useState<string>('');

  // 데이터 로딩
  const loadData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const [
        funnelData,
        realtimeData,
        travelTypeData,
        pageData,
        geoData,
        activeUserData
      ] = await Promise.all([
        supabaseService.getFunnelMetrics(),
        supabaseService.getRealtimeStats(),
        supabaseService.getTravelTypeAnalytics(),
        supabaseService.getPagePerformanceAnalytics(),
        supabaseService.getGeographicAnalytics(),
        supabaseService.getActiveUserData()
      ]);

      setFunnelMetrics(funnelData?.data || {});
      setRealtimeStats(realtimeData?.data || {});
      setTravelTypeAnalytics(travelTypeData?.data || {});
      setPagePerformance(pageData?.data || {});
      setGeographicData(geoData?.data || {});
      setActiveUsers(activeUserData?.data || []);
      setLastUpdate(new Date().toLocaleString());
    } catch (err) {
      setError('데이터 로딩 중 오류가 발생했습니다.');
      console.error('Dashboard data loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    
    // 30초마다 실시간 데이터 업데이트
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  // 차트 데이터 생성
  const getFunnelChartData = () => {
    if (!funnelMetrics) return null;
    
    const steps = ['랜딩', '안내', '설문', '리드', '결과'];
    const values = [
      funnelMetrics.landing_visitors || 0,
      funnelMetrics.info_visitors || 0,
      funnelMetrics.survey_starters || 0,
      funnelMetrics.leads_collected || 0,
      funnelMetrics.result_viewers || 0
    ];
    
    return {
      labels: steps,
      datasets: [{
        label: '사용자 수',
        data: values,
        backgroundColor: [
          '#667eea',
          '#764ba2',
          '#f093fb',
          '#f5576c',
          '#4facfe'
        ],
        borderColor: 'rgba(255, 255, 255, 0.8)',
        borderWidth: 2
      }]
    };
  };

  const getTravelTypeChartData = () => {
    if (!travelTypeAnalytics || Object.keys(travelTypeAnalytics).length === 0) return null;
    
    const labels = Object.keys(travelTypeAnalytics);
    const data = Object.values(travelTypeAnalytics);
    
    return {
      labels,
      datasets: [{
        label: '완료 수',
        data,
        backgroundColor: [
          '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
          '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
        ]
      }]
    };
  };

  const getPagePerformanceChartData = () => {
    if (!pagePerformance || Object.keys(pagePerformance).length === 0) return null;
    
    const routes = Object.keys(pagePerformance);
    const avgTimes = routes.map(route => pagePerformance[route]?.avgTime || 0);
    const bounceRates = routes.map(route => pagePerformance[route]?.bounceRate || 0);
    
    return {
      labels: routes,
      datasets: [
        {
          label: '평균 체류시간(ms)',
          data: avgTimes,
          backgroundColor: 'rgba(102, 126, 234, 0.8)',
          yAxisID: 'y'
        },
        {
          label: '방문 수',
          data: routes.map(route => pagePerformance[route]?.visits || 0),
          backgroundColor: 'rgba(245, 87, 108, 0.8)',
          yAxisID: 'y1'
        }
      ]
    };
  };

  const renderOverview = () => (
    <>
      <StatsGrid>
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatNumber>{realtimeStats?.active_sessions_today || 0}</StatNumber>
          <StatLabel>오늘 세션</StatLabel>
        </StatCard>
        
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatNumber>{activeUsers?.length || 0}</StatNumber>
          <StatLabel>현재 활성</StatLabel>
        </StatCard>
        
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatNumber>{funnelMetrics?.leads_collected || 0}</StatNumber>
          <StatLabel>수집된 리드</StatLabel>
        </StatCard>
        
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatNumber>
            {funnelMetrics?.completion_to_lead_rate || 0}%
          </StatNumber>
          <StatLabel>리드 전환율</StatLabel>
        </StatCard>
      </StatsGrid>

      <DashboardGrid>
        <ChartCard>
          <ChartHeading>여행 유형별 완료 분포</ChartHeading>
          {travelTypeAnalytics.length > 0 ? (
            <Doughnut 
              data={getTravelTypeChartData()!}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom'
                  }
                }
              }}
            />
          ) : (
            <LoadingSpinner />
          )}
        </ChartCard>

        <ChartCard>
          <ChartHeading>페이지별 성능</ChartHeading>
          {pagePerformance.length > 0 ? (
            <Bar 
              data={getPagePerformanceChartData()!}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                  },
                  y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: {
                      drawOnChartArea: false,
                    },
                  },
                }
              }}
            />
          ) : (
            <LoadingSpinner />
          )}
        </ChartCard>
      </DashboardGrid>
    </>
  );

  const renderFunnel = () => (
    <FunnelContainer>
      <ChartHeading>실시간 전환 퍼널</ChartHeading>
      {funnelMetrics ? (
        <div>
          <FunnelStep conversionRate={100}>
            <FunnelBar width={100} color="#667eea">
              <FunnelLabel>랜딩 페이지</FunnelLabel>
              <FunnelValue>{funnelMetrics.landing_visitors}명</FunnelValue>
            </FunnelBar>
          </FunnelStep>
          
          <FunnelStep conversionRate={funnelMetrics.landing_to_info_rate}>
            <FunnelBar width={funnelMetrics.landing_to_info_rate} color="#764ba2">
              <FunnelLabel>안내 페이지 ({funnelMetrics.landing_to_info_rate}%)</FunnelLabel>
              <FunnelValue>{funnelMetrics.info_visitors}명</FunnelValue>
            </FunnelBar>
          </FunnelStep>
          
          <FunnelStep conversionRate={funnelMetrics.info_to_survey_rate}>
            <FunnelBar width={funnelMetrics.info_to_survey_rate} color="#f093fb">
              <FunnelLabel>설문 시작 ({funnelMetrics.info_to_survey_rate}%)</FunnelLabel>
              <FunnelValue>{funnelMetrics.survey_starters}명</FunnelValue>
            </FunnelBar>
          </FunnelStep>
          
          <FunnelStep conversionRate={funnelMetrics.survey_completion_rate}>
            <FunnelBar width={funnelMetrics.survey_completion_rate} color="#f5576c">
              <FunnelLabel>설문 완료 ({funnelMetrics.survey_completion_rate}%)</FunnelLabel>
              <FunnelValue>{funnelMetrics.survey_completers}명</FunnelValue>
            </FunnelBar>
          </FunnelStep>
          
          <FunnelStep conversionRate={funnelMetrics.completion_to_lead_rate}>
            <FunnelBar width={funnelMetrics.completion_to_lead_rate} color="#4facfe">
              <FunnelLabel>리드 수집 ({funnelMetrics.completion_to_lead_rate}%)</FunnelLabel>
              <FunnelValue>{funnelMetrics.leads_collected}명</FunnelValue>
            </FunnelBar>
          </FunnelStep>
        </div>
      ) : (
        <LoadingSpinner />
      )}
    </FunnelContainer>
  );

  if (loading && !realtimeStats) {
    return (
      <Container>
        <LoadingSpinner />
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <div>
          <Title>🚀 Landing Analytics Dashboard</Title>
          <RealtimeIndicator active={activeUsers.length > 0}>
            실시간 활성 사용자: {activeUsers.length}명
          </RealtimeIndicator>
          {lastUpdate && (
            <div style={{ fontSize: '12px', color: '#6c757d', marginTop: '5px' }}>
              마지막 업데이트: {lastUpdate}
            </div>
          )}
        </div>
        <button 
          onClick={onLogout}
          style={{
            background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '15px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          로그아웃
        </button>
      </Header>

      <TabContainer>
        <Tab active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>
          📊 개요
        </Tab>
        <Tab active={activeTab === 'funnel'} onClick={() => setActiveTab('funnel')}>
          🔄 퍼널
        </Tab>
        <Tab active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')}>
          📈 분석
        </Tab>
        <Tab active={activeTab === 'realtime'} onClick={() => setActiveTab('realtime')}>
          ⚡ 실시간
        </Tab>
      </TabContainer>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'funnel' && renderFunnel()}
      {activeTab === 'analytics' && renderOverview()} {/* 추후 별도 분석 탭 구현 */}
      {activeTab === 'realtime' && renderOverview()} {/* 추후 실시간 탭 구현 */}
    </Container>
  );
};

export default AdvancedAdminDashboard;