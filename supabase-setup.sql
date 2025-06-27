-- ===============================================
-- NeStory 여행 설문 시스템 Supabase 데이터베이스 설정
-- ===============================================

-- 1. 사용자 응답 데이터 테이블 생성
CREATE TABLE IF NOT EXISTS user_responses (
  id SERIAL PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  start_time BIGINT,
  answers JSONB,
  total_time INTEGER,
  click_count INTEGER,
  scroll_depth REAL,
  device_type TEXT,
  user_agent TEXT,
  completed BOOLEAN DEFAULT false,
  result TEXT,
  user_info JSONB,
  submitted_at TIMESTAMP DEFAULT NOW(),
  reliability_score REAL,
  question_progress JSONB,
  response_pattern TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_user_responses_session_id ON user_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_user_responses_completed ON user_responses(completed);
CREATE INDEX IF NOT EXISTS idx_user_responses_submitted_at ON user_responses(submitted_at);
CREATE INDEX IF NOT EXISTS idx_user_responses_result ON user_responses(result);

-- 3. 업데이트 시간 자동 갱신 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. 업데이트 트리거 설정
CREATE TRIGGER update_user_responses_updated_at 
    BEFORE UPDATE ON user_responses 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 5. Row Level Security (RLS) 활성화
ALTER TABLE user_responses ENABLE ROW LEVEL SECURITY;

-- 6. 공개 읽기 정책 (익명 사용자도 데이터 삽입 가능)
CREATE POLICY "공개 삽입 허용" ON user_responses
    FOR INSERT 
    WITH CHECK (true);

-- 7. 공개 읽기 정책 (관리자 대시보드용)
CREATE POLICY "공개 읽기 허용" ON user_responses
    FOR SELECT 
    USING (true);

-- 8. 공개 업데이트 정책
CREATE POLICY "공개 업데이트 허용" ON user_responses
    FOR UPDATE 
    USING (true)
    WITH CHECK (true);

-- 9. 공개 삭제 정책 (관리자 기능용)
CREATE POLICY "공개 삭제 허용" ON user_responses
    FOR DELETE 
    USING (true);

-- 10. 샘플 데이터 확인용 뷰 생성
CREATE OR REPLACE VIEW user_responses_summary AS
SELECT 
    session_id,
    completed,
    result,
    total_time,
    device_type,
    reliability_score,
    submitted_at,
    CASE 
        WHEN user_info->>'name' IS NOT NULL THEN user_info->>'name'
        ELSE '익명'
    END as user_name
FROM user_responses
ORDER BY submitted_at DESC;

-- 11. 통계 데이터 뷰 생성
CREATE OR REPLACE VIEW response_statistics AS
SELECT 
    COUNT(*) as total_responses,
    COUNT(*) FILTER (WHERE completed = true) as completed_responses,
    COUNT(*) FILTER (WHERE completed = false) as incomplete_responses,
    ROUND(AVG(total_time)::numeric, 2) as avg_completion_time,
    ROUND(AVG(reliability_score)::numeric, 2) as avg_reliability_score,
    COUNT(DISTINCT result) as unique_travel_types,
    COUNT(*) FILTER (WHERE device_type = 'mobile') as mobile_users,
    COUNT(*) FILTER (WHERE device_type = 'desktop') as desktop_users,
    COUNT(*) FILTER (WHERE submitted_at >= CURRENT_DATE) as today_responses,
    COUNT(*) FILTER (WHERE submitted_at >= CURRENT_DATE - INTERVAL '7 days') as week_responses
FROM user_responses;

-- 12. 결과 확인
SELECT 'Supabase 데이터베이스 설정 완료!' as status;
SELECT * FROM response_statistics;