// Supabase에서 현재 존재하는 테이블들 확인
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://qjirykgrrcspyicrpnoi.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqaXJ5a2dycmNzcHlpY3Jwbm9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyNjE2ODcsImV4cCI6MjA2OTgzNzY4N30.4j2xxYhN81XKx72LiuQZ9P3Y1iziBAJtmhPibEtcWvE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkExistingTables() {
  console.log('🔍 Supabase 테이블 목록 확인 중...');
  
  try {
    // PostgreSQL의 정보 스키마를 통해 테이블 목록 조회
    const { data, error } = await supabase.rpc('check_tables');
    
    if (error) {
      console.log('RPC 함수 없음. 다른 방법으로 확인...');
      
      // 가능한 테이블명들로 하나씩 확인
      const possibleTables = [
        'user_responses',
        'nestory_user_responses', 
        'landing_analytics',
        'active_users',
        'ab_test_results'
      ];
      
      for (const tableName of possibleTables) {
        console.log(`📊 ${tableName} 테이블 확인 중...`);
        const { data: tableData, error: tableError } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);
        
        if (!tableError) {
          console.log(`✅ ${tableName} 테이블 존재함`);
          console.log(`📊 ${tableName} 테이블의 데이터 개수 확인 중...`);
          
          const { count, error: countError } = await supabase
            .from(tableName)
            .select('*', { count: 'exact', head: true });
          
          if (!countError) {
            console.log(`📊 ${tableName}: ${count}개 레코드`);
          }
        } else {
          console.log(`❌ ${tableName}: ${tableError.message}`);
        }
      }
      
      // nestory 스키마 테이블들도 확인
      const nestoryTables = [
        'nestory.user_responses',
        'nestory.landing_analytics',
        'nestory.active_users', 
        'nestory.ab_test_results'
      ];
      
      console.log('\n🔍 nestory 스키마 테이블 확인...');
      for (const tableName of nestoryTables) {
        console.log(`📊 ${tableName} 테이블 확인 중...`);
        const { data: tableData, error: tableError } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);
        
        if (!tableError) {
          console.log(`✅ ${tableName} 테이블 존재함`);
          
          const { count, error: countError } = await supabase
            .from(tableName)
            .select('*', { count: 'exact', head: true });
          
          if (!countError) {
            console.log(`📊 ${tableName}: ${count}개 레코드`);
          }
        } else {
          console.log(`❌ ${tableName}: ${tableError.message}`);
        }
      }
    }
    
  } catch (error) {
    console.error('💥 테이블 확인 중 오류:', error);
  }
}

checkExistingTables();