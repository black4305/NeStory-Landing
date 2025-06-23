import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { AnalyticsData } from '../types';

const Container = styled.div`
  min-height: 100vh;
  background: #f8f9fa;
  padding: 2rem;
`;

const Header = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #2d3748;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #4a5568;
  font-size: 1.1rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  color: #667eea;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: #4a5568;
  font-weight: 600;
`;

const Section = styled.div`
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  overflow: hidden;
`;

const SectionHeader = styled.div`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 1.5rem 2rem;
  font-size: 1.3rem;
  font-weight: 700;
`;

const SectionContent = styled.div`
  padding: 2rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  background: #f8f9fa;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #2d3748;
  border-bottom: 2px solid #e2e8f0;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background: #f8f9fa;
  }
  
  &:hover {
    background: #e8f4fd;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  color: #4a5568;
`;

const FilterBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const FilterSelect = styled.select`
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const SearchInput = styled.input`
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  flex: 1;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const ExportButton = styled(motion.button)`
  background: linear-gradient(45deg, #28a745, #20c997);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
`;

const Badge = styled.span<{ type: 'completed' | 'abandoned' | 'active' }>`
  background: ${props => {
    switch (props.type) {
      case 'completed': return '#d4edda';
      case 'abandoned': return '#f8d7da';
      case 'active': return '#d1ecf1';
      default: return '#e2e8f0';
    }
  }};
  color: ${props => {
    switch (props.type) {
      case 'completed': return '#155724';
      case 'abandoned': return '#721c24';
      case 'active': return '#0c5460';
      default: return '#2d3748';
    }
  }};
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const AdminDashboard: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [filteredData, setFilteredData] = useState<AnalyticsData[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<AnalyticsData | null>(null);

  const loadAnalyticsData = () => {
    const stored = localStorage.getItem('surveyAnalytics');
    if (stored) {
      const data = JSON.parse(stored);
      setAnalyticsData(data);
    }
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
    loadAnalyticsData();
  }, []);

  useEffect(() => {
    filterData();
  }, [filterData]);

  const exportToCSV = () => {
    const headers = [
      '세션ID', '이름', '전화번호', '이메일', '연령대', '성별', '가족구성원', '지역',
      '여행유형', '완료여부', '소요시간(초)', '클릭수', '스크롤깊이(%)', '디바이스',
      '마케팅동의', '제출일시'
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

    return { total, completed, avgTime, completionRate };
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  const stats = getStats();

  const UserDetailModal = () => {
    if (!selectedUser) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }}
        onClick={() => setSelectedUser(null)}
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '2rem',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ color: '#2d3748', margin: 0 }}>📊 상세 분석 데이터</h2>
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

          {/* 기본 정보 */}
          <Section style={{ marginBottom: '1.5rem' }}>
            <SectionHeader style={{ padding: '1rem', fontSize: '1.1rem' }}>👤 사용자 기본 정보</SectionHeader>
            <SectionContent style={{ padding: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <strong>이름:</strong> {selectedUser.userInfo?.name || '익명'}
                </div>
                <div>
                  <strong>인스타그램:</strong> {selectedUser.userInfo?.instagram || '미입력'}
                </div>
                <div>
                  <strong>연령대:</strong> {selectedUser.userInfo?.age || '미입력'}
                </div>
                <div>
                  <strong>성별:</strong> {selectedUser.userInfo?.gender || '미입력'}
                </div>
                <div>
                  <strong>가족구성원:</strong> {selectedUser.userInfo?.familySize || '미입력'}명
                </div>
                <div>
                  <strong>거주지역:</strong> {selectedUser.userInfo?.region || '미입력'}
                </div>
                <div>
                  <strong>마케팅 동의:</strong> {selectedUser.userInfo?.marketingConsent ? '동의' : '비동의'}
                </div>
              </div>
            </SectionContent>
          </Section>

          {/* 설문 결과 */}
          <Section style={{ marginBottom: '1.5rem' }}>
            <SectionHeader style={{ padding: '1rem', fontSize: '1.1rem' }}>🎯 설문 결과</SectionHeader>
            <SectionContent style={{ padding: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ textAlign: 'center', background: '#f8f9fa', padding: '1rem', borderRadius: '10px' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>
                    {selectedUser.result || '미완료'}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#4a5568' }}>여행 유형</div>
                </div>
                <div style={{ textAlign: 'center', background: '#f8f9fa', padding: '1rem', borderRadius: '10px' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#28a745' }}>
                    {selectedUser.answers.length}/15
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#4a5568' }}>답변 완료</div>
                </div>
              </div>
              
              {/* 개별 답변 상세 */}
              <div>
                <h4 style={{ marginBottom: '1rem' }}>📝 개별 답변 상세</h4>
                <div style={{ maxHeight: '200px', overflow: 'auto' }}>
                  {selectedUser.answers.map((answer, index) => (
                    <div key={answer.questionId} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      padding: '0.5rem', 
                      borderBottom: '1px solid #e2e8f0',
                      fontSize: '0.9rem'
                    }}>
                      <span>질문 {answer.questionId}</span>
                      <span>점수: {answer.score}/5</span>
                      <span>응답시간: {Math.round(answer.timeSpent/1000)}초</span>
                    </div>
                  ))}
                </div>
              </div>
            </SectionContent>
          </Section>

          {/* 행동 데이터 */}
          <Section>
            <SectionHeader style={{ padding: '1rem', fontSize: '1.1rem' }}>📱 행동 분석 데이터</SectionHeader>
            <SectionContent style={{ padding: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ textAlign: 'center', background: '#e8f4fd', padding: '1rem', borderRadius: '10px' }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#0c5460' }}>
                    {formatTime(selectedUser.totalTime)}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#0c5460' }}>총 소요시간</div>
                </div>
                <div style={{ textAlign: 'center', background: '#e8f4fd', padding: '1rem', borderRadius: '10px' }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#0c5460' }}>
                    {selectedUser.clickCount}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#0c5460' }}>총 클릭수</div>
                </div>
                <div style={{ textAlign: 'center', background: '#e8f4fd', padding: '1rem', borderRadius: '10px' }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#0c5460' }}>
                    {selectedUser.scrollDepth}%
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#0c5460' }}>스크롤 깊이</div>
                </div>
                <div style={{ textAlign: 'center', background: '#e8f4fd', padding: '1rem', borderRadius: '10px' }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#0c5460' }}>
                    {selectedUser.deviceType}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#0c5460' }}>디바이스</div>
                </div>
              </div>

              {/* 세션 정보 */}
              <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '10px' }}>
                <h5 style={{ marginBottom: '0.5rem' }}>🔍 세션 정보</h5>
                <div style={{ fontSize: '0.85rem', color: '#4a5568', lineHeight: '1.6' }}>
                  <div><strong>세션 ID:</strong> {selectedUser.sessionId}</div>
                  <div><strong>시작 시간:</strong> {new Date(selectedUser.startTime).toLocaleString()}</div>
                  <div><strong>완료 시간:</strong> {selectedUser.submittedAt ? new Date(selectedUser.submittedAt).toLocaleString() : '미완료'}</div>
                  <div><strong>User Agent:</strong> {selectedUser.userAgent}</div>
                </div>
              </div>

              {/* 패턴 분석 */}
              <div style={{ marginTop: '1rem', background: '#fff3cd', padding: '1rem', borderRadius: '10px' }}>
                <h5 style={{ marginBottom: '0.5rem' }}>📈 응답 패턴 분석</h5>
                <div style={{ fontSize: '0.85rem', color: '#856404' }}>
                  <div>평균 응답시간: {selectedUser.answers.length > 0 ? Math.round(selectedUser.answers.reduce((sum, a) => sum + a.timeSpent, 0) / selectedUser.answers.length / 1000) : 0}초</div>
                  <div>가장 빠른 응답: {selectedUser.answers.length > 0 ? Math.round(Math.min(...selectedUser.answers.map(a => a.timeSpent)) / 1000) : 0}초</div>
                  <div>가장 느린 응답: {selectedUser.answers.length > 0 ? Math.round(Math.max(...selectedUser.answers.map(a => a.timeSpent)) / 1000) : 0}초</div>
                  <div>응답 일관성: {selectedUser.answers.length > 0 ? (selectedUser.answers.filter(a => a.score >= 4).length / selectedUser.answers.length * 100).toFixed(1) : 0}% (긍정 응답 비율)</div>
                </div>
              </div>
            </SectionContent>
          </Section>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <Container>
      <Header>
        <Title>🚀 가족여행 테스트 관리자 대시보드</Title>
        <Subtitle>실시간 사용자 응답 및 분석 데이터를 확인하세요</Subtitle>
      </Header>

      <StatsGrid>
        <StatCard whileHover={{ scale: 1.02 }}>
          <StatValue>{stats.total}</StatValue>
          <StatLabel>총 응답자 수</StatLabel>
        </StatCard>
        <StatCard whileHover={{ scale: 1.02 }}>
          <StatValue>{stats.completed}</StatValue>
          <StatLabel>완료된 설문</StatLabel>
        </StatCard>
        <StatCard whileHover={{ scale: 1.02 }}>
          <StatValue>{stats.completionRate}%</StatValue>
          <StatLabel>완료율</StatLabel>
        </StatCard>
        <StatCard whileHover={{ scale: 1.02 }}>
          <StatValue>{stats.avgTime}초</StatValue>
          <StatLabel>평균 소요시간</StatLabel>
        </StatCard>
      </StatsGrid>

      <Section>
        <SectionHeader>📊 사용자 응답 데이터</SectionHeader>
        <SectionContent>
          <FilterBar>
            <FilterSelect 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">전체</option>
              <option value="completed">완료</option>
              <option value="abandoned">미완료</option>
            </FilterSelect>
            
            <SearchInput
              type="text"
              placeholder="이름, 이메일, 유형으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <ExportButton 
              onClick={exportToCSV}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              📥 CSV 다운로드
            </ExportButton>
          </FilterBar>

          <Table>
            <thead>
              <tr>
                <TableHeader>이름</TableHeader>
                <TableHeader>연락처</TableHeader>
                <TableHeader>여행유형</TableHeader>
                <TableHeader>상태</TableHeader>
                <TableHeader>소요시간</TableHeader>
                <TableHeader>디바이스</TableHeader>
                <TableHeader>제출일시</TableHeader>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <TableRow 
                  key={item.sessionId}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedUser(item)}
                >
                  <TableCell>
                    <div>{item.userInfo?.name || '익명'}</div>
                    <div style={{ fontSize: '0.8rem', color: '#718096' }}>
                      {item.userInfo?.age} · {item.userInfo?.gender}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>{item.userInfo?.instagram || '-'}</div>
                  </TableCell>
                  <TableCell>
                    <strong>{item.result || '-'}</strong>
                  </TableCell>
                  <TableCell>
                    <Badge type={item.completed ? 'completed' : 'abandoned'}>
                      {item.completed ? '완료' : '미완료'}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatTime(item.totalTime)}</TableCell>
                  <TableCell>{item.deviceType}</TableCell>
                  <TableCell>
                    {item.submittedAt 
                      ? new Date(item.submittedAt).toLocaleDateString()
                      : '-'
                    }
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>

          {filteredData.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#718096' }}>
              데이터가 없습니다.
            </div>
          )}
        </SectionContent>
      </Section>

      {selectedUser && <UserDetailModal />}
    </Container>
  );
};

export default AdminDashboard;