-- NeStory-Landing 프로젝트용 Supabase 데이터베이스 설정
-- 2025-06-27 생성

-- 1. NeStory 스키마 생성
CREATE SCHEMA IF NOT EXISTS nestory;

-- 2. 사용자 응답 데이터 테이블
CREATE TABLE IF NOT EXISTS nestory.user_responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT UNIQUE NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE,
    answers JSONB,
    total_time INTEGER,
    click_count INTEGER,
    scroll_depth REAL,
    device_type TEXT,
    user_agent TEXT,
    completed BOOLEAN DEFAULT false,
    result TEXT,
    user_info JSONB,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reliability_score REAL,
    question_progress JSONB,
    response_pattern TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 랜딩 페이지 분석 데이터 테이블
CREATE TABLE IF NOT EXISTS nestory.landing_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL,
    page_url TEXT,
    user_agent TEXT,
    device_type TEXT,
    scroll_depth REAL,
    time_spent INTEGER,
    cta_clicks INTEGER,
    button_clicks JSONB,
    form_interactions JSONB,
    exit_intent BOOLEAN DEFAULT false,
    conversion_funnel TEXT,
    referrer TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 활성 사용자 추적 테이블
CREATE TABLE IF NOT EXISTS nestory.active_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT UNIQUE NOT NULL,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    current_page TEXT,
    status TEXT DEFAULT 'active', -- 'active', 'idle', 'offline'
    user_agent TEXT,
    device_type TEXT
);

-- 5. A/B 테스트 결과 테이블
CREATE TABLE IF NOT EXISTS nestory.ab_test_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL,
    test_name TEXT NOT NULL,
    variant TEXT NOT NULL, -- 'A', 'B', 'C' etc.
    converted BOOLEAN DEFAULT false,
    conversion_value REAL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_user_responses_submitted_at ON nestory.user_responses(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_responses_result ON nestory.user_responses(result);
CREATE INDEX IF NOT EXISTS idx_user_responses_completed ON nestory.user_responses(completed);
CREATE INDEX IF NOT EXISTS idx_landing_analytics_created_at ON nestory.landing_analytics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_active_users_last_activity ON nestory.active_users(last_activity DESC);
CREATE INDEX IF NOT EXISTS idx_ab_test_results_test_name ON nestory.ab_test_results(test_name, variant);

-- 7. 통계용 뷰 생성
CREATE OR REPLACE VIEW nestory.stats_overview AS
SELECT 
    COUNT(*) as total_responses,
    COUNT(*) FILTER (WHERE completed = true) as completed_responses,
    COUNT(*) FILTER (WHERE completed = false) as abandoned_responses,
    ROUND(AVG(total_time), 0) as avg_completion_time,
    COUNT(DISTINCT DATE(submitted_at)) as days_with_responses,
    COUNT(DISTINCT device_type) as device_types_count
FROM nestory.user_responses;

-- 8. 실시간 활성 사용자 뷰
CREATE OR REPLACE VIEW nestory.active_users_live AS
SELECT 
    COUNT(*) as current_active_users,
    COUNT(*) FILTER (WHERE last_activity > NOW() - INTERVAL '5 minutes') as users_last_5min,
    COUNT(*) FILTER (WHERE last_activity > NOW() - INTERVAL '1 hour') as users_last_hour
FROM nestory.active_users 
WHERE last_activity > NOW() - INTERVAL '30 minutes';

-- 9. 결과 순위 뷰 (인기 여행 유형)
CREATE OR REPLACE VIEW nestory.result_leaderboard AS
SELECT 
    result,
    COUNT(*) as count,
    ROUND((COUNT(*) * 100.0 / SUM(COUNT(*)) OVER()), 1) as percentage
FROM nestory.user_responses 
WHERE completed = true AND result IS NOT NULL
GROUP BY result
ORDER BY count DESC;

-- 10. RLS (Row Level Security) 정책 설정

-- 사용자 응답 테이블 정책
ALTER TABLE nestory.user_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own responses" ON nestory.user_responses
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can read their own responses" ON nestory.user_responses
    FOR SELECT USING (true);

CREATE POLICY "Users can update their own responses" ON nestory.user_responses
    FOR UPDATE USING (true);

-- 랜딩 분석 테이블 정책
ALTER TABLE nestory.landing_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert analytics" ON nestory.landing_analytics
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Only admins can read analytics" ON nestory.landing_analytics
    FOR SELECT USING (true);

-- 활성 사용자 테이블 정책
ALTER TABLE nestory.active_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can manage active users" ON nestory.active_users
    FOR ALL WITH CHECK (true);

-- A/B 테스트 결과 테이블 정책
ALTER TABLE nestory.ab_test_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert ab test results" ON nestory.ab_test_results
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Only admins can read ab test results" ON nestory.ab_test_results
    FOR SELECT USING (true);

-- 11. 자동 정리 함수 (Pro 플랜 최적화)
CREATE OR REPLACE FUNCTION nestory.cleanup_old_active_users()
RETURNS void AS $$
BEGIN
    DELETE FROM nestory.active_users 
    WHERE last_activity < NOW() - INTERVAL '30 minutes';
END;
$$ LANGUAGE plpgsql;

-- 12. 스토리지 버킷 정책 (수동으로 Storage에서 설정 필요)
-- 버킷명: nestory-landing (소문자 필수)
-- 정책: 
-- INSERT: 인증된 사용자만
-- SELECT: 공개 읽기 (공유 기능용)
-- UPDATE/DELETE: 소유자만

-- 성공 메시지
DO $$
BEGIN
    RAISE NOTICE '✅ NeStory-Landing 데이터베이스 설정 완료!';
    RAISE NOTICE '📊 4개 테이블 + 3개 뷰 생성됨';
    RAISE NOTICE '🔒 RLS 정책 설정 완료';
    RAISE NOTICE '🚀 인덱스 최적화 완료';
    RAISE NOTICE '';
    RAISE NOTICE '다음 단계:';
    RAISE NOTICE '1. Storage → New bucket → "nestory-landing" (private)';
    RAISE NOTICE '2. API → Realtime → nestory 스키마 전체 활성화';
    RAISE NOTICE '3. 환경변수 .env 파일 확인';
END $$;