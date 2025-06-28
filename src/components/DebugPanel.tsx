import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { SupabaseService } from '../services/supabase';
import { runFullDataFlowTest } from '../utils/testDataFlow';

const DebugPanelContainer = styled(motion.div)`
  position: fixed;
  bottom: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 15px;
  border-radius: 10px;
  font-size: 12px;
  max-width: 300px;
  z-index: 9999;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const DebugToggle = styled(motion.button)`
  position: fixed;
  bottom: 20px;
  left: 20px;
  background: rgba(102, 126, 234, 0.8);
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 20px;
  cursor: pointer;
  z-index: 10000;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(102, 126, 234, 1);
  }
`;

const DebugButton = styled.button`
  background: rgba(102, 126, 234, 0.8);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 5px;
  padding: 8px 12px;
  margin: 5px 5px 5px 0;
  font-size: 11px;
  cursor: pointer;
  
  &:hover {
    background: rgba(102, 126, 234, 1);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LogArea = styled.div`
  background: rgba(0, 0, 0, 0.5);
  padding: 10px;
  border-radius: 5px;
  max-height: 200px;
  overflow-y: auto;
  font-family: monospace;
  font-size: 10px;
  margin-top: 10px;
  white-space: pre-wrap;
`;

const StatusIndicator = styled.div<{ status: 'success' | 'error' | 'loading' | 'idle' }>`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;
  background: ${props => {
    switch (props.status) {
      case 'success': return '#10b981';
      case 'error': return '#ef4444';
      case 'loading': return '#f59e0b';
      default: return '#6b7280';
    }
  }};
`;

interface DebugPanelProps {
  show?: boolean;
}

const DebugPanel: React.FC<DebugPanelProps> = ({ show = false }) => {
  const [isOpen, setIsOpen] = useState(show);
  const [logs, setLogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'error' | 'loading'>('idle');

  // 개발 환경에서만 표시
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`].slice(-50)); // 최대 50개 로그
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const testConnection = async () => {
    setIsLoading(true);
    setTestStatus('loading');
    addLog('Supabase 연결 테스트 시작...');
    
    try {
      const connected = await SupabaseService.initializeDatabase();
      if (connected) {
        setTestStatus('success');
        addLog('✅ Supabase 연결 성공');
      } else {
        setTestStatus('error');
        addLog('❌ Supabase 연결 실패');
      }
    } catch (error) {
      setTestStatus('error');
      addLog(`💥 연결 테스트 오류: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const runDataFlowTest = async () => {
    setIsLoading(true);
    setTestStatus('loading');
    addLog('전체 데이터 플로우 테스트 시작...');
    
    // 콘솔 로그를 캡처하여 화면에 표시
    const originalLog = console.log;
    const originalError = console.error;
    
    console.log = (...args) => {
      addLog(args.join(' '));
      originalLog(...args);
    };
    
    console.error = (...args) => {
      addLog(`ERROR: ${args.join(' ')}`);
      originalError(...args);
    };
    
    try {
      await runFullDataFlowTest();
      setTestStatus('success');
      addLog('🎉 데이터 플로우 테스트 완료');
    } catch (error) {
      setTestStatus('error');
      addLog(`💥 테스트 실행 오류: ${error}`);
    } finally {
      console.log = originalLog;
      console.error = originalError;
      setIsLoading(false);
    }
  };

  const checkRecentData = async () => {
    setIsLoading(true);
    addLog('최근 데이터 조회 중...');
    
    try {
      const data = await SupabaseService.getAllUserData();
      addLog(`📊 총 ${data.length}개 데이터 발견`);
      
      if (data.length > 0) {
        const recent = data.slice(-3); // 최근 3개
        recent.forEach((item, index) => {
          addLog(`${index + 1}. ${item.sessionId} - ${item.completed ? '완료' : '미완료'} - ${item.result || 'N/A'}`);
        });
      } else {
        addLog('⚠️ 저장된 데이터가 없습니다.');
      }
    } catch (error) {
      addLog(`❌ 데이터 조회 실패: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DebugToggle
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        🔧
      </DebugToggle>

      <AnimatePresence>
        {isOpen && (
          <DebugPanelContainer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>
              <StatusIndicator status={testStatus} />
              Debug Panel (DEV)
            </div>
            
            <div>
              <DebugButton onClick={testConnection} disabled={isLoading}>
                연결 테스트
              </DebugButton>
              <DebugButton onClick={runDataFlowTest} disabled={isLoading}>
                전체 테스트
              </DebugButton>
              <DebugButton onClick={checkRecentData} disabled={isLoading}>
                최근 데이터
              </DebugButton>
              <DebugButton onClick={clearLogs}>
                로그 지우기
              </DebugButton>
            </div>

            <LogArea>
              {logs.length === 0 ? '로그가 없습니다...' : logs.join('\n')}
            </LogArea>
          </DebugPanelContainer>
        )}
      </AnimatePresence>
    </>
  );
};

export default DebugPanel;