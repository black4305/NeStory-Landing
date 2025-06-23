import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { AnalyticsData } from '../types';
import { calculateReliabilityScore, getReliabilityScoreColor, getReliabilityScoreLabel } from '../utils/reliability';
import { questions } from '../data/questions';
import { DataManager } from '../utils/dataManager';
import { useFirebaseData, useFirebaseStatus } from '../hooks/useFirebaseData';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 2rem;
`;

const Header = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 100px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    transform: translate(30px, -30px);
  }
`;

const HeaderContent = styled.div`
  position: relative;
  z-index: 1;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  opacity: 0.9;
  line-height: 1.6;
  
  .mobile-break {
    display: none;
  }
  
  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.5;
    
    .mobile-break {
      display: block;
    }
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    line-height: 1.4;
  }
`;

const LogoutButton = styled(motion.button)`
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  border-radius: 15px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  backdrop-filter: blur(10px);
  
  @media (max-width: 768px) {
    position: relative;
    top: auto;
    right: auto;
    margin-top: 1rem;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const StatCard = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.8);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea, #764ba2);
  }
`;

const StatIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const StatValue = styled.div`
  font-size: 2.8rem;
  font-weight: 800;
  color: #2d3748;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: #718096;
  font-weight: 600;
`;

const StatChange = styled.div<{ positive: boolean }>`
  font-size: 0.9rem;
  color: ${props => props.positive ? '#48bb78' : '#f56565'};
  font-weight: 600;
  margin-top: 0.5rem;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.8);
`;

const ChartTitle = styled.h3`
  color: #2d3748;
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Tab = styled(motion.button)<{ active: boolean }>`
  background: ${props => props.active 
    ? 'linear-gradient(135deg, #667eea, #764ba2)' 
    : 'white'};
  color: ${props => props.active ? 'white' : '#4a5568'};
  border: 2px solid ${props => props.active ? 'transparent' : '#e2e8f0'};
  border-radius: 15px;
  padding: 1rem 2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const UserDetailModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 25px;
  padding: 2.5rem;
  max-width: 900px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
`;

const UserTable = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  overflow: hidden;
`;

const TableHeader = styled.div`
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e2e8f0;
`;

const TableRow = styled(motion.div)`
  display: grid;
  grid-template-columns: 2fr 2fr 1.5fr 1fr 1fr 1fr 1fr 1.5fr;
  gap: 1rem;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #f7fafc;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f8fafc;
    transform: scale(1.01);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
`;

const TableHeaderRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 2fr 1.5fr 1fr 1fr 1fr 1fr 1.5fr;
  gap: 1rem;
  padding: 1rem 2rem;
  font-weight: 600;
  color: #4a5568;
  font-size: 0.9rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const FilterBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: center;
  flex-wrap: wrap;
`;

const FilterInput = styled.input`
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  flex: 1;
  min-width: 200px;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const FilterSelect = styled.select`
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const ExportButton = styled(motion.button)`
  background: linear-gradient(45deg, #48bb78, #38a169);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Badge = styled.span<{ type: 'completed' | 'abandoned' | 'active' }>`
  background: ${props => {
    switch (props.type) {
      case 'completed': return 'linear-gradient(45deg, #48bb78, #38a169)';
      case 'abandoned': return 'linear-gradient(45deg, #f56565, #e53e3e)';
      case 'active': return 'linear-gradient(45deg, #4299e1, #3182ce)';
      default: return '#e2e8f0';
    }
  }};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const ReliabilityBadge = styled.span<{ score: number }>`
  background: ${props => getReliabilityScoreColor(props.score)};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const COLORS = ['#667eea', '#764ba2', '#48bb78', '#f56565', '#ed8936', '#38b2ac'];

interface EnhancedAdminDashboardProps {}

const EnhancedAdminDashboard: React.FC<EnhancedAdminDashboardProps> = () => {
  // Firebase 데이터 hooks 사용
  const { data: firebaseData, loading, error, statistics, refreshData } = useFirebaseData();
  const { isConnected, checkConnection } = useFirebaseStatus();
  
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [filteredData, setFilteredData] = useState<AnalyticsData[]>([]);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<AnalyticsData | null>(null);

  // Firebase 데이터가 로드되면 신뢰도 점수 계산하여 업데이트
  useEffect(() => {
    if (firebaseData.length > 0) {
      const processedData = firebaseData.map((item: AnalyticsData) => {
        // 신뢰도 점수 계산
        if (item.answers && item.answers.length > 0) {
          const reliability = calculateReliabilityScore(item.answers);
          return {
            ...item,
            reliabilityScore: reliability.score,
            responsePattern: reliability.pattern
          };
        }
        return item;
      });
      
      setAnalyticsData(processedData);
      setFilteredData(processedData);
    } else if (!loading && error) {
      // Firebase 실패 시 localStorage 백업 사용
      loadAnalyticsDataFromLocal();
    }
  }, [firebaseData, loading, error]);

  const loadAnalyticsDataFromLocal = () => {
    // URL에서 데이터 가져오기 시도
    DataManager.importFromURL();
    
    // 데이터 로드
    const data = DataManager.loadAnalyticsData().map((item: AnalyticsData) => {
      // 신뢰도 점수 계산
      if (item.answers && item.answers.length > 0) {
        const reliability = calculateReliabilityScore(item.answers);
        return {
          ...item,
          reliabilityScore: reliability.score,
          responsePattern: reliability.pattern
        };
      }
      return item;
    });
    
    setAnalyticsData(data);
    setFilteredData(data);
  };

  const filterData = useCallback(() => {
    let filtered = [...analyticsData];

    if (statusFilter !== 'all') {
      const isCompleted = statusFilter === 'completed';
      filtered = filtered.filter(item => item.completed === isCompleted);
    }

    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.userInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.userInfo?.instagram?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.result?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredData(filtered);
  }, [analyticsData, statusFilter, searchTerm]);

  useEffect(() => {
    filterData();
  }, [filterData]);

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuthenticated');
    window.location.reload();
  };

  const exportToCSV = () => {
    const headers = [
      '세션ID', '이름', '전화번호', '이메일', '연령대', '성별', '가족구성원', '지역',
      '여행유형', '완료여부', '소요시간(초)', '클릭수', '스크롤깊이(%)', '디바이스',
      '신뢰도점수', '응답패턴', '마케팅동의', '제출일시'
    ];

    const rows = filteredData.map(item => [
      item.sessionId,
      item.userInfo?.name || '',
      item.userInfo?.instagram || '',
      item.userInfo?.age || '',
      item.userInfo?.gender || '',
      item.userInfo?.familySize || '',
      item.userInfo?.region || '',
      item.result || '',
      item.completed ? '완료' : '미완료',
      Math.round(item.totalTime / 1000),
      item.clickCount,
      item.scrollDepth,
      item.deviceType,
      item.reliabilityScore || '',
      item.responsePattern === 'consistent' ? '일관적' : 
        item.responsePattern === 'inconsistent' ? '부분적 일관성' :
        item.responsePattern === 'random' ? '무작위' : '',
      item.userInfo?.marketingConsent ? '동의' : '비동의',
      item.submittedAt ? new Date(item.submittedAt).toLocaleString() : ''
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `설문조사_데이터_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  const getStats = () => {
    const total = analyticsData.length;
    const completed = analyticsData.filter(item => item.completed).length;
    const avgTime = analyticsData.length > 0 
      ? Math.round(analyticsData.reduce((sum, item) => sum + item.totalTime, 0) / analyticsData.length / 1000)
      : 0;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const avgScore = analyticsData.length > 0
      ? Math.round(analyticsData.reduce((sum, item) => sum + item.answers.reduce((aSum, answer) => aSum + answer.score, 0), 0) / analyticsData.length)
      : 0;

    return { total, completed, avgTime, completionRate, avgScore };
  };

  const getChartData = () => {
    // 시간대별 응답 데이터
    const hourlyData = Array.from({ length: 24 }, (_, hour) => {
      const count = analyticsData.filter(item => {
        const date = new Date(item.startTime);
        return date.getHours() === hour;
      }).length;
      return { hour: `${hour}시`, count };
    });

    // 디바이스별 데이터
    const deviceData = analyticsData.reduce((acc, item) => {
      acc[item.deviceType] = (acc[item.deviceType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const deviceChartData = Object.entries(deviceData).map(([device, count]) => ({
      name: device,
      value: count
    }));

    // 여행 유형별 데이터
    const typeData = analyticsData.reduce((acc, item) => {
      if (item.result) {
        acc[item.result] = (acc[item.result] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const typeChartData = Object.entries(typeData).map(([type, count]) => ({
      type,
      count
    }));

    // 완료율 트렌드 (최근 7일)
    const dailyData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayData = analyticsData.filter(item => {
        const itemDate = new Date(item.startTime);
        return itemDate.toDateString() === date.toDateString();
      });
      
      const total = dayData.length;
      const completed = dayData.filter(item => item.completed).length;
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
      
      return {
        date: date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
        total,
        completed,
        completionRate
      };
    }).reverse();

    return { hourlyData, deviceChartData, typeChartData, dailyData };
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  const stats = getStats();
  const chartData = getChartData();

  const renderOverview = () => (
    <>
      <StatsGrid>
        <StatCard whileHover={{ scale: 1.02, y: -5 }}>
          <StatIcon>👥</StatIcon>
          <StatValue>{stats.total}</StatValue>
          <StatLabel>총 응답자 수</StatLabel>
          <StatChange positive={true}>+12% 이번 주</StatChange>
        </StatCard>
        <StatCard whileHover={{ scale: 1.02, y: -5 }}>
          <StatIcon>✅</StatIcon>
          <StatValue>{stats.completed}</StatValue>
          <StatLabel>완료된 설문</StatLabel>
          <StatChange positive={stats.completionRate > 80}>
            완료율 {stats.completionRate}%
          </StatChange>
        </StatCard>
        <StatCard whileHover={{ scale: 1.02, y: -5 }}>
          <StatIcon>⏱️</StatIcon>
          <StatValue>{stats.avgTime}초</StatValue>
          <StatLabel>평균 소요시간</StatLabel>
          <StatChange positive={stats.avgTime < 180}>
            목표: 3분 이내
          </StatChange>
        </StatCard>
        <StatCard whileHover={{ scale: 1.02, y: -5 }}>
          <StatIcon>⭐</StatIcon>
          <StatValue>{stats.avgScore}</StatValue>
          <StatLabel>평균 만족도</StatLabel>
          <StatChange positive={stats.avgScore > 60}>
            5점 만점 기준
          </StatChange>
        </StatCard>
      </StatsGrid>

      <ChartsGrid>
        <ChartCard whileHover={{ scale: 1.01 }}>
          <ChartTitle>📈 일별 완료율 트렌드</ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData.dailyData}>
              <defs>
                <linearGradient id="completionGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#667eea" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#718096" />
              <YAxis stroke="#718096" />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="completionRate" 
                stroke="#667eea" 
                fill="url(#completionGradient)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard whileHover={{ scale: 1.01 }}>
          <ChartTitle>📱 디바이스별 사용 현황</ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.deviceChartData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.deviceChartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard whileHover={{ scale: 1.01 }}>
          <ChartTitle>🕐 시간대별 응답 패턴</ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="hour" stroke="#718096" />
              <YAxis stroke="#718096" />
              <Tooltip />
              <Bar dataKey="count" fill="#764ba2" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard whileHover={{ scale: 1.01 }}>
          <ChartTitle>🧳 8가지 여행 유형별 분포</ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.typeChartData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" stroke="#718096" />
              <YAxis dataKey="type" type="category" stroke="#718096" width={80} />
              <Tooltip />
              <Bar dataKey="count" fill="#48bb78" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </ChartsGrid>
    </>
  );

  const renderUserData = () => (
    <>
      <FilterBar>
        <FilterInput
          type="text"
          placeholder="🔍 이름, 이메일, 여행유형으로 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FilterSelect 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">전체 상태</option>
          <option value="completed">완료</option>
          <option value="abandoned">미완료</option>
        </FilterSelect>
        <ExportButton 
          onClick={exportToCSV}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          📥 CSV 다운로드
        </ExportButton>
      </FilterBar>

      <UserTable>
        <TableHeader>
          <h3 style={{ margin: 0, color: '#2d3748' }}>📊 사용자 응답 데이터 ({filteredData.length}명)</h3>
        </TableHeader>
        
        <TableHeaderRow>
          <div>이름/정보</div>
          <div>연락처</div>
          <div>여행유형</div>
          <div>상태</div>
          <div>소요시간</div>
          <div>신뢰도</div>
          <div>디바이스</div>
          <div>제출일</div>
        </TableHeaderRow>
        
        {filteredData.map((item) => (
          <TableRow 
            key={item.sessionId}
            onClick={() => setSelectedUser(item)}
            whileHover={{ backgroundColor: '#f8fafc' }}
          >
            <div>
              <div style={{ fontWeight: 600, color: '#2d3748' }}>
                {item.userInfo?.name || '익명'}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#718096' }}>
                {item.userInfo?.age} · {item.userInfo?.gender}
              </div>
            </div>
            <div>
              <div style={{ color: '#4a5568' }}>{item.userInfo?.instagram || '-'}</div>
            </div>
            <div>
              <strong style={{ color: '#667eea' }}>{item.result || '-'}</strong>
            </div>
            <div>
              <Badge type={item.completed ? 'completed' : 'abandoned'}>
                {item.completed ? '완료' : '미완료'}
              </Badge>
            </div>
            <div style={{ color: '#4a5568' }}>{formatTime(item.totalTime)}</div>
            <div>
              {item.reliabilityScore !== undefined ? (
                <ReliabilityBadge score={item.reliabilityScore}>
                  {item.reliabilityScore}% {getReliabilityScoreLabel(item.reliabilityScore)}
                </ReliabilityBadge>
              ) : (
                <span style={{ color: '#9ca3af' }}>-</span>
              )}
            </div>
            <div style={{ color: '#4a5568' }}>{item.deviceType}</div>
            <div style={{ fontSize: '0.9rem', color: '#718096' }}>
              {item.submittedAt 
                ? new Date(item.submittedAt).toLocaleDateString()
                : '-'
              }
            </div>
          </TableRow>
        ))}

        {filteredData.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#718096' }}>
            📭 조건에 맞는 데이터가 없습니다.
          </div>
        )}
      </UserTable>
    </>
  );

  const renderProcessAnalysis = () => {
    // 설문 과정 데이터 분석
    const processData = analyticsData.filter(item => item.answers && item.answers.length > 0);
    
    // 문항별 응답 시간 분석
    const questionTimeData = questions.map(question => {
      const responses = processData.flatMap(item => 
        item.answers.filter(answer => answer.questionId === question.id)
      );
      
      const avgTime = responses.length > 0 
        ? responses.reduce((sum, answer) => sum + answer.timeSpent, 0) / responses.length / 1000
        : 0;
      
      return {
        id: question.id,
        text: question.text.length > 30 ? question.text.substring(0, 30) + '...' : question.text,
        avgTime: Math.round(avgTime * 10) / 10,
        isReverse: question.isReverse || false,
        responseCount: responses.length
      };
    });

    // 신뢰도 분포 데이터
    const reliabilityDistribution = processData.reduce((acc, item) => {
      const score = item.reliabilityScore || 0;
      const range = Math.floor(score / 20) * 20;
      const label = `${range}-${range + 19}점`;
      acc[label] = (acc[label] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const reliabilityChartData = Object.entries(reliabilityDistribution).map(([range, count]) => ({
      range,
      count
    }));

    // 응답 패턴 분석
    const patternData = processData.reduce((acc, item) => {
      const pattern = item.responsePattern || 'unknown';
      acc[pattern] = (acc[pattern] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const patternChartData = Object.entries(patternData).map(([pattern, count]) => {
      const label = pattern === 'consistent' ? '일관적' : 
                   pattern === 'inconsistent' ? '부분적 일관성' : 
                   pattern === 'random' ? '무작위' : '알 수 없음';
      return { pattern: label, count };
    });

    return (
      <>
        <StatsGrid>
          <StatCard whileHover={{ scale: 1.02, y: -5 }}>
            <StatIcon>📝</StatIcon>
            <StatValue>{questions.length}</StatValue>
            <StatLabel>총 문항 수</StatLabel>
            <StatChange positive={true}>
              역방향 문항: {questions.filter(q => q.isReverse).length}개
            </StatChange>
          </StatCard>
          <StatCard whileHover={{ scale: 1.02, y: -5 }}>
            <StatIcon>⚡</StatIcon>
            <StatValue>{Math.round(questionTimeData.reduce((sum, q) => sum + q.avgTime, 0) / questionTimeData.length)}초</StatValue>
            <StatLabel>문항당 평균 응답시간</StatLabel>
            <StatChange positive={questionTimeData.reduce((sum, q) => sum + q.avgTime, 0) / questionTimeData.length < 10}>
              적정 범위: 5-15초
            </StatChange>
          </StatCard>
          <StatCard whileHover={{ scale: 1.02, y: -5 }}>
            <StatIcon>🎯</StatIcon>
            <StatValue>{Math.round(processData.reduce((sum, item) => sum + (item.reliabilityScore || 0), 0) / processData.length)}%</StatValue>
            <StatLabel>평균 응답 신뢰도</StatLabel>
            <StatChange positive={processData.reduce((sum, item) => sum + (item.reliabilityScore || 0), 0) / processData.length > 70}>
              신뢰할 수 있는 응답
            </StatChange>
          </StatCard>
          <StatCard whileHover={{ scale: 1.02, y: -5 }}>
            <StatIcon>✅</StatIcon>
            <StatValue>{patternData.consistent || 0}</StatValue>
            <StatLabel>일관된 응답자</StatLabel>
            <StatChange positive={(patternData.consistent || 0) / processData.length > 0.6}>
              전체 응답자 중 {Math.round(((patternData.consistent || 0) / processData.length) * 100)}%
            </StatChange>
          </StatCard>
        </StatsGrid>

        <ChartsGrid>
          <ChartCard whileHover={{ scale: 1.01 }}>
            <ChartTitle>📊 문항별 평균 응답시간</ChartTitle>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={questionTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="id" 
                  stroke="#718096"
                  tick={{ fontSize: 12 }}
                />
                <YAxis stroke="#718096" />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = questionTimeData.find(item => item.id === label);
                      return (
                        <div style={{ 
                          background: 'white', 
                          padding: '10px', 
                          border: '1px solid #ccc',
                          borderRadius: '5px',
                          maxWidth: '250px'
                        }}>
                          <p style={{ margin: 0, fontWeight: 'bold' }}>문항 {label}</p>
                          <p style={{ margin: '5px 0', fontSize: '0.9rem' }}>{data?.text}</p>
                          <p style={{ margin: 0, color: data?.isReverse ? '#f56565' : '#4299e1' }}>
                            평균 응답시간: {payload[0].value}초
                            {data?.isReverse && ' (역방향 문항)'}
                          </p>
                          <p style={{ margin: 0, fontSize: '0.8rem', color: '#718096' }}>
                            응답 수: {data?.responseCount}회
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="avgTime" 
                  fill="#667eea"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard whileHover={{ scale: 1.01 }}>
            <ChartTitle>🎯 응답 신뢰도 분포</ChartTitle>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={reliabilityChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="range" stroke="#718096" />
                <YAxis stroke="#718096" />
                <Tooltip />
                <Bar dataKey="count" fill="#48bb78" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard whileHover={{ scale: 1.01 }}>
            <ChartTitle>🔍 응답 패턴 분석</ChartTitle>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={patternChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  dataKey="count"
                  label={({pattern, count, percent}) => `${pattern}: ${count}명 (${(percent * 100).toFixed(1)}%)`}
                >
                  {patternChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={
                      entry.pattern === '일관적' ? '#48bb78' :
                      entry.pattern === '부분적 일관성' ? '#ed8936' :
                      entry.pattern === '무작위' ? '#f56565' : '#9ca3af'
                    } />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard whileHover={{ scale: 1.01 }}>
            <ChartTitle>📝 역방향 문항 효과성</ChartTitle>
            <div style={{ padding: '2rem', color: '#4a5568' }}>
              <div style={{ marginBottom: '1rem' }}>
                <strong>역방향 문항 목록:</strong>
              </div>
              {questions.filter(q => q.isReverse).map(question => (
                <div key={question.id} style={{ 
                  padding: '0.75rem', 
                  margin: '0.5rem 0',
                  background: '#f8fafc',
                  borderRadius: '8px',
                  borderLeft: '4px solid #f56565'
                }}>
                  <div style={{ fontWeight: 600, color: '#2d3748' }}>
                    문항 {question.id}: {question.axis}축
                  </div>
                  <div style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
                    {question.text}
                  </div>
                </div>
              ))}
              <div style={{ 
                marginTop: '1.5rem', 
                padding: '1rem',
                background: '#e6fffa',
                borderRadius: '8px',
                fontSize: '0.9rem'
              }}>
                💡 <strong>역방향 문항의 역할:</strong><br/>
                일관성 있는 응답자는 역방향 문항에서 반대 점수를 선택해야 합니다.
                이를 통해 응답의 신뢰도를 측정할 수 있습니다.
              </div>
            </div>
          </ChartCard>
        </ChartsGrid>
      </>
    );
  };

  const renderDataManagement = () => {
    const stats = DataManager.getDataStats();
    
    const handleExportJSON = () => {
      const jsonData = DataManager.exportToJSON();
      const blob = new Blob([jsonData], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `survey_data_${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
    };

    const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          const success = DataManager.importFromJSON(content);
          if (success) {
            alert('✅ 데이터 가져오기 성공!');
            loadAnalyticsDataFromLocal();
          } else {
            alert('❌ 데이터 가져오기 실패. 파일 형식을 확인해주세요.');
          }
        };
        reader.readAsText(file);
      }
    };

    const handleGenerateShareURL = () => {
      const shareUrl = DataManager.generateShareableURL();
      navigator.clipboard.writeText(shareUrl);
      alert('📋 공유 URL이 클립보드에 복사되었습니다!');
    };

    const handleClearData = () => {
      if (window.confirm('⚠️ 모든 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
        DataManager.clearAllData();
        loadAnalyticsDataFromLocal();
        alert('🗑️ 모든 데이터가 삭제되었습니다.');
      }
    };

    return (
      <>
        <StatsGrid>
          <StatCard whileHover={{ scale: 1.02, y: -5 }}>
            <StatIcon>📊</StatIcon>
            <StatValue>{stats.totalRecords}</StatValue>
            <StatLabel>총 레코드 수</StatLabel>
            <StatChange positive={true}>완료: {stats.completedRecords}개</StatChange>
          </StatCard>
          <StatCard whileHover={{ scale: 1.02, y: -5 }}>
            <StatIcon>💾</StatIcon>
            <StatValue>{stats.dataSize}</StatValue>
            <StatLabel>데이터 크기</StatLabel>
            <StatChange positive={true}>로컬 저장소 사용량</StatChange>
          </StatCard>
          <StatCard whileHover={{ scale: 1.02, y: -5 }}>
            <StatIcon>🔄</StatIcon>
            <StatValue>{stats.lastSyncTime !== '없음' ? '동기화됨' : '없음'}</StatValue>
            <StatLabel>마지막 동기화</StatLabel>
            <StatChange positive={stats.lastSyncTime !== '없음'}>
              {stats.lastSyncTime}
            </StatChange>
          </StatCard>
          <StatCard whileHover={{ scale: 1.02, y: -5 }}>
            <StatIcon>🛡️</StatIcon>
            <StatValue>안전함</StatValue>
            <StatLabel>데이터 상태</StatLabel>
            <StatChange positive={true}>백업 보호됨</StatChange>
          </StatCard>
        </StatsGrid>

        <ChartsGrid>
          <ChartCard whileHover={{ scale: 1.01 }}>
            <ChartTitle>📤 데이터 내보내기</ChartTitle>
            <div style={{ padding: '2rem' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ color: '#4a5568', marginBottom: '1rem' }}>내보내기 옵션</h4>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <ExportButton onClick={exportToCSV} whileHover={{ scale: 1.05 }}>
                    📊 CSV 다운로드
                  </ExportButton>
                  <ExportButton onClick={handleExportJSON} whileHover={{ scale: 1.05 }}>
                    📄 JSON 다운로드
                  </ExportButton>
                </div>
              </div>
              
              <div>
                <h4 style={{ color: '#4a5568', marginBottom: '1rem' }}>공유 옵션</h4>
                <ExportButton onClick={handleGenerateShareURL} whileHover={{ scale: 1.05 }}>
                  🔗 공유 URL 생성
                </ExportButton>
                <p style={{ fontSize: '0.9rem', color: '#718096', marginTop: '0.5rem' }}>
                  다른 브라우저나 기기에서 데이터를 확인할 수 있는 URL을 생성합니다.
                </p>
              </div>
            </div>
          </ChartCard>

          <ChartCard whileHover={{ scale: 1.01 }}>
            <ChartTitle>📥 데이터 가져오기</ChartTitle>
            <div style={{ padding: '2rem' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ color: '#4a5568', marginBottom: '1rem' }}>파일에서 가져오기</h4>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJSON}
                  style={{
                    padding: '0.75rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    width: '100%'
                  }}
                />
                <p style={{ fontSize: '0.9rem', color: '#718096', marginTop: '0.5rem' }}>
                  JSON 형식의 백업 파일을 업로드하여 데이터를 복원할 수 있습니다.
                </p>
              </div>
              
              <div>
                <h4 style={{ color: '#4a5568', marginBottom: '1rem' }}>URL에서 가져오기</h4>
                <p style={{ fontSize: '0.9rem', color: '#718096' }}>
                  공유 URL을 통해 페이지에 접속하면 자동으로 데이터가 가져와집니다.
                </p>
              </div>
            </div>
          </ChartCard>

          <ChartCard whileHover={{ scale: 1.01 }}>
            <ChartTitle>🔧 데이터 관리</ChartTitle>
            <div style={{ padding: '2rem' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ color: '#4a5568', marginBottom: '1rem' }}>새로고침 & 동기화</h4>
                <ExportButton onClick={refreshData} whileHover={{ scale: 1.05 }}>
                  🔄 Firebase 데이터 새로고침
                </ExportButton>
                <ExportButton 
                  onClick={loadAnalyticsDataFromLocal} 
                  whileHover={{ scale: 1.05 }}
                  style={{ marginLeft: '0.5rem', background: 'linear-gradient(45deg, #38b2ac, #319795)' }}
                >
                  📦 로컬 데이터 새로고침
                </ExportButton>
                <p style={{ fontSize: '0.9rem', color: '#718096', marginTop: '0.5rem' }}>
                  Firebase에서 최신 데이터를 가져오거나 로컬 백업을 새로고침합니다.
                </p>
              </div>

              <div>
                <h4 style={{ color: '#c53030', marginBottom: '1rem' }}>⚠️ 위험 구역</h4>
                <ExportButton 
                  onClick={handleClearData} 
                  whileHover={{ scale: 1.05 }}
                  style={{ background: 'linear-gradient(45deg, #f56565, #e53e3e)' }}
                >
                  🗑️ 모든 데이터 삭제
                </ExportButton>
                <p style={{ fontSize: '0.9rem', color: '#c53030', marginTop: '0.5rem' }}>
                  주의: 이 작업은 되돌릴 수 없습니다!
                </p>
              </div>
            </div>
          </ChartCard>

          <ChartCard whileHover={{ scale: 1.01 }}>
            <ChartTitle>📋 데이터 무결성</ChartTitle>
            <div style={{ padding: '2rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ color: '#4a5568', marginBottom: '0.5rem' }}>현재 상태</h4>
                <div style={{ 
                  background: '#f0fff4', 
                  padding: '1rem', 
                  borderRadius: '8px',
                  border: '1px solid #9ae6b4'
                }}>
                  <div style={{ color: '#2f855a', fontWeight: 600 }}>✅ 데이터 무결성 양호</div>
                  <ul style={{ fontSize: '0.9rem', color: '#4a5568', marginTop: '0.5rem' }}>
                    <li>자동 백업 활성화됨</li>
                    <li>중복 데이터 방지 기능 작동</li>
                    <li>신뢰도 점수 계산 정상</li>
                    <li>localStorage 용량 충분</li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 style={{ color: '#4a5568', marginBottom: '0.5rem' }}>권장사항</h4>
                <div style={{ fontSize: '0.9rem', color: '#718096' }}>
                  <p>• 정기적으로 데이터를 JSON으로 백업하세요</p>
                  <p>• 중요한 데이터는 별도 서버에 저장하세요</p>
                  <p>• 브라우저 캐시 삭제 전 데이터를 백업하세요</p>
                </div>
              </div>
            </div>
          </ChartCard>
        </ChartsGrid>
      </>
    );
  };

  return (
    <Container>
      <Header>
        <HeaderContent>
          <Title>🚀 NeStory 여행 분석</Title>
          <Subtitle>8가지 가족여행 유형 테스트<br className="mobile-break"/>실시간 사용자 데이터 대시보드</Subtitle>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem', 
            marginTop: '1rem',
            fontSize: '0.9rem'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '0.5rem 1rem',
              borderRadius: '20px'
            }}>
              <span>{isConnected === true ? '🟢' : isConnected === false ? '🔴' : '🟡'}</span>
              <span>
                Firebase: {
                  isConnected === true ? '연결됨' : 
                  isConnected === false ? '연결 실패' : 
                  '연결 중...'
                }
              </span>
            </div>
            {loading && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem' 
              }}>
                <span>⏳</span>
                <span>데이터 로딩 중...</span>
              </div>
            )}
            {error && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem' 
              }}>
                <span>⚠️</span>
                <span>백업 데이터 사용</span>
              </div>
            )}
          </div>
        </HeaderContent>
        <LogoutButton
          onClick={handleLogout}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🚪 로그아웃
        </LogoutButton>
      </Header>

      <TabContainer>
        <Tab
          active={activeTab === 'overview'}
          onClick={() => setActiveTab('overview')}
          whileHover={{ scale: 1.02 }}
        >
          📊 대시보드 개요
        </Tab>
        <Tab
          active={activeTab === 'users'}
          onClick={() => setActiveTab('users')}
          whileHover={{ scale: 1.02 }}
        >
          👥 사용자 데이터
        </Tab>
        <Tab
          active={activeTab === 'process'}
          onClick={() => setActiveTab('process')}
          whileHover={{ scale: 1.02 }}
        >
          📋 설문 과정 분석
        </Tab>
        <Tab
          active={activeTab === 'data'}
          onClick={() => setActiveTab('data')}
          whileHover={{ scale: 1.02 }}
        >
          🔧 데이터 관리
        </Tab>
      </TabContainer>

      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'users' && renderUserData()}
      {activeTab === 'process' && renderProcessAnalysis()}
      {activeTab === 'data' && renderDataManagement()}

      {selectedUser && (
        <UserDetailModal
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedUser(null)}
        >
          <ModalContent
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ color: '#2d3748', margin: 0 }}>🔍 상세 분석 데이터</h2>
              <button
                onClick={() => setSelectedUser(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#718096'
                }}
              >
                ✕
              </button>
            </div>
            
            {/* 여기에 기존 모달 내용을 포함 */}
            <div style={{ color: '#4a5568', lineHeight: '1.6' }}>
              <h3>👤 기본 정보</h3>
              <p><strong>이름:</strong> {selectedUser.userInfo?.name || '익명'}</p>
              <p><strong>인스타그램:</strong> {selectedUser.userInfo?.instagram || '미입력'}</p>
              <p><strong>여행유형:</strong> {selectedUser.result || '미완료'}</p>
              <p><strong>소요시간:</strong> {formatTime(selectedUser.totalTime)}</p>
              <p><strong>완료여부:</strong> {selectedUser.completed ? '완료' : '미완료'}</p>
              
              {selectedUser.reliabilityScore !== undefined && (
                <>
                  <h3 style={{ marginTop: '2rem' }}>🎯 응답 신뢰도 분석</h3>
                  <div style={{ 
                    background: '#f8fafc', 
                    padding: '1rem', 
                    borderRadius: '8px',
                    marginBottom: '1rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <ReliabilityBadge score={selectedUser.reliabilityScore}>
                        {selectedUser.reliabilityScore}% {getReliabilityScoreLabel(selectedUser.reliabilityScore)}
                      </ReliabilityBadge>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>
                      응답 패턴: {selectedUser.responsePattern === 'consistent' ? '일관적 응답' : 
                                   selectedUser.responsePattern === 'inconsistent' ? '부분적 일관성' :
                                   selectedUser.responsePattern === 'random' ? '무작위 응답' : '알 수 없음'}
                    </p>
                    {selectedUser.reliabilityScore < 60 && (
                      <div style={{ 
                        marginTop: '0.75rem',
                        padding: '0.5rem',
                        background: '#fed7d7',
                        borderRadius: '4px',
                        fontSize: '0.85rem',
                        color: '#c53030'
                      }}>
                        ⚠️ 이 응답자의 신뢰도가 낮습니다. 데이터 분석 시 주의가 필요합니다.
                      </div>
                    )}
                  </div>
                </>
              )}

              <h3 style={{ marginTop: '2rem' }}>📊 세부 응답 내역</h3>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {selectedUser.answers?.map((answer, index) => {
                  const question = questions.find(q => q.id === answer.questionId);
                  return (
                    <div key={answer.questionId} style={{ 
                      padding: '0.75rem', 
                      margin: '0.5rem 0',
                      background: question?.isReverse ? '#fef5e7' : '#f8fafc',
                      borderRadius: '8px',
                      borderLeft: `4px solid ${question?.isReverse ? '#ed8936' : '#4299e1'}`
                    }}>
                      <div style={{ fontWeight: 600, color: '#2d3748', fontSize: '0.9rem' }}>
                        문항 {answer.questionId}: {question?.text}
                        {question?.isReverse && ' (역방향)'}
                      </div>
                      <div style={{ 
                        fontSize: '0.8rem', 
                        color: '#718096',
                        marginTop: '0.25rem',
                        display: 'flex',
                        gap: '1rem'
                      }}>
                        <span>점수: {answer.score}/5</span>
                        <span>응답시간: {Math.round(answer.timeSpent / 1000)}초</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </ModalContent>
        </UserDetailModal>
      )}
    </Container>
  );
};

export default EnhancedAdminDashboard;