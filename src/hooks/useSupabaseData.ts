import { useState, useEffect } from 'react';
import { AnalyticsData } from '../types';
import { SupabaseService } from '../services/supabase';

export const useSupabaseData = () => {
  const [data, setData] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statistics, setStatistics] = useState({
    total: 0,
    completed: 0,
    today: 0,
    thisWeek: 0
  });

  const calculateStatistics = (allData: AnalyticsData[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(now.setDate(now.getDate() - now.getDay()));

    return {
      total: allData.length,
      completed: allData.filter(item => item.completed).length,
      today: allData.filter(item => {
        const itemDate = new Date(item.submittedAt || 0);
        return itemDate >= today;
      }).length,
      thisWeek: allData.filter(item => {
        const itemDate = new Date(item.submittedAt || 0);
        return itemDate >= thisWeek;
      }).length
    };
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 새로운 nestory-landing 스키마에서 데이터 로드
      const surveyData = await SupabaseService.getNestoryLandingUserData();
      setData(surveyData);
      setStatistics(calculateStatistics(surveyData));
      
      console.log(`✅ Supabase에서 ${surveyData.length}개 데이터 로드 완료`);
    } catch (err) {
      console.error('❌ Supabase 데이터 로드 실패:', err);
      setError(err instanceof Error ? err.message : 'Supabase 연결에 실패했습니다.');
      
      // Supabase 실패 시 localStorage에서 데이터 로드
      try {
        const localData = JSON.parse(localStorage.getItem('surveyAnalytics') || '[]');
        setData(localData);
        setStatistics(calculateStatistics(localData));
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

  const deleteData = async (sessionId: string) => {
    try {
      // sessionId로 해당 데이터의 id 찾기
      const itemToDelete = data.find(item => item.sessionId === sessionId);
      if (!itemToDelete?.id) {
        console.error('❌ 삭제할 데이터의 ID를 찾을 수 없습니다.');
        return false;
      }

      const { SupabaseService } = await import('../services/supabase');
      const success = await SupabaseService.deleteNestoryLandingUserData(itemToDelete.id);
      if (success) {
        // 로컬 데이터에서도 제거
        setData(prevData => prevData.filter(item => item.sessionId !== sessionId));
        console.log('✅ 데이터 삭제 완료');
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ 데이터 삭제 실패:', error);
      return false;
    }
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
    getDataByDateRange,
    deleteData
  };
};

// Supabase 상태 모니터링 Hook
export const useSupabaseStatus = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkConnection = async () => {
    try {
      const { SupabaseService } = await import('../services/supabase');
      const connected = await SupabaseService.initializeDatabase();
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