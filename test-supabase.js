// Supabase 연결 테스트 스크립트
const { createClient } = require('@supabase/supabase-js');

// 환경 변수 로드
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log('🔍 환경 변수 확인:', { 
  url: supabaseUrl ? '✅ 설정됨' : '❌ 없음',
  key: supabaseKey ? '✅ 설정됨' : '❌ 없음'
});

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Supabase 환경 변수가 설정되지 않았습니다.');
  console.log('📝 .env.local 파일에 다음을 추가하세요:');
  console.log('REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co');
  console.log('REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here');
  process.exit(1);
}

// Supabase 클라이언트 생성
const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('🔗 Supabase 연결 테스트 중...');
    
    // 1. 테이블 존재 확인
    const { data: tables, error: tableError } = await supabase
      .from('squeeze_anonymous_sessions')
      .select('id')
      .limit(1);

    if (tableError) {
      console.log('❌ 테이블 접근 오류:', tableError.message);
      return;
    }

    console.log('✅ squeeze_anonymous_sessions 테이블 접근 성공');

    // 2. 샘플 세션 데이터 삽입 테스트
    const testSession = {
      session_id: `test_${Date.now()}`,
      user_agent: 'Test Browser',
      ip_address: '127.0.0.1',
      device_type: 'desktop',
      country: 'South Korea',
      city: 'Seoul'
    };

    const { data: insertData, error: insertError } = await supabase
      .from('squeeze_anonymous_sessions')
      .insert(testSession)
      .select();

    if (insertError) {
      console.log('❌ 데이터 삽입 오류:', insertError.message);
      return;
    }

    console.log('✅ 테스트 세션 데이터 삽입 성공:', insertData[0].session_id);

    // 3. 데이터 조회 테스트
    const { data: selectData, error: selectError } = await supabase
      .from('squeeze_anonymous_sessions')
      .select('session_id, device_type, country, city')
      .eq('session_id', testSession.session_id);

    if (selectError) {
      console.log('❌ 데이터 조회 오류:', selectError.message);
      return;
    }

    console.log('✅ 테스트 데이터 조회 성공:', selectData[0]);

    // 4. 테스트 데이터 정리
    const { error: deleteError } = await supabase
      .from('squeeze_anonymous_sessions')
      .delete()
      .eq('session_id', testSession.session_id);

    if (deleteError) {
      console.log('⚠️ 테스트 데이터 삭제 오류:', deleteError.message);
    } else {
      console.log('✅ 테스트 데이터 정리 완료');
    }

    console.log('🎉 Supabase 연결 테스트 완료! 모든 기능이 정상 작동합니다.');

  } catch (error) {
    console.log('❌ 연결 테스트 실패:', error.message);
  }
}

testConnection();