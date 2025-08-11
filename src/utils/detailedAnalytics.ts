// Landing 프로젝트 전용 상세 분석 시스템 (Survey와 동일한 방식)
import { 
  supabaseService,
  AnonymousSession,
  PageVisit,
  UserEvent,
  TestResult,
  Lead
} from '../services/supabaseService';
import { 
  collectComprehensiveDeviceInfo,
  generateSessionId,
  getExistingSession,
  saveSessionId,
  summarizeDeviceInfo,
  ComprehensiveDeviceInfo 
} from './deviceDetection';

// 페이지 세션 정보
interface LandingPageSession {
  sessionId: string;
  route: string;
  pageVisitId?: string;
  enterTime: number;
  exitTime?: number;
  duration?: number;
  interactions: number;
  scrollDepth: number;
  ctaClicks: number;
  errors: string[];
  formInputs: Record<string, any>;
  deviceInfo: ComprehensiveDeviceInfo;
}

// 이벤트 데이터
interface LandingEventData {
  eventType: 'page_enter' | 'page_exit' | 'click' | 'scroll' | 'form_input' | 'error' | 'cta_click';
  elementId?: string;
  elementType?: string;
  elementText?: string;
  value?: string;
  position?: { x: number; y: number };
  scrollPosition?: number;
  metadata?: Record<string, any>;
}

class LandingDetailedAnalytics {
  private sessionId: string = '';
  private deviceInfo: ComprehensiveDeviceInfo | null = null;
  private currentPageSession: LandingPageSession | null = null;
  private eventBuffer: UserEvent[] = [];
  private isInitialized = false;
  private saveInterval: NodeJS.Timeout | null = null;
  private isSessionSaved = false;

  constructor() {
    this.sessionId = this.initializeSession();
    this.setupEventListeners();
    this.startPeriodicSave();
  }

  // 세션 초기화 (중복 방지)
  private initializeSession(): string {
    // 기존 세션 확인
    const existingSession = getExistingSession();
    if (existingSession) {
      this.isSessionSaved = sessionStorage.getItem('landingSessionSaved') === 'true';
      console.log('✅ 기존 Landing 세션 사용:', existingSession);
      return existingSession;
    }

    // 새 세션 생성
    const newSessionId = generateSessionId();
    saveSessionId(newSessionId);
    sessionStorage.setItem('landingSessionStart', Date.now().toString());
    sessionStorage.setItem('sessionStart', Date.now().toString()); // 호환성
    console.log('✅ 새 Landing 세션 생성:', newSessionId);
    
    // 방문 횟수 증가 (localStorage)
    const visitCount = parseInt(localStorage.getItem('landingVisitCount') || '0') + 1;
    localStorage.setItem('landingVisitCount', visitCount.toString());
    localStorage.setItem('landingLastVisit', new Date().toISOString());
    
    return newSessionId;
  }

  // 이벤트 리스너 설정
  private setupEventListeners(): void {
    // 페이지 이탈 시 데이터 저장
    window.addEventListener('beforeunload', () => {
      this.saveAllPendingData();
    });

    // 페이지 가시성 변경 추적
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.trackCustomEvent('page_visibility', { visible: false });
      } else {
        this.trackCustomEvent('page_visibility', { visible: true });
      }
    });

    // 전역 에러 추적
    window.addEventListener('error', (event) => {
      this.trackError(`JS Error: ${event.message}`, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      });
    });

    // 스크롤 추적 (throttled)
    let scrollTimeout: NodeJS.Timeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.trackScroll();
      }, 100);
    });

    // 클릭 추적
    document.addEventListener('click', (event) => {
      this.trackClick(event);
    });
  }

  // 주기적 데이터 저장 (30초마다)
  private startPeriodicSave(): void {
    this.saveInterval = setInterval(() => {
      this.savePendingEvents();
    }, 30000);
  }

  // 디바이스 정보 초기화 (Survey와 동일한 방식)
  public async initialize(landingSpecific?: {
    entryPoint?: string;
    referralSource?: string;
    landingVersion?: string;
  }): Promise<void> {
    if (this.isInitialized) return;

    try {
      // 디바이스 정보 수집
      this.deviceInfo = await collectComprehensiveDeviceInfo(landingSpecific);
      
      // Landing 세션 정보 생성 (Survey와 동일한 구조)
      const sessionInfo: AnonymousSession = {
        session_id: this.sessionId,
        referrer: document.referrer,
        landing_page: window.location.href,
        
        // 디바이스 정보
        user_agent: navigator.userAgent,
        ip_address: this.deviceInfo.location.ip || '',
        device_type: this.deviceInfo.device.type,
        device_brand: this.deviceInfo.device.brand,
        device_model: this.deviceInfo.device.model,
        os: this.deviceInfo.device.os,
        os_version: this.deviceInfo.device.osVersion,
        browser: this.deviceInfo.device.browser,
        browser_version: this.deviceInfo.device.browserVersion,
        screen_width: this.deviceInfo.hardware.screenWidth,
        screen_height: this.deviceInfo.hardware.screenHeight,
        pixel_ratio: this.deviceInfo.hardware.pixelRatio,
        
        // 위치 정보
        country: this.deviceInfo.location.country,
        country_code: this.deviceInfo.location.countryCode,
        region: this.deviceInfo.location.region,
        region_code: this.deviceInfo.location.regionCode,
        city: this.deviceInfo.location.city,
        zip_code: this.deviceInfo.location.zipCode,
        latitude: this.deviceInfo.location.latitude,
        longitude: this.deviceInfo.location.longitude,
        timezone: this.deviceInfo.location.timezone,
        isp: this.deviceInfo.location.isp,
        organization: this.deviceInfo.location.org,
        asn: this.deviceInfo.location.asn,
        
        // 네트워크 정보
        connection_type: this.deviceInfo.network.connectionType,
        effective_type: this.deviceInfo.network.effectiveType,
        downlink: this.deviceInfo.network.downlink,
        rtt: this.deviceInfo.network.rtt,
        save_data: this.deviceInfo.network.saveData,
        
        // 브라우저 능력
        webgl_support: this.deviceInfo.capabilities.webGL,
        webgl_vendor: this.deviceInfo.capabilities.webGLVendor,
        webgl_renderer: this.deviceInfo.capabilities.webGLRenderer,
        local_storage: this.deviceInfo.capabilities.localStorage,
        session_storage: this.deviceInfo.capabilities.sessionStorage,
        indexed_db: this.deviceInfo.capabilities.indexedDB,
        service_workers: this.deviceInfo.capabilities.serviceWorkers,
        geolocation: this.deviceInfo.capabilities.geolocation,
        
        // 기타 정보
        language: navigator.language,
        languages: this.deviceInfo.misc.languages,
        timezone_offset: this.deviceInfo.misc.timezoneOffset,
        visit_count: parseInt(localStorage.getItem('landingVisitCount') || '1'),
        ad_blocker_detected: this.deviceInfo.misc.adBlock,
        canvas_fingerprint: this.deviceInfo.misc.canvasFingerprint,
        audio_fingerprint: this.deviceInfo.misc.audioFingerprint,
        installed_fonts: this.deviceInfo.misc.installedFonts
      };

      // 세션 정보 저장 (중복 방지)
      if (!this.isSessionSaved) {
        await supabaseService.createOrUpdateSession(sessionInfo);
        this.isSessionSaved = true;
        sessionStorage.setItem('landingSessionSaved', 'true');
        console.log('✅ Landing 세션 DB 저장 완료');
      }
      
      this.isInitialized = true;
      
      console.log('Landing analytics initialized:', {
        sessionId: this.sessionId,
        deviceSummary: summarizeDeviceInfo(this.deviceInfo)
      });
    } catch (error) {
      console.error('Failed to initialize landing analytics:', error);
    }
  }

  // 페이지 진입 추적
  public async trackPageEnter(route: string, metadata?: Record<string, any>): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const now = Date.now();
    const enterTime = new Date();

    // 이전 페이지 세션 종료
    if (this.currentPageSession) {
      await this.trackPageExit();
    }

    // 새 페이지 세션 시작
    this.currentPageSession = {
      sessionId: this.sessionId,
      route,
      enterTime: now,
      interactions: 0,
      scrollDepth: 0,
      ctaClicks: 0,
      errors: [],
      formInputs: {},
      deviceInfo: this.deviceInfo!
    };

    // 페이지 방문 기록
    const pageVisit: PageVisit = {
      session_id: this.sessionId,
      route,
      page_title: document.title,
      url_params: metadata,
      enter_time: enterTime,
      scroll_depth_percent: 0,
      click_count: 0,
      interaction_count: 0,
      cta_clicks: 0,
      load_time_ms: performance.timing ? 
        performance.timing.loadEventEnd - performance.timing.navigationStart : undefined
    };

    const result = await supabaseService.recordPageVisit(pageVisit);
    if (result && result.id) {
      this.currentPageSession.pageVisitId = result.id;
    }

    // 이벤트 추가
    this.addEvent({
      eventType: 'page_enter',
      metadata: { route, ...metadata }
    });
  }

  // 페이지 이탈 추적
  public async trackPageExit(): Promise<void> {
    if (!this.currentPageSession) return;

    const exitTime = Date.now();
    this.currentPageSession.exitTime = exitTime;
    this.currentPageSession.duration = exitTime - this.currentPageSession.enterTime;

    // 페이지 방문 종료 업데이트
    if (this.currentPageSession.pageVisitId) {
      await supabaseService.updatePageVisitExit(this.currentPageSession.pageVisitId, {
        exit_time: new Date(),
        time_spent_seconds: Math.floor(this.currentPageSession.duration / 1000),
        scroll_depth_percent: this.currentPageSession.scrollDepth,
        interaction_count: this.currentPageSession.interactions,
        cta_clicks: this.currentPageSession.ctaClicks
      });
    }

    // 이벤트 추가
    this.addEvent({
      eventType: 'page_exit',
      metadata: {
        route: this.currentPageSession.route,
        duration: this.currentPageSession.duration,
        scrollDepth: this.currentPageSession.scrollDepth
      }
    });

    this.currentPageSession = null;
  }

  // 클릭 추적
  private trackClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target) return;

    const eventData: LandingEventData = {
      eventType: 'click',
      elementId: target.id,
      elementType: target.tagName.toLowerCase(),
      elementText: target.textContent?.slice(0, 100),
      position: { x: event.clientX, y: event.clientY }
    };

    // CTA 버튼 클릭 추적
    if (target.classList.contains('cta') || target.closest('.cta')) {
      eventData.eventType = 'cta_click';
      if (this.currentPageSession) {
        this.currentPageSession.ctaClicks++;
      }
    }

    this.addEvent(eventData);

    if (this.currentPageSession) {
      this.currentPageSession.interactions++;
    }
  }

  // 스크롤 추적
  private trackScroll(): void {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollDepth = scrollHeight > 0 ? Math.round((scrollTop / scrollHeight) * 100) : 0;

    if (this.currentPageSession && scrollDepth > this.currentPageSession.scrollDepth) {
      this.currentPageSession.scrollDepth = scrollDepth;

      this.addEvent({
        eventType: 'scroll',
        scrollPosition: scrollTop,
        metadata: { scrollDepth }
      });
    }
  }

  // 에러 추적
  public trackError(message: string, metadata?: any): void {
    if (this.currentPageSession) {
      this.currentPageSession.errors.push(message);
    }

    this.addEvent({
      eventType: 'error',
      metadata: { message, ...metadata }
    });
  }

  // 커스텀 이벤트 추적
  public trackCustomEvent(eventName: string, data: Record<string, any>): void {
    this.addEvent({
      eventType: 'click',
      elementId: eventName,
      metadata: data
    });
  }

  // CTA 클릭 추적
  public trackCTAClick(ctaName: string, targetRoute: string, metadata?: Record<string, any>): void {
    this.addEvent({
      eventType: 'cta_click',
      elementId: ctaName,
      value: targetRoute,
      metadata: metadata
    });
    
    if (this.currentPageSession) {
      this.currentPageSession.ctaClicks++;
    }
  }

  // 폼 제출 추적
  public trackFormSubmit(formName: string, metadata?: Record<string, any>): void {
    this.addEvent({
      eventType: 'form_input',
      elementId: formName,
      elementType: 'form_submit',
      metadata: metadata
    });
    
    if (this.currentPageSession) {
      this.currentPageSession.interactions++;
    }
  }

  // 테스트 답변 추적
  public trackTestAnswer(questionId: string | number, answer: any, responseTime: number): void {
    const questionIdStr = String(questionId);
    this.addEvent({
      eventType: 'form_input',
      elementId: questionIdStr,
      elementType: 'test_answer',
      value: String(answer),
      metadata: {
        questionId: questionIdStr,
        answer,
        responseTime
      }
    });
    
    if (this.currentPageSession) {
      this.currentPageSession.formInputs[questionIdStr] = answer;
      this.currentPageSession.interactions++;
    }
  }

  // 테스트 완료 추적
  public async trackTestCompletion(travelTypeCode: string, axisScores: Record<string, number>, analytics: any): Promise<void> {
    try {
      const testResult: TestResult = {
        session_id: this.sessionId,
        travel_type_code: travelTypeCode,
        axis_scores: axisScores,
        total_response_time_ms: analytics.totalTime || 0,
        average_response_time_ms: analytics.averageResponseTime || 0,
        completion_rate: analytics.completionRate || 100,
        consistency_score: this.calculateConsistencyScore(axisScores),
        started_at: new Date(Date.now() - (analytics.totalTime || 0)).toISOString(),
        completed_at: new Date().toISOString(),
        share_id: this.generateShareId(),
        shared_count: 0
      };
      
      await supabaseService.saveTestResult(testResult);
      console.log('✅ 테스트 완료 결과 저장:', travelTypeCode);
      
      // 완료 추적 추가
      await supabaseService.saveCompletion({
        session_id: this.sessionId,
        completion_status: 'completed',
        completion_percentage: 100,
        total_steps: 3,
        completed_steps: 3,
        started_at: testResult.started_at,
        completed_at: testResult.completed_at,
        total_duration_ms: analytics.totalTime || 0,
        average_response_time_ms: analytics.averageResponseTime || 0,
        quality_score: 85,
        consistency_score: this.calculateConsistencyScore(axisScores),
        engagement_score: 90,
        test_type: 'family_travel',
        test_result: travelTypeCode,
        axis_scores: axisScores,
        user_journey_stage: 'test_completed',
        metadata: {
          analytics: analytics,
          share_id: testResult.share_id
        }
      });
      console.log('✅ 완료 추적 저장 성공');
    } catch (error) {
      console.error('❌ 테스트 완료 저장 실패:', error);
    }
  }

  // 리드 정보 저장
  public async trackLeadCapture(contactType: 'email' | 'kakao', contactValue: string, travelType?: string, additionalData?: any): Promise<void> {
    try {
      const lead: Lead = {
        session_id: this.sessionId,
        contact_type: contactType,
        contact_value: contactValue,
        email: contactType === 'email' ? contactValue : undefined,
        phone: contactType === 'kakao' ? contactValue : undefined,
        kakao_channel_added: additionalData?.kakaoChannelAdded,
        travel_type: travelType,
        lead_source: this.determineLeadSource(),
        lead_score: this.calculateLeadScore(contactType, additionalData),
        marketing_consent: additionalData?.marketingConsent,
        privacy_consent: additionalData?.privacyConsent,
        device_type: this.deviceInfo?.device.type,
        device_info: additionalData?.deviceInfo,
        ip_address: additionalData?.ipAddress || this.deviceInfo?.location.ip,
        ip_location: additionalData?.ipLocation,
        page_url: additionalData?.pageUrl || window.location.href,
        utm_source: additionalData?.utmSource,
        utm_medium: additionalData?.utmMedium,
        utm_campaign: additionalData?.utmCampaign,
        created_at: new Date()
      };

      await supabaseService.saveLead(lead);
      console.log('✅ 리드 정보 저장:', contactType);

      this.addEvent({
        eventType: 'form_input',
        elementId: 'lead_capture',
        value: contactType,
        metadata: { travelType, ...additionalData }
      });
    } catch (error) {
      console.error('❌ 리드 저장 실패:', error);
    }
  }

  // 질문 응답 추적
  public async trackQuestionResponse(
    questionNumber: number,
    questionText: string,
    selectedOption: string,
    responseTime: number
  ): Promise<void> {
    this.addEvent({
      eventType: 'form_input',
      elementId: `question_${questionNumber}`,
      value: selectedOption,
      metadata: {
        questionText,
        responseTime
      }
    });

    if (this.currentPageSession) {
      this.currentPageSession.formInputs[`question_${questionNumber}`] = selectedOption;
    }
  }

  // 이벤트 추가
  private addEvent(eventData: LandingEventData): void {
    const event: UserEvent = {
      session_id: this.sessionId,
      event_type: eventData.eventType,
      element_id: eventData.elementId,
      element_type: eventData.elementType,
      element_text: eventData.elementText,
      element_value: eventData.value,
      click_x: eventData.position?.x,
      click_y: eventData.position?.y,
      scroll_position: eventData.scrollPosition,
      timestamp_ms: Date.now(),
      metadata: eventData.metadata
    };

    this.eventBuffer.push(event);

    // 버퍼가 10개 이상이면 저장
    if (this.eventBuffer.length >= 10) {
      this.savePendingEvents();
    }
  }

  // 대기 중인 이벤트 저장
  private async savePendingEvents(): Promise<void> {
    if (this.eventBuffer.length === 0) return;

    const eventsToSave = [...this.eventBuffer];
    this.eventBuffer = [];

    try {
      await supabaseService.recordBatchEvents(eventsToSave);
    } catch (error) {
      console.error('이벤트 저장 실패:', error);
      // 실패한 이벤트는 다시 버퍼에 추가
      this.eventBuffer.unshift(...eventsToSave);
    }
  }

  // 모든 대기 중인 데이터 저장
  private async saveAllPendingData(): Promise<void> {
    await this.trackPageExit();
    await this.savePendingEvents();
  }

  // 헬퍼 함수들
  private generateShareId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private calculateConsistencyScore(axisScores: Record<string, number>): number {
    const scores = Object.values(axisScores);
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - avg, 2), 0) / scores.length;
    return Math.max(0, 100 - variance);
  }

  private determineLeadSource(): string {
    const referrer = document.referrer;
    if (!referrer) return 'direct';
    if (referrer.includes('google.com')) return 'google';
    if (referrer.includes('facebook.com') || referrer.includes('instagram.com')) return 'social';
    return 'referral';
  }

  private calculateLeadScore(contactType: string, additionalData?: any): number {
    let score = 50;
    
    if (contactType === 'email') score += 20;
    if (contactType === 'kakao') score += 15;
    if (additionalData?.marketingConsent) score += 15;
    if (additionalData?.kakaoChannelAdded) score += 10;
    
    if (this.currentPageSession) {
      if (this.currentPageSession.interactions > 5) score += 10;
      if (this.currentPageSession.scrollDepth > 80) score += 5;
    }
    
    return Math.min(100, score);
  }

  // 세션 정보 반환
  public getSessionInfo() {
    return {
      sessionId: this.sessionId,
      currentPageSession: this.currentPageSession,
      eventBufferSize: this.eventBuffer.length,
      isInitialized: this.isInitialized
    };
  }

  // 정리
  public cleanup(): void {
    if (this.saveInterval) {
      clearInterval(this.saveInterval);
    }
    this.saveAllPendingData();
  }
}

// 싱글톤 인스턴스
export const detailedAnalytics = new LandingDetailedAnalytics();
export default detailedAnalytics;