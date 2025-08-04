// SQL을 직접 실행해서 테이블 확인
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://qjirykgrrcspyicrpnoi.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqaXJ5a2dycmNzcHlpY3Jwbm9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyNjE2ODcsImV4cCI6MjA2OTgzNzY4N30.4j2xxYhN81XKx72LiuQZ9P3Y1iziBAJtmhPibEtcWvE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTablesWithSQL() {
  console.log('🔍 SQL로 테이블 목록 확인 중...');
  
  try {
    // 1. 모든 스키마 확인
    console.log('📊 1. 사용 가능한 스키마 확인...');
    const { data: schemas, error: schemaError } = await supabase.rpc('sql', {
      query: `
        SELECT schema_name 
        FROM information_schema.schemata 
        WHERE schema_name NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
        ORDER BY schema_name;
      `
    });
    
    if (!schemaError && schemas) {
      console.log('✅ 스키마 목록:', schemas.map(s => s.schema_name));
    } else {
      console.log('❌ 스키마 조회 실패, 다른 방법 시도...');
    }
    
    // 2. nestory 스키마의 테이블 확인
    console.log('\n📊 2. nestory 스키마 테이블 확인...');
    const { data: tables, error: tableError } = await supabase.rpc('sql', {
      query: `
        SELECT table_name, table_schema
        FROM information_schema.tables 
        WHERE table_schema = 'nestory'
        ORDER BY table_name;
      `
    });
    
    if (!tableError && tables) {
      console.log('✅ nestory 스키마 테이블:', tables);
    } else {
      console.log('❌ nestory 스키마 테이블 조회 실패:', tableError?.message || 'Unknown error');
    }
    
    // 3. public 스키마의 테이블 확인
    console.log('\n📊 3. public 스키마 테이블 확인...');
    const { data: publicTables, error: publicError } = await supabase.rpc('sql', {
      query: `
        SELECT table_name, table_schema
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name LIKE '%user%' OR table_name LIKE '%nestory%'
        ORDER BY table_name;
      `
    });
    
    if (!publicError && publicTables) {
      console.log('✅ public 스키마 관련 테이블:', publicTables);
    } else {
      console.log('❌ public 스키마 테이블 조회 실패:', publicError?.message || 'Unknown error');
    }
    
    // 4. 모든 테이블 확인 (스키마 무관)
    console.log('\n📊 4. 모든 사용자 테이블 확인...');
    const { data: allTables, error: allError } = await supabase.rpc('sql', {
      query: `
        SELECT table_name, table_schema
        FROM information_schema.tables 
        WHERE table_type = 'BASE TABLE'
        AND table_schema NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
        ORDER BY table_schema, table_name;
      `
    });
    
    if (!allError && allTables) {
      console.log('✅ 모든 사용자 테이블:');
      allTables.forEach(table => {
        console.log(`   ${table.table_schema}.${table.table_name}`);
      });
    } else {
      console.log('❌ 전체 테이블 조회 실패:', allError?.message || 'Unknown error');
    }
    
  } catch (error) {
    console.error('💥 SQL 실행 중 오류:', error);
    console.log('\n💡 RPC 함수를 사용할 수 없는 것 같습니다.');
    console.log('   Supabase 대시보드에서 직접 확인해보세요:');
    console.log('   1. SQL Editor 열기');
    console.log('   2. SELECT * FROM information_schema.tables WHERE table_schema = \'nestory\';');
  }
}

checkTablesWithSQL();