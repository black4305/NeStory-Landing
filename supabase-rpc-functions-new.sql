-- Landing 프로젝트용 Supabase RPC 함수들
-- database.sql의 실제 테이블 구조에 완벽히 맞춘 버전

-- 1. 익명 세션 생성/업데이트 RPC (squeeze_anonymous_sessions 테이블 전체 컬럼)
CREATE OR REPLACE FUNCTION landing_create_or_update_session(
  -- 기본 세션 정보
  p_session_id varchar(255),
  p_user_agent text,
  
  -- 선택적 매개변수들
  p_session_duration_ms integer DEFAULT 0,
  p_is_active boolean DEFAULT true,
  p_ip_address inet DEFAULT NULL,
  p_device_type varchar(50) DEFAULT NULL,
  p_device_brand varchar(100) DEFAULT NULL,
  p_device_model varchar(100) DEFAULT NULL,
  p_os varchar(100) DEFAULT NULL,
  p_os_version varchar(50) DEFAULT NULL,
  p_browser varchar(100) DEFAULT NULL,
  p_browser_version varchar(50) DEFAULT NULL,
  p_screen_width integer DEFAULT NULL,
  p_screen_height integer DEFAULT NULL,
  p_pixel_ratio decimal(3,2) DEFAULT NULL,
  
  -- 위치 정보
  p_country varchar(100) DEFAULT NULL,
  p_country_code varchar(10) DEFAULT NULL,
  p_region varchar(100) DEFAULT NULL,
  p_region_code varchar(10) DEFAULT NULL,
  p_city varchar(100) DEFAULT NULL,
  p_zip_code varchar(20) DEFAULT NULL,
  p_latitude decimal(10, 8) DEFAULT NULL,
  p_longitude decimal(11, 8) DEFAULT NULL,
  p_timezone varchar(100) DEFAULT NULL,
  p_isp varchar(200) DEFAULT NULL,
  p_organization varchar(200) DEFAULT NULL,
  p_asn varchar(50) DEFAULT NULL,
  
  -- 네트워크 정보
  p_connection_type varchar(50) DEFAULT NULL,
  p_effective_type varchar(20) DEFAULT NULL,
  p_downlink decimal(10, 2) DEFAULT NULL,
  p_rtt integer DEFAULT NULL,
  p_save_data boolean DEFAULT NULL,
  
  -- 브라우저 능력
  p_webgl_support boolean DEFAULT false,
  p_webgl_vendor varchar(200) DEFAULT NULL,
  p_webgl_renderer varchar(200) DEFAULT NULL,
  p_local_storage boolean DEFAULT false,
  p_session_storage boolean DEFAULT false,
  p_indexed_db boolean DEFAULT false,
  p_service_workers boolean DEFAULT false,
  p_geolocation boolean DEFAULT false,
  
  -- 기타 정보
  p_language varchar(10) DEFAULT NULL,
  p_languages jsonb DEFAULT NULL,
  p_timezone_offset integer DEFAULT NULL,
  p_referrer text DEFAULT NULL,
  p_landing_page text DEFAULT NULL,
  p_campaign_source varchar(100) DEFAULT NULL,
  p_campaign_medium varchar(100) DEFAULT NULL,
  p_campaign_name varchar(100) DEFAULT NULL,
  p_campaign_term varchar(100) DEFAULT NULL,
  p_campaign_content varchar(100) DEFAULT NULL,
  
  -- 행동 데이터
  p_page_views integer DEFAULT 0,
  p_total_clicks integer DEFAULT 0,
  p_total_scroll_events integer DEFAULT 0,
  p_max_scroll_depth decimal(5, 2) DEFAULT 0,
  p_bounce_rate decimal(5, 2) DEFAULT 0,
  p_engagement_score integer DEFAULT 0,
  
  -- 기술적 정보
  p_visit_count integer DEFAULT 1,
  p_last_visit timestamp with time zone DEFAULT NULL,
  p_ad_blocker_detected boolean DEFAULT false,
  p_canvas_fingerprint varchar(200) DEFAULT NULL,
  p_audio_fingerprint varchar(200) DEFAULT NULL,
  p_installed_fonts jsonb DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
AS $$
DECLARE
  result_record squeeze_anonymous_sessions%ROWTYPE;
BEGIN
  INSERT INTO squeeze_anonymous_sessions (
    session_id, created_at, updated_at, last_activity, session_duration_ms, is_active,
    user_agent, ip_address, device_type, device_brand, device_model, os, os_version,
    browser, browser_version, screen_width, screen_height, pixel_ratio,
    country, country_code, region, region_code, city, zip_code, latitude, longitude,
    timezone, isp, organization, asn,
    connection_type, effective_type, downlink, rtt, save_data,
    webgl_support, webgl_vendor, webgl_renderer, local_storage, session_storage,
    indexed_db, service_workers, geolocation,
    language, languages, timezone_offset, referrer, landing_page,
    campaign_source, campaign_medium, campaign_name, campaign_term, campaign_content,
    page_views, total_clicks, total_scroll_events, max_scroll_depth, bounce_rate, engagement_score,
    visit_count, last_visit, ad_blocker_detected, canvas_fingerprint, audio_fingerprint, installed_fonts
  ) VALUES (
    p_session_id, NOW(), NOW(), NOW(), p_session_duration_ms, p_is_active,
    p_user_agent, p_ip_address, p_device_type, p_device_brand, p_device_model, p_os, p_os_version,
    p_browser, p_browser_version, p_screen_width, p_screen_height, p_pixel_ratio,
    p_country, p_country_code, p_region, p_region_code, p_city, p_zip_code, p_latitude, p_longitude,
    p_timezone, p_isp, p_organization, p_asn,
    p_connection_type, p_effective_type, p_downlink, p_rtt, p_save_data,
    p_webgl_support, p_webgl_vendor, p_webgl_renderer, p_local_storage, p_session_storage,
    p_indexed_db, p_service_workers, p_geolocation,
    p_language, p_languages, p_timezone_offset, p_referrer, p_landing_page,
    p_campaign_source, p_campaign_medium, p_campaign_name, p_campaign_term, p_campaign_content,
    p_page_views, p_total_clicks, p_total_scroll_events, p_max_scroll_depth, p_bounce_rate, p_engagement_score,
    p_visit_count, p_last_visit, p_ad_blocker_detected, p_canvas_fingerprint, p_audio_fingerprint, p_installed_fonts
  )
  ON CONFLICT (session_id) DO UPDATE SET
    updated_at = NOW(),
    last_activity = NOW(),
    session_duration_ms = EXCLUDED.session_duration_ms,
    is_active = EXCLUDED.is_active,
    -- 누적 행동 데이터 업데이트
    page_views = squeeze_anonymous_sessions.page_views + EXCLUDED.page_views,
    total_clicks = squeeze_anonymous_sessions.total_clicks + EXCLUDED.total_clicks,
    total_scroll_events = squeeze_anonymous_sessions.total_scroll_events + EXCLUDED.total_scroll_events,
    max_scroll_depth = GREATEST(squeeze_anonymous_sessions.max_scroll_depth, EXCLUDED.max_scroll_depth),
    bounce_rate = EXCLUDED.bounce_rate,
    engagement_score = EXCLUDED.engagement_score,
    visit_count = squeeze_anonymous_sessions.visit_count + 1,
    last_visit = NOW(),
    -- NULL이 아닌 값으로 업데이트
    user_agent = COALESCE(EXCLUDED.user_agent, squeeze_anonymous_sessions.user_agent),
    ip_address = COALESCE(EXCLUDED.ip_address, squeeze_anonymous_sessions.ip_address),
    device_type = COALESCE(EXCLUDED.device_type, squeeze_anonymous_sessions.device_type),
    country = COALESCE(EXCLUDED.country, squeeze_anonymous_sessions.country),
    city = COALESCE(EXCLUDED.city, squeeze_anonymous_sessions.city)
  RETURNING * INTO result_record;

  RETURN json_build_object(
    'success', true,
    'data', row_to_json(result_record)
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;

-- 2. 페이지 방문 기록 RPC (squeeze_page_visits 테이블 전체 컬럼)
CREATE OR REPLACE FUNCTION landing_record_page_visit(
  -- 기본 정보
  p_session_id varchar(255),
  p_route varchar(500),
  p_page_title varchar(500) DEFAULT NULL,
  p_full_url text DEFAULT NULL,
  p_url_params jsonb DEFAULT NULL,
  
  -- 시간 정보
  p_exit_time timestamp with time zone DEFAULT NULL,
  p_duration_ms integer DEFAULT NULL,
  
  -- 사용자 행동
  p_scroll_depth_percent decimal(5, 2) DEFAULT 0,
  p_max_scroll_position integer DEFAULT 0,
  p_click_count integer DEFAULT 0,
  p_interaction_count integer DEFAULT 0,
  p_form_submissions integer DEFAULT 0,
  
  -- Landing 특화 행동
  p_cta_clicks integer DEFAULT 0,
  p_lead_magnet_downloads integer DEFAULT 0,
  p_video_play_count integer DEFAULT 0,
  p_video_completion_rate decimal(5, 2) DEFAULT 0,
  
  -- 이탈 정보
  p_bounce boolean DEFAULT false,
  p_exit_intent_triggered boolean DEFAULT false,
  p_exit_type varchar(50) DEFAULT NULL,
  p_exit_reason varchar(200) DEFAULT NULL,
  
  -- 성능 정보
  p_load_time_ms integer DEFAULT NULL,
  p_dom_ready_time_ms integer DEFAULT NULL,
  p_first_paint_ms integer DEFAULT NULL,
  p_first_contentful_paint_ms integer DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
AS $$
DECLARE
  result_record squeeze_page_visits%ROWTYPE;
BEGIN
  INSERT INTO squeeze_page_visits (
    session_id, route, page_title, full_url, url_params,
    enter_time, exit_time, duration_ms,
    scroll_depth_percent, max_scroll_position, click_count, interaction_count, form_submissions,
    cta_clicks, lead_magnet_downloads, video_play_count, video_completion_rate,
    bounce, exit_intent_triggered, exit_type, exit_reason,
    load_time_ms, dom_ready_time_ms, first_paint_ms, first_contentful_paint_ms
  ) VALUES (
    p_session_id, p_route, p_page_title, p_full_url, p_url_params,
    NOW(), p_exit_time, p_duration_ms,
    p_scroll_depth_percent, p_max_scroll_position, p_click_count, p_interaction_count, p_form_submissions,
    p_cta_clicks, p_lead_magnet_downloads, p_video_play_count, p_video_completion_rate,
    p_bounce, p_exit_intent_triggered, p_exit_type, p_exit_reason,
    p_load_time_ms, p_dom_ready_time_ms, p_first_paint_ms, p_first_contentful_paint_ms
  )
  RETURNING * INTO result_record;

  RETURN json_build_object(
    'success', true,
    'data', row_to_json(result_record)
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;

-- 3. 사용자 이벤트 기록 RPC (squeeze_user_events 테이블 전체 컬럼)
CREATE OR REPLACE FUNCTION landing_record_user_event(
  -- 기본 정보
  p_session_id varchar(255),
  p_event_type varchar(50),
  p_timestamp_ms bigint,
  
  -- 선택적 매개변수들
  p_page_visit_id uuid DEFAULT NULL,
  p_element_id varchar(200) DEFAULT NULL,
  p_element_type varchar(100) DEFAULT NULL,
  p_element_text text DEFAULT NULL,
  p_element_value text DEFAULT NULL,
  
  -- Landing 특화 이벤트 데이터
  p_cta_type varchar(100) DEFAULT NULL,
  p_lead_magnet_type varchar(100) DEFAULT NULL,
  p_conversion_step varchar(100) DEFAULT NULL,
  
  -- 위치 정보
  p_click_x integer DEFAULT NULL,
  p_click_y integer DEFAULT NULL,
  p_scroll_position integer DEFAULT NULL,
  p_viewport_width integer DEFAULT NULL,
  p_viewport_height integer DEFAULT NULL,
  p_time_on_page_ms integer DEFAULT NULL,
  
  -- 메타데이터
  p_metadata jsonb DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
AS $$
DECLARE
  result_record squeeze_user_events%ROWTYPE;
BEGIN
  INSERT INTO squeeze_user_events (
    session_id, page_visit_id, event_type, element_id, element_type, element_text, element_value,
    cta_type, lead_magnet_type, conversion_step,
    click_x, click_y, scroll_position, viewport_width, viewport_height,
    timestamp_ms, time_on_page_ms, metadata
  ) VALUES (
    p_session_id, p_page_visit_id, p_event_type, p_element_id, p_element_type, p_element_text, p_element_value,
    p_cta_type, p_lead_magnet_type, p_conversion_step,
    p_click_x, p_click_y, p_scroll_position, p_viewport_width, p_viewport_height,
    p_timestamp_ms, p_time_on_page_ms, p_metadata
  )
  RETURNING * INTO result_record;

  RETURN json_build_object(
    'success', true,
    'data', row_to_json(result_record)
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;

-- 4. 리드 저장 RPC (squeeze_leads 테이블 전체 컬럼)
CREATE OR REPLACE FUNCTION landing_save_lead(
  -- 기본 정보
  p_session_id varchar(255),
  p_lead_source varchar(100),
  
  -- 연락처 정보
  p_email varchar(255) DEFAULT NULL,
  p_phone varchar(50) DEFAULT NULL,
  p_name varchar(200) DEFAULT NULL,
  p_company varchar(200) DEFAULT NULL,
  p_job_title varchar(100) DEFAULT NULL,
  
  -- 동의 정보
  p_email_consent boolean DEFAULT false,
  p_sms_consent boolean DEFAULT false,
  p_marketing_consent boolean DEFAULT false,
  p_privacy_consent boolean DEFAULT false,
  p_newsletter_consent boolean DEFAULT false,
  p_lead_medium varchar(100) DEFAULT NULL,
  p_lead_campaign varchar(100) DEFAULT NULL,
  p_conversion_page varchar(500) DEFAULT NULL,
  p_lead_magnet_name varchar(200) DEFAULT NULL,
  
  -- 스코어링
  p_lead_score integer DEFAULT 0,
  p_lead_quality varchar(20) DEFAULT 'cold',
  p_conversion_likelihood decimal(5, 2) DEFAULT 0,
  p_engagement_level varchar(20) DEFAULT 'low',
  
  -- 시간 정보
  p_follow_up_needed_at timestamp with time zone DEFAULT NULL,
  p_last_contact_attempt timestamp with time zone DEFAULT NULL,
  
  -- 외부 연동
  p_webhook_sent boolean DEFAULT false,
  p_webhook_sent_at timestamp with time zone DEFAULT NULL,
  p_webhook_response jsonb DEFAULT NULL,
  p_crm_synced boolean DEFAULT false,
  p_crm_contact_id varchar(100) DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
AS $$
DECLARE
  result_record squeeze_leads%ROWTYPE;
BEGIN
  INSERT INTO squeeze_leads (
    session_id, email, phone, name, company, job_title,
    email_consent, sms_consent, marketing_consent, privacy_consent, newsletter_consent,
    lead_source, lead_medium, lead_campaign, conversion_page, lead_magnet_name,
    lead_score, lead_quality, conversion_likelihood, engagement_level,
    converted_at, follow_up_needed_at, last_contact_attempt,
    webhook_sent, webhook_sent_at, webhook_response, crm_synced, crm_contact_id
  ) VALUES (
    p_session_id, p_email, p_phone, p_name, p_company, p_job_title,
    p_email_consent, p_sms_consent, p_marketing_consent, p_privacy_consent, p_newsletter_consent,
    p_lead_source, p_lead_medium, p_lead_campaign, p_conversion_page, p_lead_magnet_name,
    p_lead_score, p_lead_quality, p_conversion_likelihood, p_engagement_level,
    NOW(), p_follow_up_needed_at, p_last_contact_attempt,
    p_webhook_sent, p_webhook_sent_at, p_webhook_response, p_crm_synced, p_crm_contact_id
  )
  RETURNING * INTO result_record;

  RETURN json_build_object(
    'success', true,
    'data', row_to_json(result_record)
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;

-- 5. 전환 추적 RPC (squeeze_conversions 테이블 전체 컬럼)
CREATE OR REPLACE FUNCTION landing_record_conversion(
  -- 기본 정보
  p_session_id varchar(255),
  p_conversion_type varchar(100),
  
  -- 선택적 매개변수들
  p_lead_id uuid DEFAULT NULL,
  p_conversion_value decimal(10, 2) DEFAULT 0,
  p_conversion_step integer DEFAULT 1,
  p_total_conversion_steps integer DEFAULT 1,
  
  -- 전환 경로 분석
  p_conversion_path jsonb DEFAULT NULL,
  p_touchpoints_before_conversion integer DEFAULT 0,
  p_days_to_conversion integer DEFAULT 0,
  p_sessions_to_conversion integer DEFAULT 1,
  
  -- 전환 맥락
  p_conversion_trigger varchar(200) DEFAULT NULL,
  p_page_position varchar(100) DEFAULT NULL,
  p_time_on_page_seconds integer DEFAULT NULL,
  p_scroll_depth_at_conversion decimal(5, 2) DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
AS $$
DECLARE
  result_record squeeze_conversions%ROWTYPE;
BEGIN
  INSERT INTO squeeze_conversions (
    session_id, lead_id,
    conversion_type, conversion_value, conversion_step, total_conversion_steps,
    conversion_path, touchpoints_before_conversion, days_to_conversion, sessions_to_conversion,
    conversion_trigger, page_position, time_on_page_seconds, scroll_depth_at_conversion,
    converted_at
  ) VALUES (
    p_session_id, p_lead_id,
    p_conversion_type, p_conversion_value, p_conversion_step, p_total_conversion_steps,
    p_conversion_path, p_touchpoints_before_conversion, p_days_to_conversion, p_sessions_to_conversion,
    p_conversion_trigger, p_page_position, p_time_on_page_seconds, p_scroll_depth_at_conversion,
    NOW()
  )
  RETURNING * INTO result_record;

  RETURN json_build_object(
    'success', true,
    'data', row_to_json(result_record)
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;

-- 6. 페이지 방문 업데이트 RPC (페이지 이탈 시 호출)
CREATE OR REPLACE FUNCTION landing_update_page_visit(
  p_page_visit_id uuid,
  p_exit_time timestamp with time zone DEFAULT NOW(),
  p_duration_ms integer DEFAULT NULL,
  p_scroll_depth_percent decimal(5, 2) DEFAULT NULL,
  p_max_scroll_position integer DEFAULT NULL,
  p_click_count integer DEFAULT NULL,
  p_interaction_count integer DEFAULT NULL,
  p_cta_clicks integer DEFAULT NULL,
  p_lead_magnet_downloads integer DEFAULT NULL,
  p_video_completion_rate decimal(5, 2) DEFAULT NULL,
  p_bounce boolean DEFAULT NULL,
  p_exit_intent_triggered boolean DEFAULT NULL,
  p_exit_type varchar(50) DEFAULT NULL,
  p_exit_reason varchar(200) DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
AS $$
DECLARE
  result_record squeeze_page_visits%ROWTYPE;
BEGIN
  UPDATE squeeze_page_visits SET
    exit_time = p_exit_time,
    duration_ms = COALESCE(p_duration_ms, EXTRACT(EPOCH FROM (p_exit_time - enter_time)) * 1000),
    scroll_depth_percent = COALESCE(p_scroll_depth_percent, scroll_depth_percent),
    max_scroll_position = COALESCE(p_max_scroll_position, max_scroll_position),
    click_count = COALESCE(p_click_count, click_count),
    interaction_count = COALESCE(p_interaction_count, interaction_count),
    cta_clicks = COALESCE(p_cta_clicks, cta_clicks),
    lead_magnet_downloads = COALESCE(p_lead_magnet_downloads, lead_magnet_downloads),
    video_completion_rate = COALESCE(p_video_completion_rate, video_completion_rate),
    bounce = COALESCE(p_bounce, bounce),
    exit_intent_triggered = COALESCE(p_exit_intent_triggered, exit_intent_triggered),
    exit_type = COALESCE(p_exit_type, exit_type),
    exit_reason = COALESCE(p_exit_reason, exit_reason)
  WHERE id = p_page_visit_id
  RETURNING * INTO result_record;

  RETURN json_build_object(
    'success', true,
    'data', row_to_json(result_record)
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;

-- 7. 세션 업데이트 RPC (행동 데이터 누적)
CREATE OR REPLACE FUNCTION landing_update_session_behavior(
  p_session_id varchar(255),
  p_session_duration_ms integer DEFAULT NULL,
  p_page_views integer DEFAULT 0,
  p_total_clicks integer DEFAULT 0,
  p_total_scroll_events integer DEFAULT 0,
  p_max_scroll_depth decimal(5, 2) DEFAULT NULL,
  p_bounce_rate decimal(5, 2) DEFAULT NULL,
  p_engagement_score integer DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
AS $$
DECLARE
  result_record squeeze_anonymous_sessions%ROWTYPE;
BEGIN
  UPDATE squeeze_anonymous_sessions SET
    last_activity = NOW(),
    session_duration_ms = COALESCE(p_session_duration_ms, session_duration_ms),
    page_views = page_views + p_page_views,
    total_clicks = total_clicks + p_total_clicks,
    total_scroll_events = total_scroll_events + p_total_scroll_events,
    max_scroll_depth = GREATEST(max_scroll_depth, COALESCE(p_max_scroll_depth, 0)),
    bounce_rate = COALESCE(p_bounce_rate, bounce_rate),
    engagement_score = COALESCE(p_engagement_score, engagement_score)
  WHERE session_id = p_session_id
  RETURNING * INTO result_record;

  RETURN json_build_object(
    'success', true,
    'data', row_to_json(result_record)
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;