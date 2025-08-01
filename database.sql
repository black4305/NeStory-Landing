-- 🗄️ Landing 프로젝트 PostgreSQL 데이터베이스 스키마
-- 최종본 (2025.08.01)
-- ⚠️ 삭제 금지 - 이 파일을 삭제하지 마세요
--
-- 테이블 네이밍: squeeze_ 접두사 사용
-- 데이터베이스: funnel_analytics
-- 프로젝트: Landing (landing.nestory.co.kr)

-- Landing 프로젝트 익명 세션 테이블
CREATE TABLE squeeze_anonymous_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(255) UNIQUE NOT NULL,
    
    -- 기본 세션 정보
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    session_duration_ms INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    
    -- 디바이스 정보
    user_agent TEXT NOT NULL,
    ip_address INET,
    device_type VARCHAR(50), -- mobile, tablet, desktop, tv
    device_brand VARCHAR(100),
    device_model VARCHAR(100),
    os VARCHAR(100),
    os_version VARCHAR(50),
    browser VARCHAR(100),
    browser_version VARCHAR(50),
    screen_width INTEGER,
    screen_height INTEGER,
    pixel_ratio DECIMAL(3,2),
    
    -- 위치 정보
    country VARCHAR(100),
    country_code VARCHAR(10),
    region VARCHAR(100),
    region_code VARCHAR(10),
    city VARCHAR(100),
    zip_code VARCHAR(20),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    timezone VARCHAR(100),
    isp VARCHAR(200),
    organization VARCHAR(200),
    asn VARCHAR(50),
    
    -- 네트워크 정보
    connection_type VARCHAR(50),
    effective_type VARCHAR(20), -- 4g, 3g, 2g, slow-2g
    downlink DECIMAL(10, 2),
    rtt INTEGER,
    save_data BOOLEAN,
    
    -- 브라우저 능력
    webgl_support BOOLEAN DEFAULT false,
    webgl_vendor VARCHAR(200),
    webgl_renderer VARCHAR(200),
    local_storage BOOLEAN DEFAULT false,
    session_storage BOOLEAN DEFAULT false,
    indexed_db BOOLEAN DEFAULT false,
    service_workers BOOLEAN DEFAULT false,
    geolocation BOOLEAN DEFAULT false,
    
    -- 기타 정보
    language VARCHAR(10),
    languages JSONB,
    timezone_offset INTEGER,
    referrer TEXT,
    landing_page TEXT,
    campaign_source VARCHAR(100),
    campaign_medium VARCHAR(100),
    campaign_name VARCHAR(100),
    campaign_term VARCHAR(100),
    campaign_content VARCHAR(100),
    
    -- 행동 데이터
    page_views INTEGER DEFAULT 0,
    total_clicks INTEGER DEFAULT 0,
    total_scroll_events INTEGER DEFAULT 0,
    max_scroll_depth DECIMAL(5, 2) DEFAULT 0,
    bounce_rate DECIMAL(5, 2) DEFAULT 0,
    engagement_score INTEGER DEFAULT 0,
    
    -- 기술적 정보
    visit_count INTEGER DEFAULT 1,
    last_visit TIMESTAMP WITH TIME ZONE,
    ad_blocker_detected BOOLEAN DEFAULT false,
    canvas_fingerprint VARCHAR(200),
    audio_fingerprint VARCHAR(200),
    installed_fonts JSONB,
    
    -- 인덱스
    CONSTRAINT valid_device_type CHECK (device_type IN ('mobile', 'tablet', 'desktop', 'tv')),
    CONSTRAINT valid_pixel_ratio CHECK (pixel_ratio > 0 AND pixel_ratio <= 10)
);

-- Landing 프로젝트 페이지 방문 테이블
CREATE TABLE squeeze_page_visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(255) NOT NULL REFERENCES squeeze_anonymous_sessions(session_id) ON DELETE CASCADE,
    
    -- 페이지 정보
    route VARCHAR(500) NOT NULL,
    page_title VARCHAR(500),
    full_url TEXT,
    url_params JSONB,
    
    -- 시간 정보
    enter_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    exit_time TIMESTAMP WITH TIME ZONE,
    duration_ms INTEGER,
    
    -- 사용자 행동
    scroll_depth_percent DECIMAL(5, 2) DEFAULT 0,
    max_scroll_position INTEGER DEFAULT 0,
    click_count INTEGER DEFAULT 0,
    interaction_count INTEGER DEFAULT 0,
    form_submissions INTEGER DEFAULT 0,
    
    -- Landing 특화 행동
    cta_clicks INTEGER DEFAULT 0,
    lead_magnet_downloads INTEGER DEFAULT 0,
    video_play_count INTEGER DEFAULT 0,
    video_completion_rate DECIMAL(5, 2) DEFAULT 0,
    
    -- 이탈 정보
    bounce BOOLEAN DEFAULT false,
    exit_intent_triggered BOOLEAN DEFAULT false,
    exit_type VARCHAR(50),
    exit_reason VARCHAR(200),
    
    -- 성능 정보
    load_time_ms INTEGER,
    dom_ready_time_ms INTEGER,
    first_paint_ms INTEGER,
    first_contentful_paint_ms INTEGER
);

-- Landing 프로젝트 사용자 이벤트 테이블
CREATE TABLE squeeze_user_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(255) NOT NULL REFERENCES squeeze_anonymous_sessions(session_id) ON DELETE CASCADE,
    page_visit_id UUID REFERENCES squeeze_page_visits(id) ON DELETE CASCADE,
    
    -- 이벤트 정보
    event_type VARCHAR(50) NOT NULL, -- click, scroll, form_input, cta_click, download
    element_id VARCHAR(200),
    element_type VARCHAR(100),
    element_text TEXT,
    element_value TEXT,
    
    -- Landing 특화 이벤트 데이터
    cta_type VARCHAR(100), -- primary, secondary, exit_intent
    lead_magnet_type VARCHAR(100), -- checklist, guide, template
    conversion_step VARCHAR(100), -- awareness, interest, consideration, intent
    
    -- 위치 정보
    click_x INTEGER,
    click_y INTEGER,
    scroll_position INTEGER,
    viewport_width INTEGER,
    viewport_height INTEGER,
    
    -- 시간 정보
    timestamp_ms BIGINT NOT NULL,
    time_on_page_ms INTEGER,
    
    metadata JSONB
);

-- Landing 프로젝트 리드 전환 테이블
CREATE TABLE squeeze_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(255) NOT NULL REFERENCES squeeze_anonymous_sessions(session_id) ON DELETE CASCADE,
    
    -- 연락처 정보
    email VARCHAR(255),
    phone VARCHAR(50),
    name VARCHAR(200),
    company VARCHAR(200),
    job_title VARCHAR(100),
    
    -- 동의 정보
    email_consent BOOLEAN DEFAULT false,
    sms_consent BOOLEAN DEFAULT false,
    marketing_consent BOOLEAN DEFAULT false,
    privacy_consent BOOLEAN DEFAULT false,
    newsletter_consent BOOLEAN DEFAULT false,
    
    -- 리드 분석
    lead_source VARCHAR(100) NOT NULL, -- organic, paid, social, referral, direct
    lead_medium VARCHAR(100),
    lead_campaign VARCHAR(100),
    conversion_page VARCHAR(500),
    lead_magnet_name VARCHAR(200),
    
    -- 스코어링
    lead_score INTEGER DEFAULT 0, -- 0-100
    lead_quality VARCHAR(20) DEFAULT 'cold', -- hot, warm, cold
    conversion_likelihood DECIMAL(5, 2) DEFAULT 0,
    engagement_level VARCHAR(20) DEFAULT 'low', -- high, medium, low
    
    -- 시간 정보
    converted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    follow_up_needed_at TIMESTAMP WITH TIME ZONE,
    last_contact_attempt TIMESTAMP WITH TIME ZONE,
    
    -- 외부 연동
    webhook_sent BOOLEAN DEFAULT false,
    webhook_sent_at TIMESTAMP WITH TIME ZONE,
    webhook_response JSONB,
    crm_synced BOOLEAN DEFAULT false,
    crm_contact_id VARCHAR(100),
    
    CONSTRAINT valid_lead_quality CHECK (lead_quality IN ('hot', 'warm', 'cold')),
    CONSTRAINT valid_engagement_level CHECK (engagement_level IN ('high', 'medium', 'low'))
);

-- Landing 프로젝트 전환 추적 테이블
CREATE TABLE squeeze_conversions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(255) NOT NULL REFERENCES squeeze_anonymous_sessions(session_id) ON DELETE CASCADE,
    lead_id UUID REFERENCES squeeze_leads(id) ON DELETE CASCADE,
    
    -- 전환 정보
    conversion_type VARCHAR(100) NOT NULL, -- lead_magnet, newsletter, demo_request, consultation
    conversion_value DECIMAL(10, 2) DEFAULT 0,
    conversion_step INTEGER DEFAULT 1,
    total_conversion_steps INTEGER DEFAULT 1,
    
    -- 전환 경로 분석
    conversion_path JSONB, -- 전환까지의 페이지 경로
    touchpoints_before_conversion INTEGER DEFAULT 0,
    days_to_conversion INTEGER DEFAULT 0,
    sessions_to_conversion INTEGER DEFAULT 1,
    
    -- 전환 맥락
    conversion_trigger VARCHAR(200), -- cta_click, exit_intent, scroll_trigger
    page_position VARCHAR(100), -- header, hero, middle, footer
    time_on_page_seconds INTEGER,
    scroll_depth_at_conversion DECIMAL(5, 2),
    
    converted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Landing 프로젝트 인덱스
CREATE INDEX idx_squeeze_sessions_created_at ON squeeze_anonymous_sessions(created_at);
CREATE INDEX idx_squeeze_sessions_device_country ON squeeze_anonymous_sessions(device_type, country);
CREATE INDEX idx_squeeze_sessions_campaign ON squeeze_anonymous_sessions(campaign_source, campaign_medium);
CREATE INDEX idx_squeeze_page_visits_session_route ON squeeze_page_visits(session_id, route);
CREATE INDEX idx_squeeze_leads_created_at ON squeeze_leads(converted_at);
CREATE INDEX idx_squeeze_leads_score_quality ON squeeze_leads(lead_score, lead_quality);

-- 통합 분석 인덱스
CREATE INDEX idx_funnel_analysis ON squeeze_anonymous_sessions(session_id, created_at);

-- 보안을 위한 RLS 정책 (선택사항)
ALTER TABLE squeeze_anonymous_sessions ENABLE ROW LEVEL SECURITY;

-- 기본 정책: 모든 데이터 읽기 허용
CREATE POLICY "Allow read access" ON squeeze_anonymous_sessions FOR SELECT USING (true);

-- 테이블 통계 업데이트
ANALYZE squeeze_anonymous_sessions;

--
-- 🗄️ Funnel Analytics: Landing 프로젝트 테이블 주석
--

-- 테이블: squeeze_anonymous_sessions
COMMENT ON TABLE squeeze_anonymous_sessions IS 'Landing 프로젝트에 방문한 익명 사용자의 세션 정보를 저장하는 테이블';
COMMENT ON COLUMN squeeze_anonymous_sessions.id IS '세션의 고유 식별자 (Primary Key, UUID)';
COMMENT ON COLUMN squeeze_anonymous_sessions.session_id IS '클라이언트에서 생성/관리되는 세션의 고유 문자열 ID';
COMMENT ON COLUMN squeeze_anonymous_sessions.created_at IS '세션 생성 시점';
COMMENT ON COLUMN squeeze_anonymous_sessions.updated_at IS '세션 정보 마지막 업데이트 시점';
COMMENT ON COLUMN squeeze_anonymous_sessions.last_activity IS '사용자의 마지막 활동 시간';
COMMENT ON COLUMN squeeze_anonymous_sessions.session_duration_ms IS '세션 총 지속 시간 (밀리초)';
COMMENT ON COLUMN squeeze_anonymous_sessions.is_active IS '세션이 현재 활성 상태인지 여부';
COMMENT ON COLUMN squeeze_anonymous_sessions.user_agent IS '사용자의 User Agent 문자열';
COMMENT ON COLUMN squeeze_anonymous_sessions.ip_address IS '사용자의 IP 주소';
COMMENT ON COLUMN squeeze_anonymous_sessions.device_type IS '디바이스 유형 (mobile, tablet, desktop, tv)';
COMMENT ON COLUMN squeeze_anonymous_sessions.device_brand IS '디바이스 제조사 (예: Samsung, Apple)';
COMMENT ON COLUMN squeeze_anonymous_sessions.device_model IS '디바이스 모델명 (예: iPhone 14 Pro)';
COMMENT ON COLUMN squeeze_anonymous_sessions.os IS '운영체제 이름 (예: Windows, macOS, iOS)';
COMMENT ON COLUMN squeeze_anonymous_sessions.os_version IS '운영체제 버전';
COMMENT ON COLUMN squeeze_anonymous_sessions.browser IS '브라우저 이름 (예: Chrome, Safari)';
COMMENT ON COLUMN squeeze_anonymous_sessions.browser_version IS '브라우저 버전';
COMMENT ON COLUMN squeeze_anonymous_sessions.screen_width IS '디바이스 화면 너비 (픽셀)';
COMMENT ON COLUMN squeeze_anonymous_sessions.screen_height IS '디바이스 화면 높이 (픽셀)';
COMMENT ON COLUMN squeeze_anonymous_sessions.pixel_ratio IS '디바이스의 픽셀 밀도';
COMMENT ON COLUMN squeeze_anonymous_sessions.country IS '국가 이름';
COMMENT ON COLUMN squeeze_anonymous_sessions.country_code IS '국가 코드 (2자리)';
COMMENT ON COLUMN squeeze_anonymous_sessions.region IS '지역/주 이름';
COMMENT ON COLUMN squeeze_anonymous_sessions.region_code IS '지역/주 코드';
COMMENT ON COLUMN squeeze_anonymous_sessions.city IS '도시 이름';
COMMENT ON COLUMN squeeze_anonymous_sessions.zip_code IS '우편번호';
COMMENT ON COLUMN squeeze_anonymous_sessions.latitude IS '위도';
COMMENT ON COLUMN squeeze_anonymous_sessions.longitude IS '경도';
COMMENT ON COLUMN squeeze_anonymous_sessions.timezone IS '시간대 (예: Asia/Seoul)';
COMMENT ON COLUMN squeeze_anonymous_sessions.isp IS '인터넷 서비스 제공자 (예: KT, SKT)';
COMMENT ON COLUMN squeeze_anonymous_sessions.organization IS 'IP 할당 기관';
COMMENT ON COLUMN squeeze_anonymous_sessions.asn IS '자율 시스템 번호';
COMMENT ON COLUMN squeeze_anonymous_sessions.connection_type IS '네트워크 연결 유형 (예: wifi, cellular)';
COMMENT ON COLUMN squeeze_anonymous_sessions.effective_type IS '네트워크 유효 속도 (4g, 3g 등)';
COMMENT ON COLUMN squeeze_anonymous_sessions.downlink IS '네트워크 다운링크 속도 (Mbps)';
COMMENT ON COLUMN squeeze_anonymous_sessions.rtt IS '왕복 지연 시간 (Round Trip Time, ms)';
COMMENT ON COLUMN squeeze_anonymous_sessions.save_data IS '브라우저의 데이터 절약 모드 활성화 여부';
COMMENT ON COLUMN squeeze_anonymous_sessions.webgl_support IS 'WebGL 지원 여부';
COMMENT ON COLUMN squeeze_anonymous_sessions.webgl_vendor IS 'WebGL 벤더 정보';
COMMENT ON COLUMN squeeze_anonymous_sessions.webgl_renderer IS 'WebGL 렌더러 정보';
COMMENT ON COLUMN squeeze_anonymous_sessions.local_storage IS '로컬 스토리지 지원 여부';
COMMENT ON COLUMN squeeze_anonymous_sessions.session_storage IS '세션 스토리지 지원 여부';
COMMENT ON COLUMN squeeze_anonymous_sessions.indexed_db IS 'IndexedDB 지원 여부';
COMMENT ON COLUMN squeeze_anonymous_sessions.service_workers IS '서비스 워커 지원 여부';
COMMENT ON COLUMN squeeze_anonymous_sessions.geolocation IS 'Geolocation API 사용 가능 여부';
COMMENT ON COLUMN squeeze_anonymous_sessions.language IS '브라우저 기본 언어';
COMMENT ON COLUMN squeeze_anonymous_sessions.languages IS '브라우저에서 지원하는 언어 목록 (JSONB)';
COMMENT ON COLUMN squeeze_anonymous_sessions.timezone_offset IS 'UTC 기준 시간대 오프셋 (분)';
COMMENT ON COLUMN squeeze_anonymous_sessions.referrer IS '이전 방문 페이지 주소 (유입 경로)';
COMMENT ON COLUMN squeeze_anonymous_sessions.landing_page IS '사용자가 처음 도착한 페이지 주소';
COMMENT ON COLUMN squeeze_anonymous_sessions.campaign_source IS 'UTM 캠페인 소스';
COMMENT ON COLUMN squeeze_anonymous_sessions.campaign_medium IS 'UTM 캠페인 매체';
COMMENT ON COLUMN squeeze_anonymous_sessions.campaign_name IS 'UTM 캠페인 이름';
COMMENT ON COLUMN squeeze_anonymous_sessions.campaign_term IS 'UTM 캠페인 검색어';
COMMENT ON COLUMN squeeze_anonymous_sessions.campaign_content IS 'UTM 캠페인 콘텐츠';
COMMENT ON COLUMN squeeze_anonymous_sessions.page_views IS '세션 동안의 총 페이지 조회 수';
COMMENT ON COLUMN squeeze_anonymous_sessions.total_clicks IS '세션 동안의 총 클릭 수';
COMMENT ON COLUMN squeeze_anonymous_sessions.total_scroll_events IS '세션 동안의 총 스크롤 이벤트 수';
COMMENT ON COLUMN squeeze_anonymous_sessions.max_scroll_depth IS '세션 동안 도달한 최대 스크롤 깊이 (%)';
COMMENT ON COLUMN squeeze_anonymous_sessions.bounce_rate IS '이탈률 (현재 세션 기준)';
COMMENT ON COLUMN squeeze_anonymous_sessions.engagement_score IS '사용자 참여도 점수';
COMMENT ON COLUMN squeeze_anonymous_sessions.visit_count IS '해당 사용자의 누적 방문 횟수';
COMMENT ON COLUMN squeeze_anonymous_sessions.last_visit IS '해당 사용자의 마지막 방문 시점';
COMMENT ON COLUMN squeeze_anonymous_sessions.ad_blocker_detected IS '광고 차단기 사용 감지 여부';
COMMENT ON COLUMN squeeze_anonymous_sessions.canvas_fingerprint IS 'Canvas 핑거프린팅 값';
COMMENT ON COLUMN squeeze_anonymous_sessions.audio_fingerprint IS 'Audio 핑거프린팅 값';
COMMENT ON COLUMN squeeze_anonymous_sessions.installed_fonts IS '설치된 폰트 목록 (JSONB)';

-- 테이블: squeeze_page_visits
COMMENT ON TABLE squeeze_page_visits IS 'Landing 프로젝트에서 사용자가 방문한 각 페이지의 정보를 기록하는 테이블';
COMMENT ON COLUMN squeeze_page_visits.id IS '페이지 방문의 고유 식별자 (UUID)';
COMMENT ON COLUMN squeeze_page_visits.session_id IS '연결된 익명 세션의 ID';
COMMENT ON COLUMN squeeze_page_visits.route IS '방문한 페이지의 내부 경로 (예: /features)';
COMMENT ON COLUMN squeeze_page_visits.page_title IS '페이지의 제목';
COMMENT ON COLUMN squeeze_page_visits.full_url IS '방문한 전체 URL';
COMMENT ON COLUMN squeeze_page_visits.url_params IS 'URL 쿼리 파라미터 (JSONB)';
COMMENT ON COLUMN squeeze_page_visits.enter_time IS '페이지 진입 시간';
COMMENT ON COLUMN squeeze_page_visits.exit_time IS '페이지 이탈 시간';
COMMENT ON COLUMN squeeze_page_visits.duration_ms IS '페이지에 머문 시간 (밀리초)';
COMMENT ON COLUMN squeeze_page_visits.scroll_depth_percent IS '해당 페이지에서 도달한 최대 스크롤 깊이 (%)';
COMMENT ON COLUMN squeeze_page_visits.max_scroll_position IS '해당 페이지에서 도달한 최대 스크롤 위치 (px)';
COMMENT ON COLUMN squeeze_page_visits.click_count IS '페이지 내 클릭 수';
COMMENT ON COLUMN squeeze_page_visits.interaction_count IS '페이지 내 상호작용 수 (클릭, 입력 등)';
COMMENT ON COLUMN squeeze_page_visits.form_submissions IS '페이지 내에서 폼을 제출한 횟수';
COMMENT ON COLUMN squeeze_page_visits.cta_clicks IS 'Call-To-Action 버튼 클릭 수';
COMMENT ON COLUMN squeeze_page_visits.lead_magnet_downloads IS '리드 마그넷(자료) 다운로드 수';
COMMENT ON COLUMN squeeze_page_visits.video_play_count IS '비디오 재생 수';
COMMENT ON COLUMN squeeze_page_visits.video_completion_rate IS '비디오 시청 완료율';
COMMENT ON COLUMN squeeze_page_visits.bounce IS '해당 페이지에서 이탈했는지 여부';
COMMENT ON COLUMN squeeze_page_visits.exit_intent_triggered IS '이탈 의도 팝업 등이 트리거되었는지 여부';
COMMENT ON COLUMN squeeze_page_visits.exit_type IS '이탈 유형 (예: navigate, close)';
COMMENT ON COLUMN squeeze_page_visits.exit_reason IS '이탈 사유';
COMMENT ON COLUMN squeeze_page_visits.load_time_ms IS '페이지 로드 시간 (밀리초)';
COMMENT ON COLUMN squeeze_page_visits.dom_ready_time_ms IS 'DOM이 준비되기까지 걸린 시간 (밀리초)';
COMMENT ON COLUMN squeeze_page_visits.first_paint_ms IS '첫 페인트 시간 (FP)';
COMMENT ON COLUMN squeeze_page_visits.first_contentful_paint_ms IS '첫 콘텐츠 페인트 시간 (FCP)';

-- 테이블: squeeze_user_events
COMMENT ON TABLE squeeze_user_events IS 'Landing 프로젝트에서 발생하는 개별 사용자 이벤트를 기록하는 테이블';
COMMENT ON COLUMN squeeze_user_events.id IS '사용자 이벤트의 고유 식별자 (UUID)';
COMMENT ON COLUMN squeeze_user_events.session_id IS '연결된 익명 세션의 ID';
COMMENT ON COLUMN squeeze_user_events.page_visit_id IS '이벤트가 발생한 페이지 방문 ID';
COMMENT ON COLUMN squeeze_user_events.event_type IS '이벤트 유형 (click, scroll, form_input 등)';
COMMENT ON COLUMN squeeze_user_events.element_id IS '이벤트가 발생한 HTML 요소의 ID';
COMMENT ON COLUMN squeeze_user_events.element_type IS '이벤트가 발생한 HTML 요소의 유형 (예: button, a)';
COMMENT ON COLUMN squeeze_user_events.element_text IS '이벤트가 발생한 요소의 텍스트 내용';
COMMENT ON COLUMN squeeze_user_events.element_value IS '이벤트가 발생한 요소의 값 (input 등)';
COMMENT ON COLUMN squeeze_user_events.cta_type IS 'CTA 유형 (primary, secondary 등)';
COMMENT ON COLUMN squeeze_user_events.lead_magnet_type IS '리드 마그넷 유형 (checklist, guide 등)';
COMMENT ON COLUMN squeeze_user_events.conversion_step IS '전환 단계 (awareness, interest 등)';
COMMENT ON COLUMN squeeze_user_events.click_x IS '클릭 이벤트의 x 좌표';
COMMENT ON COLUMN squeeze_user_events.click_y IS '클릭 이벤트의 y 좌표';
COMMENT ON COLUMN squeeze_user_events.scroll_position IS '스크롤 이벤트 발생 시의 위치';
COMMENT ON COLUMN squeeze_user_events.viewport_width IS '이벤트 발생 시점의 뷰포트 너비';
COMMENT ON COLUMN squeeze_user_events.viewport_height IS '이벤트 발생 시점의 뷰포트 높이';
COMMENT ON COLUMN squeeze_user_events.timestamp_ms IS '이벤트 발생 시점의 타임스탬프 (밀리초)';
COMMENT ON COLUMN squeeze_user_events.time_on_page_ms IS '이벤트 발생까지 페이지에 머문 시간 (밀리초)';
COMMENT ON COLUMN squeeze_user_events.metadata IS '기타 추가 정보 (JSONB)';

-- 테이블: squeeze_leads
COMMENT ON TABLE squeeze_leads IS 'Landing 프로젝트를 통해 수집된 리드(잠재고객) 정보를 저장하는 테이블';
COMMENT ON COLUMN squeeze_leads.id IS '리드의 고유 식별자 (UUID)';
COMMENT ON COLUMN squeeze_leads.session_id IS '연결된 익명 세션의 ID';
COMMENT ON COLUMN squeeze_leads.email IS '리드의 이메일 주소';
COMMENT ON COLUMN squeeze_leads.phone IS '리드의 전화번호';
COMMENT ON COLUMN squeeze_leads.name IS '리드의 이름';
COMMENT ON COLUMN squeeze_leads.company IS '리드의 소속 회사';
COMMENT ON COLUMN squeeze_leads.job_title IS '리드의 직책';
COMMENT ON COLUMN squeeze_leads.email_consent IS '이메일 수신 동의 여부';
COMMENT ON COLUMN squeeze_leads.sms_consent IS 'SMS 수신 동의 여부';
COMMENT ON COLUMN squeeze_leads.marketing_consent IS '마케팅 정보 수신 동의 여부';
COMMENT ON COLUMN squeeze_leads.privacy_consent IS '개인정보처리방침 동의 여부';
COMMENT ON COLUMN squeeze_leads.newsletter_consent IS '뉴스레터 구독 동의 여부';
COMMENT ON COLUMN squeeze_leads.lead_source IS '리드 출처 (organic, paid, social 등)';
COMMENT ON COLUMN squeeze_leads.lead_medium IS '리드 매체';
COMMENT ON COLUMN squeeze_leads.lead_campaign IS '리드 캠페인';
COMMENT ON COLUMN squeeze_leads.conversion_page IS '전환이 발생한 페이지';
COMMENT ON COLUMN squeeze_leads.lead_magnet_name IS '다운로드한 리드 마그넷 이름';
COMMENT ON COLUMN squeeze_leads.lead_score IS '리드 점수 (0-100)';
COMMENT ON COLUMN squeeze_leads.lead_quality IS '리드 품질 (hot, warm, cold)';
COMMENT ON COLUMN squeeze_leads.conversion_likelihood IS '전환 가능성 (%)';
COMMENT ON COLUMN squeeze_leads.engagement_level IS '참여도 수준 (high, medium, low)';
COMMENT ON COLUMN squeeze_leads.converted_at IS '리드로 전환된 시점';
COMMENT ON COLUMN squeeze_leads.follow_up_needed_at IS '후속 조치가 필요한 예상 시점';
COMMENT ON COLUMN squeeze_leads.last_contact_attempt IS '마지막으로 연락을 시도한 시점';
COMMENT ON COLUMN squeeze_leads.webhook_sent IS '웹훅 발송 여부';
COMMENT ON COLUMN squeeze_leads.webhook_sent_at IS '웹훅 발송 시점';
COMMENT ON COLUMN squeeze_leads.webhook_response IS '웹훅 응답 결과 (JSONB)';
COMMENT ON COLUMN squeeze_leads.crm_synced IS 'CRM과 동기화되었는지 여부';
COMMENT ON COLUMN squeeze_leads.crm_contact_id IS 'CRM의 연락처 ID';

-- 테이블: squeeze_conversions
COMMENT ON TABLE squeeze_conversions IS 'Landing 프로젝트에서의 전환 이벤트를 추적하는 테이블';
COMMENT ON COLUMN squeeze_conversions.id IS '전환의 고유 식별자 (UUID)';
COMMENT ON COLUMN squeeze_conversions.session_id IS '연결된 익명 세션의 ID';
COMMENT ON COLUMN squeeze_conversions.lead_id IS '전환과 연결된 리드의 ID';
COMMENT ON COLUMN squeeze_conversions.conversion_type IS '전환 유형 (lead_magnet, newsletter 등)';
COMMENT ON COLUMN squeeze_conversions.conversion_value IS '전환 가치 (금액 등)';
COMMENT ON COLUMN squeeze_conversions.conversion_step IS '전환 단계 번호';
COMMENT ON COLUMN squeeze_conversions.total_conversion_steps IS '총 전환 단계 수';
COMMENT ON COLUMN squeeze_conversions.conversion_path IS '전환까지의 페이지 방문 경로 (JSONB)';
COMMENT ON COLUMN squeeze_conversions.touchpoints_before_conversion IS '전환 전까지의 터치포인트 수';
COMMENT ON COLUMN squeeze_conversions.days_to_conversion IS '첫 방문부터 전환까지 걸린 일 수';
COMMENT ON COLUMN squeeze_conversions.sessions_to_conversion IS '전환까지 발생한 세션 수';
COMMENT ON COLUMN squeeze_conversions.conversion_trigger IS '전환을 유발한 트리거 (cta_click 등)';
COMMENT ON COLUMN squeeze_conversions.page_position IS '전환이 발생한 페이지 내 위치 (header, footer 등)';
COMMENT ON COLUMN squeeze_conversions.time_on_page_seconds IS '전환 시점까지 페이지에 머문 시간 (초)';
COMMENT ON COLUMN squeeze_conversions.scroll_depth_at_conversion IS '전환 시점의 스크롤 깊이 (%)';
COMMENT ON COLUMN squeeze_conversions.converted_at IS '전환 발생 시점';