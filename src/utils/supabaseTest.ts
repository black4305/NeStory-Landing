// Supabase 연결 및 기능 테스트 유틸리티

import { SupabaseService } from '../services/supabase';
import { AnalyticsData } from '../types';

export class SupabaseTestManager {
  // 1. 연결 테스트
  static async testConnection(): Promise<boolean> {
    try {
      console.log('🔌 Supabase 연결 테스트 시작...');
      const connected = await SupabaseService.initializeDatabase();
      
      if (connected) {
        console.log('✅ Supabase 연결 성공!');
        return true;
      } else {
        console.error('❌ Supabase 연결 실패');
        return false;
      }
    } catch (error) {
      console.error('❌ Supabase 연결 오류:', error);
      return false;
    }
  }

  // 2. 샘플 데이터 삽입 테스트
  static async testDataInsertion(): Promise<boolean> {
    try {
      console.log('📝 샘플 데이터 삽입 테스트 시작...');
      
      const sampleData: AnalyticsData = {
        sessionId: `test_${Date.now()}`,
        startTime: Date.now() - 60000, // 1분 전
        answers: [
          { questionId: 1, score: 4, timeSpent: 3000 },
          { questionId: 2, score: 2, timeSpent: 2500 },
          { questionId: 3, score: 5, timeSpent: 4000 }
        ],
        totalTime: 180000, // 3분
        clickCount: 15,
        scrollDepth: 85.5,
        deviceType: 'desktop',
        userAgent: 'Test User Agent',
        completed: true,
        result: 'ACF',
        userInfo: {
          name: '테스트 사용자',
          instagram: 'test@example.com',
          age: '20-30대',
          gender: '여성',
          familySize: '4인 가족',
          region: '서울',
          marketingConsent: true
        },
        submittedAt: Date.now(),
        reliabilityScore: 85.2,
        responsePattern: 'consistent'
      };

      const success = await SupabaseService.saveUserData(sampleData);
      
      if (success) {
        console.log('✅ 샘플 데이터 삽입 성공!');
        return true;
      } else {
        console.error('❌ 샘플 데이터 삽입 실패');
        return false;
      }
    } catch (error) {
      console.error('❌ 데이터 삽입 오류:', error);
      return false;
    }
  }

  // 3. 데이터 조회 테스트
  static async testDataRetrieval(): Promise<boolean> {
    try {
      console.log('🔍 데이터 조회 테스트 시작...');
      
      const data = await SupabaseService.getAllUserData();
      
      if (data && data.length >= 0) {
        console.log(`✅ 데이터 조회 성공! 총 ${data.length}개 레코드`);
        console.log('최근 데이터:', data.slice(0, 3));
        return true;
      } else {
        console.error('❌ 데이터 조회 실패');
        return false;
      }
    } catch (error) {
      console.error('❌ 데이터 조회 오류:', error);
      return false;
    }
  }

  // 4. 통계 데이터 테스트
  static async testStatistics(): Promise<boolean> {
    try {
      console.log('📊 통계 데이터 테스트 시작...');
      
      const stats = await SupabaseService.getStatsData();
      
      if (stats) {
        console.log('✅ 통계 데이터 조회 성공!');
        console.log('통계:', stats);
        return true;
      } else {
        console.error('❌ 통계 데이터 조회 실패');
        return false;
      }
    } catch (error) {
      console.error('❌ 통계 데이터 오류:', error);
      return false;
    }
  }

  // 5. 종합 테스트 실행
  static async runAllTests(): Promise<void> {
    console.log('🚀 Supabase 종합 테스트 시작!');
    console.log('=====================================');

    const tests = [
      { name: '연결 테스트', test: this.testConnection },
      { name: '데이터 삽입 테스트', test: this.testDataInsertion },
      { name: '데이터 조회 테스트', test: this.testDataRetrieval },
      { name: '통계 데이터 테스트', test: this.testStatistics }
    ];

    let passedTests = 0;
    
    for (const { name, test } of tests) {
      console.log(`\n🧪 ${name} 실행 중...`);
      const result = await test();
      
      if (result) {
        passedTests++;
        console.log(`✅ ${name} 통과`);
      } else {
        console.log(`❌ ${name} 실패`);
      }
    }

    console.log('\n=====================================');
    console.log(`🏁 테스트 완료: ${passedTests}/${tests.length} 통과`);
    
    if (passedTests === tests.length) {
      console.log('🎉 모든 테스트 통과! Supabase 설정이 완료되었습니다.');
    } else {
      console.log('⚠️ 일부 테스트 실패. 설정을 확인해주세요.');
    }
  }

  // 6. 테스트 데이터 정리
  static async cleanupTestData(): Promise<void> {
    try {
      console.log('🧹 테스트 데이터 정리 중...');
      
      const allData = await SupabaseService.getAllUserData();
      const testData = allData.filter(item => item.sessionId.startsWith('test_'));
      
      for (const item of testData) {
        await SupabaseService.deleteUserData(item.sessionId);
      }
      
      console.log(`✅ ${testData.length}개 테스트 데이터 정리 완료`);
    } catch (error) {
      console.error('❌ 테스트 데이터 정리 실패:', error);
    }
  }
}

// 브라우저 콘솔에서 사용할 수 있도록 전역 객체에 추가
declare global {
  interface Window {
    SupabaseTest: typeof SupabaseTestManager;
  }
}

if (typeof window !== 'undefined') {
  window.SupabaseTest = SupabaseTestManager;
  
  // 페이지 로드 시 자동으로 Supabase 연결 상태를 콘솔에 표시
  setTimeout(() => {
    console.log('%c🚀 NeStory Supabase 테스트 시스템', 'font-size: 16px; font-weight: bold; color: #4CAF50;');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #4CAF50;');
    
    console.log('\n💡 사용 가능한 테스트 명령어:');
    console.log('  🔄 window.SupabaseTest.runAllTests()     - 전체 테스트 실행');
    console.log('  🔌 window.SupabaseTest.testConnection()  - 연결 테스트만');
    console.log('  📝 window.SupabaseTest.testDataInsertion() - 데이터 삽입 테스트');
    console.log('  🔍 window.SupabaseTest.testDataRetrieval() - 데이터 조회 테스트');
    console.log('  📊 window.SupabaseTest.testStatistics()   - 통계 데이터 테스트');
    console.log('  🧹 window.SupabaseTest.cleanupTestData()  - 테스트 데이터 정리');
    
    console.log('\n🎯 추천: 먼저 전체 테스트를 실행해보세요!');
    console.log('%cwindow.SupabaseTest.runAllTests();', 'background: #e3f2fd; color: #1976d2; padding: 4px 8px; border-radius: 4px; font-family: monospace;');
    
    // 환경변수 설정 상태 확인
    const hasUrl = process.env.REACT_APP_SUPABASE_URL;
    const hasKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
    
    console.log('\n⚙️ 환경변수 설정 상태:');
    console.log(`  📍 SUPABASE_URL: ${hasUrl ? '✅ 설정됨' : '❌ 미설정'}`);
    console.log(`  🔑 SUPABASE_KEY: ${hasKey ? '✅ 설정됨' : '❌ 미설정'}`);
    
    if (!hasUrl || !hasKey) {
      console.log('\n⚠️ Supabase 환경변수가 설정되지 않았습니다!');
      console.log('   .env 파일에 다음 정보를 입력해주세요:');
      console.log('   REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co');
      console.log('   REACT_APP_SUPABASE_ANON_KEY=your-anon-key');
    } else {
      console.log('\n🎉 환경변수 설정 완료! 테스트를 실행할 수 있습니다.');
      
      // 자동으로 연결 테스트 실행
      setTimeout(() => {
        console.log('\n🔄 자동 연결 테스트 시작...');
        SupabaseTestManager.testConnection().then(connected => {
          if (connected) {
            console.log('✅ Supabase 연결 성공! 모든 기능이 준비되었습니다.');
          } else {
            console.log('❌ Supabase 연결 실패. SQL 설정을 확인해주세요.');
          }
        });
      }, 1000);
    }
    
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #4CAF50;');
  }, 2000); // 페이지 로드 후 2초 뒤에 표시
}