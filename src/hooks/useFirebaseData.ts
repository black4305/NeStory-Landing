import { useState, useEffect } from 'react';
import { AnalyticsData } from '../types';
import { FirebaseService } from '../services/firebase';

export const useFirebaseData = () => {
  const [data, setData] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statistics, setStatistics] = useState({
    total: 0,
    completed: 0,
    today: 0,
    thisWeek: 0
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Firebase 연결 테스트
      const isConnected = await FirebaseService.testConnection();
      if (!isConnected) {
        throw new Error('Firebase 연결 실패');
      }

      // 데이터 로드
      const [surveyData, stats] = await Promise.all([
        FirebaseService.getAllSurveyResults(),
        FirebaseService.getStatistics()
      ]);

      setData(surveyData);
      setStatistics(stats);
      
      console.log(`✅ Firebase에서 ${surveyData.length}개 데이터 로드 완료`);
    } catch (err) {
      console.error('❌ Firebase 데이터 로드 실패:', err);
      setError(err instanceof Error ? err.message : 'Firebase 연결에 실패했습니다.');
      
      // Firebase 실패 시 localStorage에서 데이터 로드
      try {
        const localData = JSON.parse(localStorage.getItem('surveyAnalytics') || '[]');
        setData(localData);
        setStatistics({
          total: localData.length,
          completed: localData.filter((item: AnalyticsData) => item.completed).length,
          today: 0,
          thisWeek: 0
        });
        console.log('📦 localStorage에서 백업 데이터 로드');
      } catch (localError) {
        console.error('❌ localStorage 백업도 실패:', localError);
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    await loadData();
  };

  const getCompletedData = () => {
    return data.filter(item => item.completed);
  };

  const getDataByDateRange = (startDate: Date, endDate: Date) => {
    return data.filter(item => {
      const itemDate = new Date(item.submittedAt || 0);
      return itemDate >= startDate && itemDate <= endDate;
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    data,
    loading,
    error,
    statistics,
    refreshData,
    getCompletedData,
    getDataByDateRange
  };
};

// Firebase 상태 모니터링 Hook
export const useFirebaseStatus = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkConnection = async () => {
    try {
      const connected = await FirebaseService.testConnection();
      setIsConnected(connected);
      setLastChecked(new Date());
      return connected;
    } catch (error) {
      setIsConnected(false);
      setLastChecked(new Date());
      return false;
    }
  };

  useEffect(() => {
    checkConnection();
    // 5분마다 연결 상태 확인
    const interval = setInterval(checkConnection, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    isConnected,
    lastChecked,
    checkConnection
  };
};