// Node.js에서 직접 Supabase 연결 테스트
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mkvfmzrtkbkpslxntbsz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rdmZtenJ0a2JrcHNseG50YnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwODgxMTUsImV4cCI6MjA2NDY2NDExNX0.PpdOo5N7_hcR04avCj_JXvVY43fa0DSmHDlCdaLHxf0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔍 Supabase 직접 연결 테스트 시작...');
  
  try {
    // 1. 테이블 존재 확인 (nestory 스키마)
    console.log('📊 nestory.user_responses 테이블 확인 중...');
    const { data, error } = await supabase
      .from('nestory.user_responses')
      .select('session_id')
      .limit(1);
    
    if (error) {
      console.error('❌ 테이블 확인 실패:', error);
      console.log('💡 SQL Editor에서 nestory-landing-setup.sql을 실행해야 할 수 있습니다.');
      return;
    }
    
    console.log('✅ nestory.user_responses 테이블 존재 확인');
    
    // 2. 전체 데이터 조회
    console.log('📖 저장된 데이터 조회 중...');
    const { data: allData, error: queryError } = await supabase
      .from('nestory.user_responses')
      .select('*')
      .order('submitted_at', { ascending: false });
    
    if (queryError) {
      console.error('❌ 데이터 조회 실패:', queryError);
      return;
    }
    
    console.log(`📊 총 ${allData.length}개의 응답이 저장되어 있습니다.`);
    
    if (allData.length > 0) {
      console.log('📋 최근 5개 응답:');
      allData.slice(0, 5).forEach((item, index) => {
        console.log(`${index + 1}. ${item.session_id} - ${item.result} (${new Date(item.submitted_at).toLocaleString()})`);
      });
    } else {
      console.log('📝 저장된 응답이 없습니다.');
    }
    
    // 3. 테스트 데이터 삽입
    console.log('💾 테스트 데이터 삽입 중...');
    const testSessionId = `test_${Date.now()}`;
    const { error: insertError } = await supabase
      .from('nestory.user_responses')
      .insert([{
        session_id: testSessionId,
        start_time: new Date(Date.now() - 60000),
        answers: [
          { questionId: 1, score: 4, timeSpent: 3000 },
          { questionId: 2, score: 2, timeSpent: 2500 }
        ],
        total_time: 60000,
        click_count: 15,
        scroll_depth: 85,
        device_type: 'desktop',
        user_agent: 'test-agent',
        completed: true,
        result: 'ACF',
        user_info: {
          name: 'Node테스트',
          instagram: '@node_test',
          age: '30-39',
          gender: '남성',
          familySize: 4,
          region: '서울 강남구',
          marketingConsent: true,
          privacyConsent: true
        },
        submitted_at: new Date(),
        reliability_score: 0.85,
        response_pattern: 'consistent'
      }]);
    
    if (insertError) {
      console.error('❌ 테스트 데이터 삽입 실패:', insertError);
      return;
    }
    
    console.log('✅ 테스트 데이터 삽입 성공');
    
    // 4. 삽입한 데이터 확인
    const { data: insertedData, error: checkError } = await supabase
      .from('nestory.user_responses')
      .select('*')
      .eq('session_id', testSessionId);
    
    if (checkError) {
      console.error('❌ 삽입된 데이터 확인 실패:', checkError);
      return;
    }
    
    if (insertedData && insertedData.length > 0) {
      console.log('✅ 삽입된 데이터 확인 성공:', insertedData[0]);
      
      // 5. 테스트 데이터 삭제
      const { error: deleteError } = await supabase
        .from('nestory.user_responses')
        .delete()
        .eq('session_id', testSessionId);
      
      if (deleteError) {
        console.error('❌ 테스트 데이터 삭제 실패:', deleteError);
      } else {
        console.log('🗑️ 테스트 데이터 삭제 완료');
      }
    }
    
    console.log('🎉 Supabase 연결 테스트 완료!');
    
  } catch (error) {
    console.error('💥 연결 테스트 중 오류 발생:', error);
  }
}

testConnection();