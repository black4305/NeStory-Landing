import axios from 'axios';
import { ComprehensiveDeviceInfo } from '../utils/deviceDetection';

// API 클라이언트 생성
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_LANDING_API_URL || 'http://localhost:3001/api/landing',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 데이터 타입 정의
export interface AnonymousSession {
    id?: string;
    session_id: string;
    user_agent?: string;
    ip_address?: string;
    device_type?: string;
    country?: string;
    city?: string;
    referrer?: string;
    landing_page?: string;
}

export interface PageVisit {
  session_id: string;
  route: string;
  page_title: string;
  url_params?: any;
  enter_time: string | Date;
  scroll_depth_percent?: number;
  click_count?: number;
  interaction_count?: number;
  [key: string]: any;
}

export interface UserEvent {
  session_id: string;
  event_type: string;
  event_data?: any;
  timestamp?: Date | string;
  page_visit_id?: string;
  target_element?: string;
  target_text?: string;
  target_value?: any;
  mouse_x?: number;
  mouse_y?: number;
  keyboard_key?: string;
  scroll_x?: number;
  scroll_y?: number;
  error_message?: string;
  metadata?: any;
  created_at?: Date | string;
  [key: string]: any;
}

export interface SurveyResponse {
  session_id: string;
  question_id: string | number;
  question_number?: number;
  answer?: string;
  selected_option?: string;
  selected_score?: number;
  response_time_ms?: number;
  confidence_score?: number;
  answered_at?: string | Date;
  timestamp?: Date;
  [key: string]: any;
}

export interface TestResult {
  session_id: string;
  type_code?: string;
  travel_type_code?: string;
  axis_scores: any;
  total_response_time_ms?: any;
  average_response_time_ms?: any;
  completion_rate?: any;
  consistency_score?: number;
  started_at?: string | Date;
  completed_at?: string | Date;
  share_id?: string;
  shared_count?: number;
  timestamp?: Date;
  [key: string]: any;
}

export interface Lead {
  session_id: string;
  email?: string;
  contact_type?: string;
  contact_value?: string;
  marketing_consent?: any;
  privacy_consent?: any;
  kakao_channel_added?: any;
  lead_source?: string;
  travel_type?: string;
  lead_score?: number;
  webhook_sent?: boolean;
  created_at?: string | Date;
  name?: string;
  source?: string;
  timestamp?: Date;
  [key: string]: any;
}

export class PostgresService {
  // 1. Landing 페이지 초기 데이터 조회
  static async getInitialData(): Promise<{ travelTypes: any[], characters: any[], regions: any[] }> {
    try {
      const response = await apiClient.get('/initial-data');
      console.log('✅ 초기 데이터 로딩 완료:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ 초기 데이터 로딩 실패:', error);
      return { travelTypes: [], characters: [], regions: [] };
    }
  }

  // 2. 익명 세션 생성/업데이트
  static async createOrUpdateSession(deviceInfo: ComprehensiveDeviceInfo, sessionId: string): Promise<boolean> {
    try {
      const sessionData: Partial<AnonymousSession> = {
        session_id: sessionId,
        user_agent: deviceInfo.userAgent,
        ip_address: deviceInfo.location.ip,
        device_type: deviceInfo.device.type,
        country: deviceInfo.location.country,
        city: deviceInfo.location.city,
        referrer: deviceInfo.misc.referrer,
        landing_page: window.location.href,
      };

      const response = await apiClient.post('/session', sessionData);

      if (response.status === 201) {
        console.log('✅ 익명 세션 저장 완료:', sessionId);
        return true;
      }
      return false;
    } catch (error) {
      console.error('💥 세션 저장 오류:', error);
      return false;
    }
  }

  // 3. Landing 퍼널 메트릭스 조회
  static async getFunnelMetrics(): Promise<any> {
    try {
      const response = await apiClient.get('/analytics/funnel-metrics');
      return response.data;
    } catch (error) {
      console.error('Landing 퍼널 메트릭스 조회 실패:', error);
      return {};
    }
  }

  // 4. Landing 실시간 통계 조회
  static async getRealtimeStats(): Promise<any> {
    try {
      const response = await apiClient.get('/analytics/realtime-stats');
      return response.data;
    } catch (error) {
      console.error('Landing 실시간 통계 조회 실패:', error);
      return {};
    }
  }

  // 5. 여행 유형별 분석 조회
  static async getTravelTypeAnalytics(): Promise<any[]> {
    try {
      const response = await apiClient.get('/analytics/travel-types');
      return response.data;
    } catch (error) {
      console.error('여행 유형별 분석 조회 실패:', error);
      return [];
    }
  }

  // 6. 페이지 성능 분석 조회
  static async getPagePerformanceAnalytics(): Promise<any[]> {
    try {
      const response = await apiClient.get('/analytics/page-performance');
      return response.data;
    } catch (error) {
      console.error('페이지 성능 분석 조회 실패:', error);
      return [];
    }
  }

  // 7. 활성 사용자 조회
  static async getActiveUserData(): Promise<any> {
    try {
      const response = await apiClient.get('/analytics/active-users');
      return response.data;
    } catch (error) {
      console.error('활성 사용자 조회 실패:', error);
      return {};
    }
  }

  // 8. 지역별 분석 조회
  static async getGeographicAnalytics(): Promise<any[]> {
    try {
      const response = await apiClient.get('/analytics/geographic');
      return response.data;
    } catch (error) {
      console.error('지역별 분석 조회 실패:', error);
      return [];
    }
  }

  // 9. 현재 활성 사용자 조회
  static async getCurrentActiveUsers(): Promise<any> {
    try {
      const response = await apiClient.get('/analytics/current-active-users');
      return response.data;
    } catch (error) {
      console.error('현재 활성 사용자 조회 실패:', error);
      return {};
    }
  }

  // 10. 페이지 방문 기록
  static async recordPageVisit(visitData: PageVisit): Promise<string | null> {
    try {
      const response = await apiClient.post('/page-visits', visitData);
      return response.data?.id || null;
    } catch (error) {
      console.error('페이지 방문 기록 실패:', error);
      return null;
    }
  }

  // 11. 사용자 이벤트 기록
  static async recordUserEvent(eventData: UserEvent): Promise<boolean> {
    try {
      const response = await apiClient.post('/events', eventData);
      return response.status === 201;
    } catch (error) {
      console.error('사용자 이벤트 기록 실패:', error);
      return false;
    }
  }

  // 12. 배치 이벤트 기록
  static async recordBatchEvents(events: UserEvent[]): Promise<boolean> {
    try {
      const response = await apiClient.post('/events/batch', { events });
      return response.status === 201;
    } catch (error) {
      console.error('배치 이벤트 기록 실패:', error);
      return false;
    }
  }

  // 13. 테스트 결과 저장
  static async saveTestResult(resultData: TestResult): Promise<boolean> {
    try {
      const response = await apiClient.post('/test-results', resultData);
      return response.status === 201;
    } catch (error) {
      console.error('테스트 결과 저장 실패:', error);
      return false;
    }
  }

  // 14. 리드 정보 저장
  static async saveLead(leadData: Lead): Promise<boolean> {
    try {
      const response = await apiClient.post('/leads', leadData);
      return response.status === 201;
    } catch (error) {
      console.error('리드 정보 저장 실패:', error);
      return false;
    }
  }

  // 15. 페이지 종료 정보 업데이트
  static async updatePageVisitExit(visitId: string | null, exitData: any): Promise<boolean> {
    if (!visitId) return false;
    try {
      const response = await apiClient.put(`/page-visits/${visitId}/exit`, exitData);
      return response.status === 200;
    } catch (error) {
      console.error('페이지 종료 정보 업데이트 실패:', error);
      return false;
    }
  }

  // 16. 설문 응답 저장
  static async saveSurveyResponse(responseData: SurveyResponse): Promise<boolean> {
    try {
      const response = await apiClient.post('/survey-responses', responseData);
      return response.status === 201;
    } catch (error) {
      console.error('설문 응답 저장 실패:', error);
      return false;
    }
  }

  // 17. 사용자 이벤트 배치 기록 (별칭)
  static async recordUserEvents(events: UserEvent[]): Promise<boolean> {
    return this.recordBatchEvents(events);
  }
}

export default PostgresService;
