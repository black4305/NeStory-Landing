-- nestory 스키마 테이블에 접근하기 위한 프록시 함수들
-- Supabase JS 클라이언트는 public 스키마만 지원하므로, 
-- public 스키마에 함수를 만들어 nestory 스키마 테이블에 접근

-- 1. 설문 응답 저장 함수
CREATE OR REPLACE FUNCTION public.save_nestory_response(
  p_session_id TEXT,
  p_start_time TIMESTAMPTZ,
  p_answers JSONB,
  p_total_time INTEGER,
  p_click_count INTEGER,
  p_scroll_depth INTEGER,
  p_device_type TEXT,
  p_user_agent TEXT,
  p_completed BOOLEAN,
  p_result TEXT DEFAULT NULL,
  p_user_info JSONB DEFAULT NULL,
  p_reliability_score NUMERIC DEFAULT NULL,
  p_response_pattern TEXT DEFAULT NULL
) RETURNS BOOLEAN AS $$
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
    NOW(),
    p_reliability_score,
    p_response_pattern
  );
  
  RETURN TRUE;
EXCEPTION 
  WHEN OTHERS THEN
    RAISE NOTICE 'Error saving response: %', SQLERRM;
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. 모든 설문 응답 조회 함수
CREATE OR REPLACE FUNCTION public.get_nestory_responses()
RETURNS TABLE (
  id UUID,
  session_id TEXT,
  start_time TIMESTAMPTZ,
  answers JSONB,
  total_time INTEGER,
  click_count INTEGER,
  scroll_depth INTEGER,
  device_type TEXT,
  user_agent TEXT,
  completed BOOLEAN,
  result TEXT,
  user_info JSONB,
  submitted_at TIMESTAMPTZ,
  reliability_score NUMERIC,
  question_progress INTEGER,
  response_pattern TEXT
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
    ur.response_pattern
  FROM nestory.user_responses ur
  ORDER BY ur.submitted_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. 특정 세션 ID로 응답 조회 함수
CREATE OR REPLACE FUNCTION public.get_nestory_response_by_session(p_session_id TEXT)
RETURNS TABLE (
  id UUID,
  session_id TEXT,
  start_time TIMESTAMPTZ,
  answers JSONB,
  total_time INTEGER,
  click_count INTEGER,
  scroll_depth INTEGER,
  device_type TEXT,
  user_agent TEXT,
  completed BOOLEAN,
  result TEXT,
  user_info JSONB,
  submitted_at TIMESTAMPTZ,
  reliability_score NUMERIC,
  question_progress INTEGER,
  response_pattern TEXT
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
    ur.response_pattern
  FROM nestory.user_responses ur
  WHERE ur.session_id = p_session_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. 응답 삭제 함수
CREATE OR REPLACE FUNCTION public.delete_nestory_response(p_session_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  DELETE FROM nestory.user_responses
  WHERE session_id = p_session_id;
  
  RETURN FOUND;
EXCEPTION 
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. 통계 조회 함수
CREATE OR REPLACE FUNCTION public.get_nestory_stats()
RETURNS TABLE (
  total_responses BIGINT,
  completed_responses BIGINT,
  today_responses BIGINT,
  this_week_responses BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT as total_responses,
    COUNT(*) FILTER (WHERE completed = true)::BIGINT as completed_responses,
    COUNT(*) FILTER (WHERE submitted_at >= CURRENT_DATE)::BIGINT as today_responses,
    COUNT(*) FILTER (WHERE submitted_at >= CURRENT_DATE - INTERVAL '7 days')::BIGINT as this_week_responses
  FROM nestory.user_responses;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 권한 부여
GRANT EXECUTE ON FUNCTION public.save_nestory_response TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_nestory_responses TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_nestory_response_by_session TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.delete_nestory_response TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_nestory_stats TO anon, authenticated;

-- 함수 설명 추가
COMMENT ON FUNCTION public.save_nestory_response IS 'nestory.user_responses 테이블에 설문 응답 저장';
COMMENT ON FUNCTION public.get_nestory_responses IS 'nestory.user_responses 테이블에서 모든 응답 조회';
COMMENT ON FUNCTION public.get_nestory_response_by_session IS 'nestory.user_responses 테이블에서 특정 세션 응답 조회';
COMMENT ON FUNCTION public.delete_nestory_response IS 'nestory.user_responses 테이블에서 응답 삭제';
COMMENT ON FUNCTION public.get_nestory_stats IS 'nestory.user_responses 테이블 통계 조회';