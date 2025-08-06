import { createClient } from '@supabase/supabase-js';

// Supabase 환경 변수 설정
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 기존 PostgresService와 동일한 인터페이스 유지
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
  // 추가 위치 정보 필드
  country_code?: string;
  region?: string;
  region_code?: string;
  zip_code?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  isp?: string;
  organization?: string;
  asn?: string;
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
  cta_clicks?: number;
  form_interactions?: number;
  bounce?: boolean;
  exit_intent_triggered?: boolean;
  load_time_ms?: number;
  exit_time?: string | Date;
  [key: string]: any;
}

export interface UserEvent {
  session_id: string;
  event_type: string;
  event_data?: any;
  timestamp?: Date | string;
  page_visit_id?: string;
  element_id?: string;
  element_type?: string;
  element_text?: string;
  element_value?: any;
  target_element?: string;
  target_text?: string;
  target_value?: any;
  click_x?: number;
  click_y?: number;
  scroll_position?: number;
  viewport_width?: number;
  viewport_height?: number;
  time_on_page_ms?: number;
  timestamp_ms?: number;
  mouse_x?: number;
  mouse_y?: number;
  keyboard_key?: string;
  scroll_x?: number;
  scroll_y?: number;
  error_message?: string;
  metadata?: any;
  created_at?: Date | string;
}

export interface Lead {
  session_id: string;
  email?: string;
  phone?: string;
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
}

export interface SurveyResponse {
  session_id: string;
  question_id: string | number;
  question_number?: number;
  question_text?: string;
  option_a?: string;
  option_b?: string;
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
}

export class SupabaseService {
  // 1. 초기 데이터 조회
  async getInitialData() {
    try {
      // 기본 통계 데이터 조회
      const { data: sessions, error: sessionError } = await supabase
        .from('squeeze_anonymous_sessions')
        .select('*')
        .limit(10);

      if (sessionError) throw sessionError;

      return {
        success: true,
        data: {
          sessions: sessions || []
        }
      };
    } catch (error) {
      console.error('초기 데이터 조회 오류:', error);
      return { success: false, error: '초기 데이터를 불러올 수 없습니다.' };
    }
  }

  // 2. 세션 생성/업데이트 (RPC 사용)
  async createOrUpdateSession(sessionData: AnonymousSession) {
    try {
      const { data, error } = await supabase.rpc('landing_create_or_update_session', {
        p_session_id: sessionData.session_id,
        p_user_agent: sessionData.user_agent,
        p_ip_address: sessionData.ip_address,
        p_device_type: sessionData.device_type,
        p_country: sessionData.country,
        p_city: sessionData.city,
        p_referrer: sessionData.referrer,
        p_landing_page: sessionData.landing_page,
        // 추가 위치 정보 파라미터
        p_country_code: sessionData.country_code,
        p_region: sessionData.region,
        p_region_code: sessionData.region_code,
        p_zip_code: sessionData.zip_code,
        p_latitude: sessionData.latitude,
        p_longitude: sessionData.longitude,
        p_timezone: sessionData.timezone,
        p_isp: sessionData.isp,
        p_organization: sessionData.organization,
        p_asn: sessionData.asn
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('세션 생성/업데이트 오류:', error);
      return { success: false, error: '세션을 저장할 수 없습니다.' };
    }
  }

  // 3. 페이지 방문 기록 (RPC 사용)
  async recordPageVisit(visitData: PageVisit) {
    try {
      const { data, error } = await supabase.rpc('landing_record_page_visit', {
        p_session_id: visitData.session_id,
        p_route: visitData.route,
        p_page_title: visitData.page_title,
        p_full_url: window.location.href,
        p_url_params: visitData.url_params,
        p_scroll_depth_percent: visitData.scroll_depth_percent || 0,
        p_click_count: visitData.click_count || 0,
        p_interaction_count: visitData.interaction_count || 0,
        p_form_submissions: 0,
        p_cta_clicks: visitData.cta_clicks || 0,
        p_load_time_ms: visitData.load_time_ms ? Math.round(visitData.load_time_ms) : null
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('페이지 방문 기록 오류:', error);
      return { success: false, error: '페이지 방문을 기록할 수 없습니다.' };
    }
  }

  // 4. 사용자 이벤트 기록 (RPC 사용)
  async recordUserEvent(eventData: UserEvent) {
    try {
      const { data, error } = await supabase.rpc('landing_record_user_event', {
        p_session_id: eventData.session_id,
        p_page_visit_id: eventData.page_visit_id,
        p_event_type: eventData.event_type,
        p_element_id: eventData.element_id,
        p_element_type: eventData.element_type,
        p_element_text: eventData.element_text,
        p_element_value: eventData.element_value,
        p_click_x: eventData.click_x,
        p_click_y: eventData.click_y,
        p_scroll_position: eventData.scroll_position,
        p_viewport_width: window.innerWidth,
        p_viewport_height: window.innerHeight,
        p_timestamp_ms: eventData.timestamp_ms || Date.now(),
        p_time_on_page_ms: eventData.time_on_page_ms,
        p_metadata: eventData.metadata
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('사용자 이벤트 기록 오류:', error);
      return { success: false, error: '이벤트를 기록할 수 없습니다.' };
    }
  }

  // 5. 배치 이벤트 기록 (개별 RPC 호출)
  async recordBatchEvents(events: UserEvent[]) {
    try {
      const results = await Promise.all(
        events.map(event => this.recordUserEvent(event))
      );

      const successCount = results.filter(r => r.success).length;
      
      return {
        success: successCount > 0,
        data: { processed: events.length, successful: successCount }
      };
    } catch (error) {
      console.error('배치 이벤트 기록 오류:', error);
      return { success: false, error: '배치 이벤트를 기록할 수 없습니다.' };
    }
  }

  // 6. 리드 저장 (RPC 사용)
  async saveLead(leadData: Lead) {
    try {
      const { data, error } = await supabase.rpc('landing_save_lead', {
        p_session_id: leadData.session_id,
        p_email: leadData.email,
        p_phone: leadData.phone || null,
        p_name: leadData.name,
        p_contact_type: leadData.contact_type,
        p_contact_value: leadData.contact_value,
        p_marketing_consent: leadData.marketing_consent,
        p_privacy_consent: leadData.privacy_consent,
        p_kakao_channel_added: leadData.kakao_channel_added,
        p_lead_source: leadData.lead_source || leadData.source,
        p_travel_type: leadData.travel_type,
        p_lead_score: leadData.lead_score,
        p_webhook_sent: leadData.webhook_sent || false
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('리드 저장 오류:', error);
      return { success: false, error: '리드를 저장할 수 없습니다.' };
    }
  }

  // 7. 테스트 결과 저장
  async saveTestResult(resultData: TestResult) {
    try {
      const { data, error } = await supabase
        .from('squeeze_test_results')
        .insert({
          ...resultData,
          created_at: new Date().toISOString()
        })
        .select();

      if (error) throw error;

      return { success: true, data: data?.[0] };
    } catch (error) {
      console.error('테스트 결과 저장 오류:', error);
      return { success: false, error: '테스트 결과를 저장할 수 없습니다.' };
    }
  }

  // 8. 전환 추적 (RPC 사용)
  async recordConversion(conversionData: any) {
    try {
      const { data, error } = await supabase.rpc('landing_record_conversion', {
        p_session_id: conversionData.session_id,
        p_conversion_type: conversionData.conversion_type,
        p_conversion_value: conversionData.conversion_value,
        p_conversion_currency: conversionData.conversion_currency || 'USD',
        p_funnel_step: conversionData.funnel_step,
        p_funnel_stage: conversionData.funnel_stage,
        p_conversion_path: conversionData.conversion_path,
        p_attribution_source: conversionData.attribution_source,
        p_attribution_medium: conversionData.attribution_medium,
        p_conversion_page: conversionData.conversion_page,
        p_time_to_conversion_ms: conversionData.time_to_conversion_ms,
        p_device_type: conversionData.device_type,
        p_country: conversionData.country,
        p_city: conversionData.city,
        p_metadata: conversionData.metadata
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('전환 추적 오류:', error);
      return { success: false, error: '전환을 기록할 수 없습니다.' };
    }
  }

  // 9. 분석 데이터 조회
  async getFunnelMetrics() {
    try {
      // 세션 통계
      const { data: sessionStats, error: sessionError } = await supabase
        .from('squeeze_anonymous_sessions')
        .select('session_id, created_at')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if (sessionError) throw sessionError;

      // 리드 통계
      const { data: leadStats, error: leadError } = await supabase
        .from('squeeze_leads')
        .select('session_id, created_at')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if (leadError) throw leadError;

      const totalSessions = sessionStats?.length || 0;
      const totalLeads = leadStats?.length || 0;
      const conversionRate = totalSessions > 0 ? (totalLeads / totalSessions) * 100 : 0;

      return {
        success: true,
        data: {
          totalSessions,
          totalLeads,
          conversionRate: Math.round(conversionRate * 100) / 100
        }
      };
    } catch (error) {
      console.error('퍼널 메트릭스 조회 오류:', error);
      return { success: false, error: '분석 데이터를 불러올 수 없습니다.' };
    }
  }

  // 10. 실시간 통계
  async getRealtimeStats() {
    try {
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

      // 오늘 세션 수
      const { data: todaySessions, error: todayError } = await supabase
        .from('squeeze_anonymous_sessions')
        .select('session_id')
        .gte('created_at', oneDayAgo.toISOString());

      if (todayError) throw todayError;

      // 현재 활성 세션 (1시간 이내 활동)
      const { data: activeSessions, error: activeError } = await supabase
        .from('squeeze_anonymous_sessions')
        .select('session_id')
        .gte('last_activity', oneHourAgo.toISOString());

      if (activeError) throw activeError;

      return {
        success: true,
        data: {
          sessionsToday: todaySessions?.length || 0,
          activeSessions: activeSessions?.length || 0
        }
      };
    } catch (error) {
      console.error('실시간 통계 조회 오류:', error);
      return { success: false, error: '실시간 통계를 불러올 수 없습니다.' };
    }
  }

  // 11. 여행 유형별 분석
  async getTravelTypeAnalytics() {
    try {
      const { data: results, error } = await supabase
        .from('squeeze_test_results')
        .select('type_code')
        .not('type_code', 'is', null);

      if (error) throw error;

      // 유형별 카운트
      const typeCounts = (results || []).reduce((acc, result) => {
        const type = result.type_code;
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        success: true,
        data: typeCounts
      };
    } catch (error) {
      console.error('여행 유형 분석 조회 오류:', error);
      return { success: false, error: '여행 유형 분석을 불러올 수 없습니다.' };
    }
  }

  // 12. 페이지 성능 분석
  async getPagePerformanceAnalytics() {
    try {
      const { data: visits, error } = await supabase
        .from('squeeze_page_visits')
        .select('route, enter_time, exit_time, scroll_depth_percent')
        .gte('enter_time', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;

      // 페이지별 통계 계산
      const pageStats = (visits || []).reduce((acc, visit) => {
        const route = visit.route;
        if (!acc[route]) {
          acc[route] = {
            visits: 0,
            totalTime: 0,
            avgScrollDepth: 0,
            scrollSamples: 0
          };
        }
        
        acc[route].visits++;
        
        if (visit.enter_time && visit.exit_time) {
          const duration = new Date(visit.exit_time).getTime() - new Date(visit.enter_time).getTime();
          acc[route].totalTime += duration;
        }
        
        if (visit.scroll_depth_percent) {
          acc[route].avgScrollDepth += visit.scroll_depth_percent;
          acc[route].scrollSamples++;
        }
        
        return acc;
      }, {} as Record<string, any>);

      // 평균 계산
      Object.keys(pageStats).forEach(route => {
        const stats = pageStats[route];
        stats.avgTime = stats.visits > 0 ? stats.totalTime / stats.visits : 0;
        stats.avgScrollDepth = stats.scrollSamples > 0 ? stats.avgScrollDepth / stats.scrollSamples : 0;
      });

      return {
        success: true,
        data: pageStats
      };
    } catch (error) {
      console.error('페이지 성능 분석 조회 오류:', error);
      return { success: false, error: '페이지 성능 분석을 불러올 수 없습니다.' };
    }
  }

  // 13. 활성 사용자 데이터
  async getActiveUserData() {
    try {
      const { data: users, error } = await supabase
        .from('squeeze_anonymous_sessions')
        .select('session_id, device_type, country, city, last_activity')
        .gte('last_activity', new Date(Date.now() - 60 * 60 * 1000).toISOString())
        .order('last_activity', { ascending: false });

      if (error) throw error;

      return {
        success: true,
        data: users || []
      };
    } catch (error) {
      console.error('활성 사용자 데이터 조회 오류:', error);
      return { success: false, error: '활성 사용자 데이터를 불러올 수 없습니다.' };
    }
  }

  // 14. 지역별 분석
  async getGeographicAnalytics() {
    try {
      const { data: sessions, error } = await supabase
        .from('squeeze_anonymous_sessions')
        .select('country, city')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;

      // 국가별 카운트
      const countryCounts = (sessions || []).reduce((acc, session) => {
        const country = session.country || 'Unknown';
        acc[country] = (acc[country] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // 도시별 카운트
      const cityCounts = (sessions || []).reduce((acc, session) => {
        const city = session.city || 'Unknown';
        acc[city] = (acc[city] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        success: true,
        data: {
          countries: countryCounts,
          cities: cityCounts
        }
      };
    } catch (error) {
      console.error('지역별 분석 조회 오류:', error);
      return { success: false, error: '지역별 분석을 불러올 수 없습니다.' };
    }
  }

  // 15. 현재 활성 사용자
  async getCurrentActiveUsers() {
    try {
      const { data: activeUsers, error } = await supabase
        .from('squeeze_anonymous_sessions')
        .select('session_id')
        .gte('last_activity', new Date(Date.now() - 5 * 60 * 1000).toISOString());

      if (error) throw activeUsers;

      return {
        success: true,
        data: {
          count: activeUsers?.length || 0
        }
      };
    } catch (error) {
      console.error('현재 활성 사용자 조회 오류:', error);
      return { success: false, error: '활성 사용자를 불러올 수 없습니다.' };
    }
  }

  // 16. 페이지 방문 종료 업데이트
  async updatePageVisitExit(visitId: string, exitData: any) {
    try {
      const { data, error } = await supabase
        .from('squeeze_page_visits')
        .update({
          ...exitData,
          exit_time: new Date().toISOString()
        })
        .eq('id', visitId)
        .select();

      if (error) throw error;

      return { success: true, data: data?.[0] };
    } catch (error) {
      console.error('페이지 방문 종료 업데이트 오류:', error);
      return { success: false, error: '페이지 방문 종료를 업데이트할 수 없습니다.' };
    }
  }

  // 17. Survey 응답 저장 (Survey 연동용)
  async saveSurveyResponse(responseData: any) {
    try {
      const { data, error } = await supabase
        .from('survey_responses')
        .insert({
          ...responseData,
          created_at: new Date().toISOString()
        })
        .select();

      if (error) throw error;

      return { success: true, data: data?.[0] };
    } catch (error) {
      console.error('Survey 응답 저장 오류:', error);
      return { success: false, error: 'Survey 응답을 저장할 수 없습니다.' };
    }
  }
}

// 싱글톤 인스턴스 생성
export const supabaseService = new SupabaseService();
export default supabaseService;