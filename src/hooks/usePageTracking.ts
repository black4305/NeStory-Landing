import { useEffect, useRef, useState } from 'react';
import { SupabaseService } from '../services/supabase';

export interface PageViewData {
  page: string;
  timestamp: number;
  sessionId: string;
  visitId: string;
  duration?: number;
  scrollDepth?: number;
  interactions?: number;
  exitPoint?: string;
  deviceType: string;
  userAgent: string;
  referrer: string;
  viewportWidth: number;
  viewportHeight: number;
}

export interface PageKPIMetrics {
  pageViews: number;
  uniqueVisitors: number;
  averageTimeOnPage: number;
  bounceRate: number;
  scrollDepthAverage: number;
  interactionRate: number;
  exitRate: number;
  conversionRate: number;
}

export const usePageTracking = (pageName: string) => {
  const [metrics, setMetrics] = useState<PageKPIMetrics | null>(null);
  const startTime = useRef<number>(Date.now());
  const maxScrollDepth = useRef<number>(0);
  const interactionCount = useRef<number>(0);
  const sessionId = useRef<string>('');
  const visitId = useRef<string>('');

  // 세션 ID 생성 또는 가져오기
  useEffect(() => {
    sessionId.current = sessionStorage.getItem('sessionId') || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    visitId.current = sessionStorage.getItem('visitId') || `visit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    sessionStorage.setItem('sessionId', sessionId.current);
    sessionStorage.setItem('visitId', visitId.current);
  }, []);

  // 기기 타입 감지
  const getDeviceType = (): string => {
    const width = window.innerWidth;
    const userAgent = navigator.userAgent;
    
    if (/iPhone/.test(userAgent)) return 'iPhone';
    if (/iPad/.test(userAgent)) return 'iPad';
    if (/Android.*Mobile/.test(userAgent)) return 'Android Phone';
    if (/Android/.test(userAgent)) return 'Android Tablet';
    if (width <= 768) return 'Mobile';
    if (width <= 1024) return 'Tablet';
    return 'Desktop';
  };

  // 스크롤 깊이 추적
  useEffect(() => {
    const trackScrollDepth = () => {
      const scrollPercentage = Math.round(
        (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100
      );
      maxScrollDepth.current = Math.max(maxScrollDepth.current, scrollPercentage);
    };

    window.addEventListener('scroll', trackScrollDepth);
    return () => window.removeEventListener('scroll', trackScrollDepth);
  }, []);

  // 사용자 상호작용 추적
  useEffect(() => {
    const trackInteraction = () => {
      interactionCount.current += 1;
    };

    // 클릭, 키보드, 터치 이벤트 추적
    const events = ['click', 'keydown', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, trackInteraction);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, trackInteraction);
      });
    };
  }, []);

  // 페이지 뷰 데이터 저장
  const savePageView = async (exitPoint?: string) => {
    const pageViewData: PageViewData = {
      page: pageName,
      timestamp: startTime.current,
      sessionId: sessionId.current,
      visitId: visitId.current,
      duration: Date.now() - startTime.current,
      scrollDepth: maxScrollDepth.current,
      interactions: interactionCount.current,
      exitPoint,
      deviceType: getDeviceType(),
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight
    };

    try {
      await SupabaseService.savePageAnalytics(pageViewData);
    } catch (error) {
      console.error('페이지 분석 데이터 저장 실패:', error);
    }
  };

  // 페이지 진입 시 추적 시작
  useEffect(() => {
    startTime.current = Date.now();
    
    // 페이지 뷰 초기 저장
    savePageView();

    // 페이지 이탈 시 최종 데이터 저장
    const handleBeforeUnload = () => {
      savePageView('browser_close');
    };

    // 페이지 숨김 시 (탭 전환 등)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        savePageView('tab_hidden');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      // 컴포넌트 언마운트 시에도 저장
      savePageView('component_unmount');
    };
  }, [pageName]);

  // 페이지별 KPI 메트릭 계산
  const calculatePageMetrics = async (): Promise<PageKPIMetrics> => {
    try {
      const pageData = await SupabaseService.getPageAnalytics(pageName);
      
      const pageViews = pageData.length;
      const uniqueVisitors = new Set(pageData.map(item => item.visitId)).size;
      
      const averageTimeOnPage = pageViews > 0 
        ? Math.round(pageData.reduce((sum, item) => sum + (item.duration || 0), 0) / pageViews / 1000)
        : 0;
      
      const scrollDepthAverage = pageViews > 0
        ? Math.round(pageData.reduce((sum, item) => sum + (item.scrollDepth || 0), 0) / pageViews)
        : 0;
      
      // 바운스율 계산 (30초 미만 + 스크롤 25% 미만)
      const bounces = pageData.filter(item => 
        (item.duration || 0) < 30000 && (item.scrollDepth || 0) < 25
      ).length;
      const bounceRate = pageViews > 0 ? Math.round((bounces / pageViews) * 100) : 0;
      
      // 상호작용율 (클릭 1회 이상)
      const interacted = pageData.filter(item => (item.interactions || 0) > 0).length;
      const interactionRate = pageViews > 0 ? Math.round((interacted / pageViews) * 100) : 0;
      
      // 이탈율 (이 페이지에서 세션 종료)
      const exits = pageData.filter(item => 
        item.exitPoint === 'browser_close' || item.exitPoint === 'tab_hidden'
      ).length;
      const exitRate = pageViews > 0 ? Math.round((exits / pageViews) * 100) : 0;
      
      // 전환율 (CTA 클릭 등)
      const conversions = pageData.filter(item => (item.interactions || 0) > 3).length;
      const conversionRate = pageViews > 0 ? Math.round((conversions / pageViews) * 100) : 0;

      return {
        pageViews,
        uniqueVisitors,
        averageTimeOnPage,
        bounceRate,
        scrollDepthAverage,
        interactionRate,
        exitRate,
        conversionRate
      };
    } catch (error) {
      console.error('페이지 메트릭 계산 실패:', error);
      return {
        pageViews: 0,
        uniqueVisitors: 0,
        averageTimeOnPage: 0,
        bounceRate: 0,
        scrollDepthAverage: 0,
        interactionRate: 0,
        exitRate: 0,
        conversionRate: 0
      };
    }
  };

  // 실시간 메트릭 업데이트
  useEffect(() => {
    const updateMetrics = async () => {
      const newMetrics = await calculatePageMetrics();
      setMetrics(newMetrics);
    };

    // 초기 로드
    updateMetrics();

    // 30초마다 업데이트
    const interval = setInterval(updateMetrics, 30000);
    return () => clearInterval(interval);
  }, [pageName]);

  // CTA 클릭 추적 함수
  const trackCTAClick = async (ctaName: string, ctaTarget?: string) => {
    interactionCount.current += 1;
    
    try {
      await SupabaseService.saveCTAClick({
        page: pageName,
        ctaName,
        ctaTarget,
        sessionId: sessionId.current,
        visitId: visitId.current,
        timestamp: Date.now(),
        deviceType: getDeviceType(),
        userAgent: navigator.userAgent,
        scrollDepth: maxScrollDepth.current,
        timeOnPage: Date.now() - startTime.current
      });
    } catch (error) {
      console.error('CTA 클릭 추적 실패:', error);
    }
  };

  // 섹션별 조회 추적 함수
  const trackSectionView = async (sectionName: string) => {
    try {
      await SupabaseService.saveSectionView({
        page: pageName,
        section: sectionName,
        sessionId: sessionId.current,
        visitId: visitId.current,
        timestamp: Date.now(),
        scrollDepth: maxScrollDepth.current,
        timeOnPage: Date.now() - startTime.current
      });
    } catch (error) {
      console.error('섹션 조회 추적 실패:', error);
    }
  };

  // 사용자 정보 연결 함수
  const linkUserInfo = async (userInfo: {
    email?: string;
    phone?: string;
    name?: string;
    marketingConsent?: boolean;
  }) => {
    try {
      await SupabaseService.linkUserInfoToSession({
        sessionId: sessionId.current,
        visitId: visitId.current,
        userInfo,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('사용자 정보 연결 실패:', error);
    }
  };

  return {
    metrics,
    trackCTAClick,
    trackSectionView,
    linkUserInfo,
    currentSessionId: sessionId.current,
    currentVisitId: visitId.current,
    getCurrentMetrics: () => ({
      timeOnPage: Date.now() - startTime.current,
      scrollDepth: maxScrollDepth.current,
      interactions: interactionCount.current
    })
  };
};

export default usePageTracking;