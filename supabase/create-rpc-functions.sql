-- RPC 함수를 통해 nestory 스키마의 테이블에 접근
-- Supabase SQL Editor에서 실행하세요

-- 1. 데이터 저장용 RPC 함수
CREATE OR REPLACE FUNCTION save_user_response(
    p_session_id TEXT,
    p_start_time TIMESTAMP WITH TIME ZONE,
    p_answers JSONB,
    p_total_time INTEGER,
    p_click_count INTEGER,
    p_scroll_depth REAL,
    p_device_type TEXT,
    p_user_agent TEXT,
    p_completed BOOLEAN,
    p_result TEXT,
    p_user_info JSONB,
    p_submitted_at TIMESTAMP WITH TIME ZONE,
    p_reliability_score REAL,
    p_response_pattern TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
    INSERT INTO nestory.user_responses (
        session_id,
        start_time,
        answers,
        total_time,
        click_count,
        scroll_depth,
        device_type,
        user_agent,
        completed,
        result,
        user_info,
        submitted_at,
        reliability_score,
        response_pattern
    ) VALUES (
        p_session_id,
        p_start_time,
        p_answers,
        p_total_time,
        p_click_count,
        p_scroll_depth,
        p_device_type,
        p_user_agent,
        p_completed,
        p_result,
        p_user_info,
        p_submitted_at,
        p_reliability_score,
        p_response_pattern
    );
    
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. 데이터 조회용 RPC 함수
CREATE OR REPLACE FUNCTION get_user_responses()
RETURNS TABLE (
    id UUID,
    session_id TEXT,
    start_time TIMESTAMP WITH TIME ZONE,
    answers JSONB,
    total_time INTEGER,
    click_count INTEGER,
    scroll_depth REAL,
    device_type TEXT,
    user_agent TEXT,
    completed BOOLEAN,
    result TEXT,
    user_info JSONB,
    submitted_at TIMESTAMP WITH TIME ZONE,
    reliability_score REAL,
    question_progress JSONB,
    response_pattern TEXT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ur.id,
        ur.session_id,
        ur.start_time,
        ur.answers,
        ur.total_time,
        ur.click_count,
        ur.scroll_depth,
        ur.device_type,
        ur.user_agent,
        ur.completed,
        ur.result,
        ur.user_info,
        ur.submitted_at,
        ur.reliability_score,
        ur.question_progress,
        ur.response_pattern,
        ur.created_at
    FROM nestory.user_responses ur
    ORDER BY ur.submitted_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. 통계 조회용 RPC 함수
CREATE OR REPLACE FUNCTION get_response_stats()
RETURNS TABLE (
    total_responses BIGINT,
    completed_responses BIGINT,
    abandoned_responses BIGINT,
    avg_completion_time DOUBLE PRECISION,
    days_with_responses BIGINT,
    device_types_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_responses,
        COUNT(*) FILTER (WHERE completed = true) as completed_responses,
        COUNT(*) FILTER (WHERE completed = false) as abandoned_responses,
        ROUND(AVG(total_time), 0) as avg_completion_time,
        COUNT(DISTINCT DATE(submitted_at)) as days_with_responses,
        COUNT(DISTINCT device_type) as device_types_count
    FROM nestory.user_responses;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. 권한 부여
GRANT EXECUTE ON FUNCTION save_user_response TO anon;
GRANT EXECUTE ON FUNCTION get_user_responses TO anon;
GRANT EXECUTE ON FUNCTION get_response_stats TO anon;

-- 성공 메시지
DO $$
BEGIN
    RAISE NOTICE '✅ RPC 함수 생성 완료!';
    RAISE NOTICE '📊 save_user_response: 데이터 저장용';
    RAISE NOTICE '📊 get_user_responses: 데이터 조회용';
    RAISE NOTICE '📊 get_response_stats: 통계 조회용';
END $$;