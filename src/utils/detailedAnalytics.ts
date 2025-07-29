import React from 'react';
import { SupabaseService } from '../services/supabase';
import { deviceDetection, ComprehensiveDeviceInfo } from './deviceDetection';

// 상세 추적 이벤트 타입 정의
export interface DetailedEvent {
  sessionId: string;
  timestamp: number;
  route: string;
  eventType: 'page_enter' | 'page_exit' | 'click' | 'scroll' | 'form_input' | 'error' | 'hover' | 'focus' | 'blur' | 'resize';
  elementId?: string;
  elementType?: string;
  elementText?: string;
  value?: string | number;
  position?: { x: number; y: number };
  scrollPosition?: number;
  timeOnPage?: number;
  
  // 포괄적인 디바이스 정보
  deviceInfo: ComprehensiveDeviceInfo;
  
  referrer?: string;
  metadata?: Record<string, any>;
}

// 페이지별 세션 정보
export interface PageSession {
  sessionId: string;
  route: string;
  enterTime: number;
  exitTime?: number;
  duration?: number;
  interactions: number;
  scrollDepth: number;
  ctaClicks: number;
  errors: string[];
  formInputs: Record<string, any>;
  
  // 세션별 디바이스 정보 (요약)
  deviceSummary: string;
  deviceInfo: ComprehensiveDeviceInfo;
}

class DetailedAnalytics {
  private sessionId: string;
  private currentRoute: string = '';
  private pageEnterTime: number = 0;
  private events: DetailedEvent[] = [];
  private pageSessions: PageSession[] = [];
  private currentPageSession: PageSession | null = null;
  private isTracking: boolean = true;
  private deviceInfo: ComprehensiveDeviceInfo | null = null;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeDeviceInfo();
    this.initializeTracking();
  }

  private async initializeDeviceInfo(): Promise<void> {
    try {
      this.deviceInfo = await deviceDetection.getComprehensiveDeviceInfo();
      console.log('✅ 포괄적인 디바이스 정보 수집 완료:', {
        device: `${this.deviceInfo.device.brand} ${this.deviceInfo.device.model}`,
        location: `${this.deviceInfo.location.city}, ${this.deviceInfo.location.country}`,
        isp: this.deviceInfo.location.isp,
        ip: this.deviceInfo.location.ip
      });
    } catch (error) {
      console.error('❌ 디바이스 정보 수집 실패:', error);
    }
  }

  private generateSessionId(): string {
    return `detailed_${Date.now()}_${Math.random().toString(36).substr(2, 12)}`;
  }

  private async getDeviceInfoForEvent(): Promise<ComprehensiveDeviceInfo> {
    if (this.deviceInfo) {
      return this.deviceInfo;
    }
    
    // 디바이스 정보가 아직 로드되지 않은 경우 대기
    try {
      this.deviceInfo = await deviceDetection.getComprehensiveDeviceInfo();
      return this.deviceInfo;
    } catch (error) {
      console.error('Failed to get device info for event:', error);
      // 기본값 반환
      return {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        languages: [navigator.language],
        device: {
          type: 'desktop',
          brand: 'Unknown',
          model: 'Unknown',
          os: 'Unknown',
          osVersion: 'Unknown',
          browser: 'Unknown',
          browserVersion: 'Unknown',
          engine: 'Unknown'
        },
        hardware: {
          screenWidth: window.screen.width,
          screenHeight: window.screen.height,
          screenResolution: `${window.screen.width}x${window.screen.height}`,
          pixelRatio: window.devicePixelRatio || 1,
          colorDepth: window.screen.colorDepth,
          touchSupport: 'ontouchstart' in window,
          maxTouchPoints: navigator.maxTouchPoints || 0,
          hardwareConcurrency: navigator.hardwareConcurrency || 1
        },
        network: {},
        location: {
          ip: '0.0.0.0',
          country: 'Unknown',
          countryCode: 'XX',
          region: 'Unknown',
          regionCode: 'XX',
          city: 'Unknown',
          zipCode: 'Unknown',
          latitude: 0,
          longitude: 0,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          isp: 'Unknown',
          org: 'Unknown',
          asn: 'Unknown',
          proxy: false,
          vpn: false
        },
        capabilities: {
          cookieEnabled: navigator.cookieEnabled,
          doNotTrack: navigator.doNotTrack === '1',
          javaEnabled: false,
          webGL: false,
          webGLVendor: '',
          webGLRenderer: '',
          localStorage: true,
          sessionStorage: true,
          indexedDB: !!window.indexedDB,
          webWorkers: !!window.Worker,
          serviceWorkers: 'serviceWorker' in navigator,
          pushNotifications: 'PushManager' in window,
          geolocation: 'geolocation' in navigator,
          camera: false,
          microphone: false
        },
        misc: {
          timezoneOffset: new Date().getTimezoneOffset(),
          currentTime: new Date().toISOString(),
          referrer: document.referrer,
          onlineStatus: navigator.onLine,
          installedFonts: [],
          canvasFingerprint: 'unknown',
          audioFingerprint: 'unknown'
        }
      };
    }
  }

  // 초기 추적 설정
  private initializeTracking(): void {
    // 클릭 이벤트 추적
    document.addEventListener('click', (e) => {
      this.trackEvent('click', {
        elementId: (e.target as HTMLElement)?.id,
        elementType: (e.target as HTMLElement)?.tagName,
        elementText: (e.target as HTMLElement)?.textContent?.slice(0, 100),
        position: { x: e.clientX, y: e.clientY }
      });
      
      if (this.currentPageSession) {
        this.currentPageSession.interactions++;
        
        // CTA 버튼 클릭 감지
        const target = e.target as HTMLElement;
        if (target.textContent?.includes('시작') || 
            target.textContent?.includes('테스트') ||
            target.textContent?.includes('받기') ||
            target.className?.includes('cta')) {
          this.currentPageSession.ctaClicks++;
        }
      }
    });

    // 스크롤 이벤트 추적
    let scrollTimeout: NodeJS.Timeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollPercent = Math.round(
          (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
        );
        
        this.trackEvent('scroll', {
          scrollPosition: window.scrollY,
          value: scrollPercent
        });

        if (this.currentPageSession && scrollPercent > this.currentPageSession.scrollDepth) {
          this.currentPageSession.scrollDepth = scrollPercent;
        }
      }, 100);
    });

    // 폼 입력 이벤트 추적
    document.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      if (target.type !== 'password') { // 비밀번호는 추적 안함
        this.trackEvent('form_input', {
          elementId: target.id,
          elementType: target.type,
          value: target.type === 'email' ? '***@***.***' : target.value?.slice(0, 20) // 개인정보 마스킹
        });

        if (this.currentPageSession) {
          this.currentPageSession.formInputs[target.id || target.name] = target.value?.slice(0, 20);
        }
      }
    });

    // 에러 이벤트 추적
    window.addEventListener('error', (e) => {
      this.trackEvent('error', {
        value: e.error?.message || 'Unknown error',
        metadata: {
          filename: e.filename,
          lineno: e.lineno,
          colno: e.colno
        }
      });

      if (this.currentPageSession) {
        this.currentPageSession.errors.push(e.error?.message || 'Unknown error');
      }
    });

    // 페이지 이탈 추적
    window.addEventListener('beforeunload', () => {
      this.trackPageExit();
      this.saveAllData();
    });

    // 화면 크기 변경 추적
    window.addEventListener('resize', () => {
      this.trackEvent('resize', {
        metadata: {
          newSize: { width: window.innerWidth, height: window.innerHeight }
        }
      });
    });
  }

  // 기본 이벤트 추적 함수
  private async trackEvent(eventType: DetailedEvent['eventType'], data?: Partial<DetailedEvent>): Promise<void> {
    if (!this.isTracking) return;

    const deviceInfo = await this.getDeviceInfoForEvent();
    
    const event: DetailedEvent = {
      sessionId: this.sessionId,
      timestamp: Date.now(),
      route: this.currentRoute,
      eventType,
      deviceInfo,
      referrer: document.referrer || 'direct',
      ...data
    };

    this.events.push(event);

    // 이벤트가 50개 이상 쌓이면 저장 (더 자주 저장)
    if (this.events.length >= 50) {
      await this.saveEvents();
    }
  }

  // 페이지 진입 추적
  public async trackPageEnter(route: string, metadata?: Record<string, any>): Promise<void> {
    this.currentRoute = route;
    this.pageEnterTime = Date.now();

    // 이전 페이지 세션 종료
    if (this.currentPageSession) {
      this.trackPageExit();
    }

    const deviceInfo = await this.getDeviceInfoForEvent();
    const deviceSummary = await deviceDetection.getDeviceSummary();

    // 새 페이지 세션 시작
    this.currentPageSession = {
      sessionId: this.sessionId,
      route,
      enterTime: this.pageEnterTime,
      interactions: 0,
      scrollDepth: 0,
      ctaClicks: 0,
      errors: [],
      formInputs: {},
      deviceSummary,
      deviceInfo
    };

    this.trackEvent('page_enter', { metadata });
  }

  // 페이지 이탈 추적
  public trackPageExit(): void {
    if (!this.currentPageSession) return;

    const exitTime = Date.now();
    const duration = exitTime - this.currentPageSession.enterTime;

    this.currentPageSession.exitTime = exitTime;
    this.currentPageSession.duration = duration;

    this.pageSessions.push({ ...this.currentPageSession });

    this.trackEvent('page_exit', {
      timeOnPage: duration,
      metadata: {
        interactions: this.currentPageSession.interactions,
        scrollDepth: this.currentPageSession.scrollDepth,
        ctaClicks: this.currentPageSession.ctaClicks,
        errors: this.currentPageSession.errors
      }
    });

    this.currentPageSession = null;
  }

  // CTA 클릭 추적 (기존 호환성)
  public trackCTAClick(ctaName: string, destination: string, metadata?: Record<string, any>): void {
    this.trackEvent('click', {
      elementType: 'CTA',
      elementText: ctaName,
      value: destination,
      metadata
    });
  }

  // 폼 제출 추적
  public trackFormSubmit(formType: string, formData: Record<string, any>): void {
    this.trackEvent('form_input', {
      elementType: 'form_submit',
      elementId: formType,
      metadata: formData
    });
  }

  // 테스트 답변 추적
  public trackTestAnswer(questionId: number, answer: string | number, timeSpent: number): void {
    this.trackEvent('click', {
      elementType: 'test_answer',
      elementId: `question_${questionId}`,
      value: answer,
      metadata: {
        timeSpent,
        questionId
      }
    });
  }

  // 에러 추적
  public trackError(errorType: string, errorMessage: string, context?: Record<string, any>): void {
    this.trackEvent('error', {
      elementType: errorType,
      value: errorMessage,
      metadata: context
    });
  }

  // 커스텀 이벤트 추적
  public trackCustomEvent(eventName: string, data: Record<string, any>): void {
    this.trackEvent('click', {
      elementType: 'custom',
      elementId: eventName,
      metadata: data
    });
  }

  // 이벤트 데이터 저장
  private async saveEvents(): Promise<void> {
    if (this.events.length === 0) return;

    try {
      await SupabaseService.saveDetailedEvents(this.events);
      console.log(`✅ ${this.events.length}개 상세 이벤트 저장 완료`);
      this.events = []; // 저장 후 초기화
    } catch (error) {
      console.error('❌ 상세 이벤트 저장 실패:', error);
      // localStorage에 백업
      const existingEvents = JSON.parse(localStorage.getItem('detailedEvents') || '[]');
      localStorage.setItem('detailedEvents', JSON.stringify([...existingEvents, ...this.events]));
    }
  }

  // 페이지 세션 데이터 저장
  private async savePageSessions(): Promise<void> {
    if (this.pageSessions.length === 0) return;

    try {
      await SupabaseService.savePageSessions(this.pageSessions);
      console.log(`✅ ${this.pageSessions.length}개 페이지 세션 저장 완료`);
      this.pageSessions = []; // 저장 후 초기화
    } catch (error) {
      console.error('❌ 페이지 세션 저장 실패:', error);
    }
  }

  // 모든 데이터 저장
  public async saveAllData(): Promise<void> {
    await Promise.all([
      this.saveEvents(),
      this.savePageSessions()
    ]);
  }

  // 추적 중지/시작
  public stopTracking(): void {
    this.isTracking = false;
  }

  public startTracking(): void {
    this.isTracking = true;
  }

  // 세션 정보 반환
  public getSessionInfo() {
    return {
      sessionId: this.sessionId,
      currentRoute: this.currentRoute,
      eventCount: this.events.length,
      pageSessionCount: this.pageSessions.length,
      currentPageSession: this.currentPageSession
    };
  }
}

// 전역 인스턴스 생성
export const detailedAnalytics = new DetailedAnalytics();

// 페이지 라우트 변경 감지 hook 함수
export const useDetailedAnalytics = (route: string) => {
  React.useEffect(() => {
    detailedAnalytics.trackPageEnter(route);
    return () => {
      detailedAnalytics.trackPageExit();
    };
  }, [route]);

  return detailedAnalytics;
};