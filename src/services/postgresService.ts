import { createClient } from '@supabase/supabase-js';
import { ComprehensiveDeviceInfo } from '../utils/deviceDetection';

// Supabase 클라이언트 생성
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL!;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// 데이터 타입 정의
export interface AnonymousSession {
  id?: string;
  session_id: string;
  user_agent?: string;
  ip_address?: string;
  device_type?: string;
  device_brand?: string;
  device_model?: string;
  os?: string;
  os_version?: string;
  browser?: string;
  browser_version?: string;
  screen_width?: number;
  screen_height?: number;
  pixel_ratio?: number;
  country?: string;
  country_code?: string;
  region?: string;
  region_code?: string;
  city?: string;
  zip_code?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  isp?: string;
  organization?: string;
  asn?: string;
  connection_type?: string;
  effective_type?: string;
  downlink?: number;
  rtt?: number;
  save_data?: boolean;
  webgl_support?: boolean;
  webgl_vendor?: string;
  webgl_renderer?: string;
  local_storage?: boolean;
  session_storage?: boolean;
  indexed_db?: boolean;
  service_workers?: boolean;
  geolocation?: boolean;
  language?: string;
  languages?: string[];
  timezone_offset?: number;
  referrer?: string;
  visit_count?: number;
  last_visit?: string;
  ad_blocker_detected?: boolean;
  canvas_fingerprint?: string;
  audio_fingerprint?: string;
  installed_fonts?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface PageVisit {
  id?: string;
  session_id: string;
  route: string;
  page_title?: string;
  url_params?: Record<string, any>;
  enter_time: string;
  exit_time?: string;
  duration_ms?: number;
  scroll_depth_percent?: number;
  max_scroll_position?: number;
  click_count?: number;
  interaction_count?: number;
  cta_clicks?: number;
  form_interactions?: number;
  bounce?: boolean;
  exit_intent_triggered?: boolean;
  exit_type?: string;
  load_time_ms?: number;
  dom_ready_time_ms?: number;
  created_at?: string;
}

export interface UserEvent {
  id?: string;
  session_id: string;
  page_visit_id?: string;
  event_type: string;
  element_id?: string;
  element_type?: string;
  element_text?: string;
  element_value?: string;
  click_x?: number;
  click_y?: number;
  scroll_position?: number;
  viewport_width?: number;
  viewport_height?: number;
  timestamp_ms: number;
  time_on_page_ms?: number;
  metadata?: Record<string, any>;
  created_at?: string;
}

export interface SurveyResponse {
  id?: string;
  session_id: string;
  question_number: number;
  question_id: number;
  question_text?: string;
  option_a?: string;
  option_b?: string;
  selected_option: string;
  selected_score: number;
  response_time_ms?: number;
  hesitation_count?: number;
  confidence_score?: number;
  answered_at?: string;
}

export interface TestResult {
  id?: string;
  session_id: string;
  travel_type_code: string;
  axis_scores?: Record<string, any>;
  total_response_time_ms?: number;
  average_response_time_ms?: number;
  completion_rate?: number;
  consistency_score?: number;
  started_at?: string;
  completed_at?: string;
  share_id?: string;
  shared_count?: number;
  last_shared_at?: string;
}

export interface Lead {
  id?: string;
  session_id: string;
  contact_type: 'email' | 'kakao';
  contact_value: string;
  marketing_consent?: boolean;
  privacy_consent?: boolean;
  kakao_channel_added?: boolean;
  lead_source?: string;
  travel_type?: string;
  lead_score?: number;
  webhook_sent?: boolean;
  webhook_sent_at?: string;
  webhook_response?: string;
  created_at?: string;
  updated_at?: string;
}

export class PostgresService {
  // 1. 익명 세션 생성/업데이트
  static async createOrUpdateSession(deviceInfo: ComprehensiveDeviceInfo, sessionId: string): Promise<boolean> {
    try {
      const sessionData: AnonymousSession = {
        session_id: sessionId,
        user_agent: deviceInfo.userAgent,
        ip_address: deviceInfo.location.ip,
        device_type: deviceInfo.device.type,
        device_brand: deviceInfo.device.brand,
        device_model: deviceInfo.device.model,
        os: deviceInfo.device.os,
        os_version: deviceInfo.device.osVersion,
        browser: deviceInfo.device.browser,
        browser_version: deviceInfo.device.browserVersion,
        screen_width: deviceInfo.hardware.screenWidth,
        screen_height: deviceInfo.hardware.screenHeight,
        pixel_ratio: deviceInfo.hardware.pixelRatio,
        country: deviceInfo.location.country,
        country_code: deviceInfo.location.countryCode,
        region: deviceInfo.location.region,
        region_code: deviceInfo.location.regionCode,
        city: deviceInfo.location.city,
        zip_code: deviceInfo.location.zipCode,
        latitude: deviceInfo.location.latitude,
        longitude: deviceInfo.location.longitude,
        timezone: deviceInfo.location.timezone,
        isp: deviceInfo.location.isp,
        organization: deviceInfo.location.org,
        asn: deviceInfo.location.asn,
        connection_type: deviceInfo.network.connectionType,
        effective_type: deviceInfo.network.effectiveType,
        downlink: deviceInfo.network.downlink,
        rtt: deviceInfo.network.rtt,
        save_data: deviceInfo.network.saveData,
        webgl_support: deviceInfo.capabilities.webGL,
        webgl_vendor: deviceInfo.capabilities.webGLVendor,
        webgl_renderer: deviceInfo.capabilities.webGLRenderer,
        local_storage: deviceInfo.capabilities.localStorage,
        session_storage: deviceInfo.capabilities.sessionStorage,
        indexed_db: deviceInfo.capabilities.indexedDB,
        service_workers: deviceInfo.capabilities.serviceWorkers,
        geolocation: deviceInfo.capabilities.geolocation,
        language: deviceInfo.language,
        languages: deviceInfo.languages,
        timezone_offset: deviceInfo.misc.timezoneOffset,
        referrer: deviceInfo.misc.referrer,
        visit_count: deviceInfo.misc.visitCount || 1,
        last_visit: deviceInfo.misc.lastVisit,
        ad_blocker_detected: deviceInfo.misc.adBlock,
        canvas_fingerprint: deviceInfo.misc.canvasFingerprint,
        audio_fingerprint: deviceInfo.misc.audioFingerprint,
        installed_fonts: deviceInfo.misc.installedFonts
      };

      const { error } = await supabase
        .from('anonymous_sessions')
        .upsert(sessionData, { 
          onConflict: 'session_id',
          ignoreDuplicates: false 
        });

      if (error) {
        console.error('❌ 세션 저장 실패:', error);
        return false;
      }

      console.log('✅ 익명 세션 저장 완료:', sessionId);
      return true;
    } catch (error) {
      console.error('💥 세션 저장 오류:', error);
      return false;
    }
  }

  // 2. 페이지 방문 기록
  static async recordPageVisit(visitData: PageVisit): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('page_visits')
        .insert(visitData)
        .select('id')
        .single();

      if (error) {
        console.error('❌ 페이지 방문 기록 실패:', error);
        return null;
      }

      console.log('✅ 페이지 방문 기록 완료:', visitData.route);
      return data.id;
    } catch (error) {
      console.error('💥 페이지 방문 기록 오류:', error);
      return null;
    }
  }

  // 3. 페이지 방문 종료 업데이트
  static async updatePageVisitExit(visitId: string, exitData: Partial<PageVisit>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('page_visits')
        .update(exitData)
        .eq('id', visitId);

      if (error) {
        console.error('❌ 페이지 이탈 업데이트 실패:', error);
        return false;
      }

      console.log('✅ 페이지 이탈 업데이트 완료:', visitId);
      return true;
    } catch (error) {
      console.error('💥 페이지 이탈 업데이트 오류:', error);
      return false;
    }
  }

  // 4. 사용자 이벤트 기록 (배치)
  static async recordUserEvents(events: UserEvent[]): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_events')
        .insert(events);

      if (error) {
        console.error('❌ 사용자 이벤트 기록 실패:', error);
        return false;
      }

      console.log(`✅ ${events.length}개 사용자 이벤트 기록 완료`);
      return true;
    } catch (error) {
      console.error('💥 사용자 이벤트 기록 오류:', error);
      return false;
    }
  }

  // 5. 설문 응답 저장
  static async saveSurveyResponse(response: SurveyResponse): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('survey_responses')
        .upsert(response, {
          onConflict: 'session_id,question_number',
          ignoreDuplicates: false
        });

      if (error) {
        console.error('❌ 설문 응답 저장 실패:', error);
        return false;
      }

      console.log('✅ 설문 응답 저장 완료:', response.question_number);
      return true;
    } catch (error) {
      console.error('💥 설문 응답 저장 오류:', error);
      return false;
    }
  }

  // 6. 테스트 결과 저장
  static async saveTestResult(result: TestResult): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('test_results')
        .upsert(result, {
          onConflict: 'session_id',
          ignoreDuplicates: false
        });

      if (error) {
        console.error('❌ 테스트 결과 저장 실패:', error);
        return false;
      }

      console.log('✅ 테스트 결과 저장 완료:', result.travel_type_code);
      return true;
    } catch (error) {
      console.error('💥 테스트 결과 저장 오류:', error);
      return false;
    }
  }

  // 7. 리드 정보 저장
  static async saveLead(lead: Lead): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('leads')
        .upsert(lead, {
          onConflict: 'session_id',
          ignoreDuplicates: false
        });

      if (error) {
        console.error('❌ 리드 정보 저장 실패:', error);
        return false;
      }

      console.log('✅ 리드 정보 저장 완료:', lead.contact_type);
      return true;
    } catch (error) {
      console.error('💥 리드 정보 저장 오류:', error);
      return false;
    }
  }

  // 8. 관리자 대시보드용 데이터 조회
  static async getFunnelMetrics() {
    try {
      const { data, error } = await supabase
        .from('current_funnel_metrics')
        .select('*')
        .single();

      if (error) {
        console.error('❌ 퍼널 메트릭 조회 실패:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('💥 퍼널 메트릭 조회 오류:', error);
      return null;
    }
  }

  static async getRealtimeStats() {
    try {
      const { data, error } = await supabase
        .from('realtime_stats')
        .select('*')
        .single();

      if (error) {
        console.error('❌ 실시간 통계 조회 실패:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('💥 실시간 통계 조회 오류:', error);
      return null;
    }
  }

  static async getTravelTypeAnalytics() {
    try {
      const { data, error } = await supabase
        .from('travel_type_analytics')
        .select('*')
        .order('completion_count', { ascending: false });

      if (error) {
        console.error('❌ 여행 유형 분석 조회 실패:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('💥 여행 유형 분석 조회 오류:', error);
      return [];
    }
  }

  // 9. 상세 세션 데이터 조회 (관리자용)
  static async getDetailedSessions(limit: number = 100) {
    try {
      const { data, error } = await supabase
        .from('anonymous_sessions')
        .select(`
          *,
          page_visits (*),
          survey_responses (*),
          test_results (*),
          leads (*)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('❌ 상세 세션 조회 실패:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('💥 상세 세션 조회 오류:', error);
      return [];
    }
  }

  // 10. 페이지별 성능 분석
  static async getPagePerformanceAnalytics(days: number = 7) {
    try {
      const { data, error } = await supabase
        .from('page_visits')
        .select('*')
        .gte('enter_time', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
        .order('enter_time', { ascending: false });

      if (error) {
        console.error('❌ 페이지 성능 분석 조회 실패:', error);
        return [];
      }

      // 라우트별 집계
      const routeStats: Record<string, any> = {};
      data?.forEach(visit => {
        if (!routeStats[visit.route]) {
          routeStats[visit.route] = {
            route: visit.route,
            total_visits: 0,
            total_duration: 0,
            total_scroll_depth: 0,
            total_clicks: 0,
            bounce_count: 0,
            cta_clicks: 0
          };
        }
        
        const stats = routeStats[visit.route];
        stats.total_visits++;
        stats.total_duration += visit.duration_ms || 0;
        stats.total_scroll_depth += visit.scroll_depth_percent || 0;
        stats.total_clicks += visit.click_count || 0;
        stats.cta_clicks += visit.cta_clicks || 0;
        if (visit.bounce) stats.bounce_count++;
      });

      // 평균 계산
      Object.values(routeStats).forEach((stats: any) => {
        stats.avg_duration_sec = Math.round(stats.total_duration / stats.total_visits / 1000);
        stats.avg_scroll_depth = Math.round(stats.total_scroll_depth / stats.total_visits);
        stats.avg_clicks = Math.round(stats.total_clicks / stats.total_visits);
        stats.bounce_rate = Math.round((stats.bounce_count / stats.total_visits) * 100);
        stats.cta_conversion_rate = Math.round((stats.cta_clicks / stats.total_visits) * 100);
      });

      return Object.values(routeStats);
    } catch (error) {
      console.error('💥 페이지 성능 분석 오류:', error);
      return [];
    }
  }

  // 11. 지역별 사용자 분석
  static async getGeographicAnalytics() {
    try {
      const { data, error } = await supabase
        .from('anonymous_sessions')
        .select('country, country_code, region, city, device_type')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      if (error) {
        console.error('❌ 지역별 분석 조회 실패:', error);
        return null;
      }

      // 국가별 집계
      const countryStats: Record<string, any> = {};
      const cityStats: Record<string, any> = {};
      
      data?.forEach(session => {
        // 국가별
        if (!countryStats[session.country]) {
          countryStats[session.country] = {
            country: session.country,
            country_code: session.country_code,
            total_sessions: 0,
            mobile_sessions: 0,
            desktop_sessions: 0
          };
        }
        countryStats[session.country].total_sessions++;
        if (session.device_type === 'mobile') countryStats[session.country].mobile_sessions++;
        if (session.device_type === 'desktop') countryStats[session.country].desktop_sessions++;

        // 도시별
        const cityKey = `${session.city}, ${session.country}`;
        if (!cityStats[cityKey]) {
          cityStats[cityKey] = {
            city: session.city,
            country: session.country,
            total_sessions: 0
          };
        }
        cityStats[cityKey].total_sessions++;
      });

      return {
        countries: Object.values(countryStats).sort((a: any, b: any) => b.total_sessions - a.total_sessions),
        cities: Object.values(cityStats).sort((a: any, b: any) => b.total_sessions - a.total_sessions).slice(0, 20)
      };
    } catch (error) {
      console.error('💥 지역별 분석 오류:', error);
      return null;
    }
  }

  // 12. 실시간 활성 사용자 (현재 페이지에 있는 사용자)
  static async getCurrentActiveUsers() {
    try {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      
      const { data, error } = await supabase
        .from('page_visits')
        .select('session_id, route, enter_time')
        .is('exit_time', null)
        .gte('enter_time', fiveMinutesAgo);

      if (error) {
        console.error('❌ 실시간 활성 사용자 조회 실패:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('💥 실시간 활성 사용자 조회 오류:', error);
      return [];
    }
  }
}

export default PostgresService;